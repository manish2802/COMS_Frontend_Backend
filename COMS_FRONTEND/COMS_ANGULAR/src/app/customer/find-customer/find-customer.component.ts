import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Customer, Customerservice } from '../customerservice';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-find-customer',
  templateUrl: './find-customer.component.html',
  styleUrls: ['./find-customer.component.css']
})
export class FindCustomerComponent {
  // Forms
  customerSearchForm: FormGroup;
  cardSearchForm: FormGroup;
  loanSearchForm: FormGroup;

  // Result Observables
  customerResults$!: Observable<Customer[]>;
  cardResults$!: Observable<Customer[]>;
  loanResults$!: Observable<Customer[]>;

  // State for Customer Search
  searchingCustomer = false;
  customerSearchAttempted = false;
  customerError: string | null = null;

  // State for Card Search
  searchingCard = false;
  cardSearchAttempted = false;
  cardError: string | null = null;

  // State for Loan Search
  searchingLoan = false;
  loanSearchAttempted = false;
  loanError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: Customerservice,
  ) {
    this.customerSearchForm = this.fb.group({
      customerId: [''],
      emailId: ['', Validators.email],
      phoneNo: ['']
    }, { validators: atLeastOneFieldValidator() });

    this.cardSearchForm = this.fb.group({
      cardNumber: ['', Validators.required],
    });

    this.loanSearchForm = this.fb.group({
      loanAccountNumber: ['', Validators.required],
    });
  }

  onCustomerSearch(): void {
    if (this.customerSearchForm.invalid) return;
    this.searchingCustomer = true;
    this.customerSearchAttempted = true;
    this.customerError = null;
    const searchCriteria = this.customerSearchForm.value;

    this.customerResults$ = this.customerService.searchCustomers(searchCriteria).pipe(
      finalize(() => this.searchingCustomer = false),
      catchError(err => {
        this.customerError = `An error occurred during search: ${err.message}`;
        return of([]);
      })
    );
  }

  onCardSearch(): void {
    if (this.cardSearchForm.invalid) return;
    this.searchingCard = true;
    this.cardSearchAttempted = true;
    this.cardError = null;
    const cardNumber = this.cardSearchForm.value.cardNumber;

    this.cardResults$ = this.customerService.searchByCard(cardNumber).pipe(
      finalize(() => this.searchingCard = false),
      catchError(err => {
        this.cardError = `An error occurred during card search: ${err.message}`;
        return of([]);
      })
    );
  }

  onLoanSearch(): void {
    if (this.loanSearchForm.invalid) return;
    this.searchingLoan = true;
    this.loanSearchAttempted = true;
    this.loanError = null;
    const loanNumber = this.loanSearchForm.value.loanAccountNumber;

    this.loanResults$ = this.customerService.searchByLoan(loanNumber).pipe(
      finalize(() => this.searchingLoan = false),
      catchError(err => {
        this.loanError = `An error occurred during loan search: ${err.message}`;
        return of([]);
      })
    );
  }

  onCustomerClear(): void {
    this.customerSearchForm.reset();
    this.customerSearchAttempted = false;
    this.customerError = null;
  }

  onCardClear(): void {
    this.cardSearchForm.reset();
    this.cardSearchAttempted = false;
    this.cardError = null;
  }

  onLoanClear(): void {
    this.loanSearchForm.reset();
    this.loanSearchAttempted = false;
    this.loanError = null;
  }
}

export function atLeastOneFieldValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controls = (control as FormGroup).controls;
    const oneFieldHasValue = Object.keys(controls).some(key => !!controls[key].value);

    return oneFieldHasValue ? null : { atLeastOneRequired: true };
  };
}