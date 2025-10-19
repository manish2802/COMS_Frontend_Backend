import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FindCustomerComponent } from './find-customer/find-customer.component';
import { SearchResultsComponent } from './find-customer/search-results.component';
import { CustomerFormComponent } from './add-customer/customer-form.component';



@NgModule({
  declarations: [
    CustomerFormComponent,
    FindCustomerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SearchResultsComponent
  ]
})
export class CustomerModule { }