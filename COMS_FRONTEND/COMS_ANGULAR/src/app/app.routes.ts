import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerFormComponent } from './customer/add-customer/customer-form.component';
import { canDeactivateFormGuard } from './guards/can-deactivate-form.guard';
import { FindCustomerComponent } from './customer/find-customer/find-customer.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-customer', component: CustomerFormComponent, canDeactivate: [canDeactivateFormGuard] },
  { path: 'customer/:id', component: CustomerFormComponent, canDeactivate: [canDeactivateFormGuard] },
  { path: 'find-customer', component: FindCustomerComponent },
  { path: '**', redirectTo: '/dashboard' } // Wildcard route for a 404-like redirect
];