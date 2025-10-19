import { Component, Input } from '@angular/core';
import { Customer } from '../customerservice';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h3 class="results-header">Search Results</h3>
    <div *ngIf="customers$ | async as customers; else loading">
      <div *ngIf="error" class="error-message">{{ error }}</div>
      <div *ngIf="!error && customers.length > 0; else noResults" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let customer of customers">
              <td>{{ customer.firstName }} {{ customer.lastName }}</td>
              <td>{{ customer.emailId }}</td>
              <td class="actions-cell">
                <a [routerLink]="['/customer', customer.customerId]" class="action-button view">View Details</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ng-template #noResults>
        <p class="info-message">No customers found matching your search term.</p>
      </ng-template>
    </div>
    <ng-template #loading><p class="info-message">Loading results...</p></ng-template>
  `,
  styleUrls: ['./find-customer.component.css']
})
export class SearchResultsComponent {
  @Input() customers$!: Observable<Customer[]>;
  @Input() error: string | null = null;
}