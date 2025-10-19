import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Customer, Customerservice } from '../customer/customerservice';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  customers$!: Observable<Customer[]>;

  constructor(private customerService: Customerservice) {}

  ngOnInit(): void {
    this.customers$ = this.customerService.customers$;
    this.customerService.refreshCustomers(); // Initial data load
  }

  
}
