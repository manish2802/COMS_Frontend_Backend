import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNo: string;
  address: {
    city: string;
    state: string;
    area: string;
  };
  totalBalance?: number;
  joinDate?: Date;
  cardNumber?: string;
  loanAccountNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Customerservice {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  customers$ = this.customersSubject.asObservable();

  private readonly baseUrl = 'http://localhost:8080/customer-api';

  constructor(private http: HttpClient) { }

  addCustomer(customerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-new-customer`, customerData).pipe(
      tap(() => this.refreshCustomers())
    );
  }

  getCustomers(): Observable<Customer[]> { // This can be deprecated or used for initial load
    // Assuming your API endpoint for getting customers is /get-all-customers
    return this.http.get<Customer[]>(`${this.baseUrl}/get-all-customers`);
  }

  refreshCustomers(): void {
    this.http.get<Customer[]>(`${this.baseUrl}/get-all-customers`).subscribe(customers => {
      this.customersSubject.next(customers);
    });
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/get-customer/${id}`);
  }

  updateCustomer(id: string, customerData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-customer/${id}`, customerData).pipe(
      tap(() => this.refreshCustomers())
    );
  }

  searchCustomers(criteria: { [key: string]: string }): Observable<Customer[]> {
    let params = new HttpParams();
    Object.keys(criteria).forEach(key => {
      if (criteria[key]) {
        params = params.set(key, criteria[key]);
      }
    });
    return this.http.get<Customer[]>(`${this.baseUrl}/search-customers`, { params });
  }

  searchByCard(cardNumber: string): Observable<Customer[]> {
    const params = new HttpParams().set('cardNumber', cardNumber);
    return this.http.get<Customer[]>(`${this.baseUrl}/search-by-card`, { params });
  }

  searchByLoan(loanNumber: string): Observable<Customer[]> {
    const params = new HttpParams().set('loanNumber', loanNumber);
    return this.http.get<Customer[]>(`${this.baseUrl}/search-by-loan`, { params });
  }
}
