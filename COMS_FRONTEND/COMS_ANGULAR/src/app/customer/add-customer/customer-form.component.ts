import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customerservice } from '../customerservice';
import { Observable, of } from 'rxjs';
import { CanComponentDeactivate } from '../../guards/can-deactivate-form.guard';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent implements OnInit, CanComponentDeactivate {
  customerForm!: FormGroup;
  submitting = false;
  submitted = false; // Add a flag to track successful submission
  statusMessage: string | null = null;
  statusType: 'success' | 'error' | null = null;
  isEditMode = false;
  private customerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: Customerservice,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Only show confirmation if the form is dirty and has NOT been successfully submitted
    if (this.customerForm.dirty && !this.submitted) {
      const confirmation = confirm('You have unsaved changes! Do you really want to leave?');
      return of(confirmation);
    }
    return true;
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      customer: this.createCustomerGroup()
    });

    this.route.paramMap.subscribe(params => {
      this.customerId = params.get('id');
      if (this.customerId) {
        this.isEditMode = true;
        this.customerService.getCustomerById(this.customerId).subscribe(customer => {
          // The API seems to return the customer object directly, not nested.
          this.customerForm.get('customer')?.patchValue(customer);
        });
      }
    });
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Customer' : 'Add Customer';
  }
  private createCustomerGroup(): FormGroup {
    return this.fb.group({
      customerId: [''], // Not required for user input, especially on create
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      address: this.fb.group({
        city: ['', Validators.required],
        state: ['', Validators.required],
        area: ['', Validators.required]
      })
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    this.submitting = true;
    this.statusMessage = null;
    const payload = this.customerForm.value;

    const request = this.isEditMode && this.customerId
      ? this.customerService.updateCustomer(this.customerId, payload.customer)
      : this.customerService.addCustomer(payload);

    request.subscribe({
        next: () => {
            const action = this.isEditMode ? 'updated' : 'created';
            this.statusMessage = `Customer was successfully ${action}.`;
            this.statusType = 'success';
            this.submitted = true; // Mark as submitted to bypass the canDeactivate guard
            this.submitting = false;
            this.customerForm.markAsPristine(); // Prevent canDeactivate guard after success

            // Optional: Navigate away after a short delay
            // const customerId = this.isEditMode ? this.customerId : payload.customer.customerId;
            // setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        },
        error: (err) => {
            this.statusMessage = `Server returned HTTP ${err.status}: ${err.statusText}`;
            this.statusType = 'error';
            this.submitting = false;
        }
    });
  }

  onReset(): void {
    this.customerForm.setControl('customer', this.createCustomerGroup());
    this.customerForm.markAsPristine();
    this.statusMessage = null;
  }
}