import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Customer, Customerservice } from '../customer/customerservice';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  customers$!: Observable<Customer[]>;
  error: string | null = null;
  totalCustomers = 0;
  customersByState: { [state: string]: number } = {};
  totalAssets = 0;
  newCustomersThisMonth = 0;
  successMessage: string | null = null;

  constructor(private customerService: Customerservice, private router: Router) {
    // Check for state passed from another component
    const navigation = this.router.getCurrentNavigation();
    this.successMessage = navigation?.extras?.state?.['message'];
  }

  ngOnInit(): void {
    // Trigger a refresh of the customer list every time the dashboard is loaded.
    this.customerService.refreshCustomers();

    this.customers$ = this.customerService.customers$.pipe(
      tap((customers) => {
        this.calculateStats(customers);
      }),
      catchError((err) => {
        this.error = `Failed to load customers. Server returned: ${err.message}`;
        return of([]); // Return an empty array to keep the UI consistent
      })
    );
  }

  private calculateStats(customers: Customer[]): void {
    // Reset stats before recalculating to avoid accumulation on data refresh
    this.totalAssets = 0;
    this.newCustomersThisMonth = 0;

    this.totalCustomers = customers.length;
    this.customersByState = customers.reduce((acc, customer) => {
      // Mock data for demonstration if not present
      customer.totalBalance = customer.totalBalance ?? Math.random() * 100000;
      customer.joinDate = customer.joinDate ?? new Date(new Date().setMonth(new Date().getMonth() - Math.floor(Math.random() * 6)));

      this.totalAssets += customer.totalBalance;

      const today = new Date();
      if (customer.joinDate.getMonth() === today.getMonth() && customer.joinDate.getFullYear() === today.getFullYear()) {
        this.newCustomersThisMonth++;
      }

      if (customer.address && customer.address.state) {
        const state = customer.address.state;
        acc[state] = (acc[state] || 0) + 1;
      }
      return acc;
    }, {} as { [state: string]: number });
  }

  get states(): string[] {
    return Object.keys(this.customersByState);
  }
}