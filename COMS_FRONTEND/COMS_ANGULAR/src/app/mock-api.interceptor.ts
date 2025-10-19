import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Customer } from './customer/customerservice';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private mockCustomers: Customer[] = [
    {
      customerId: '1',
      firstName: 'John',
      lastName: 'Doe',
      emailId: 'john.doe@example.com',
      phoneNo: '123-456-7890',
      address: { city: 'New York', state: 'NY', area: 'Manhattan' },
      totalBalance: 150000,
      joinDate: new Date('2023-05-15'),
      cardNumber: '4242-4242-4242-4242',
      loanAccountNumber: 'LN-1001',
    },
    {
      customerId: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      emailId: 'jane.smith@example.com',
      phoneNo: '987-654-3210',
      address: { city: 'Los Angeles', state: 'CA', area: 'Hollywood' },
      totalBalance: 275000,
      joinDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Last month
      cardNumber: '5555-5555-5555-5555',
      loanAccountNumber: 'LN-1002',
    },
    {
      customerId: '3',
      firstName: 'Peter',
      lastName: 'Jones',
      emailId: 'peter.jones@example.com',
      phoneNo: '555-555-5555',
      address: { city: 'Chicago', state: 'IL', area: 'The Loop' },
      totalBalance: 89000,
      joinDate: new Date(), // Today
      cardNumber: '4111-1111-1111-1111',
      loanAccountNumber: 'LN-1003',
    },
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, body } = req;

    // GET all customers
    if (url.endsWith('/get-all-customers') && method === 'GET') {
      return of(new HttpResponse({ status: 200, body: this.mockCustomers })).pipe(delay(500));
    }

    // GET customer by ID
    const getByIdMatch = url.match(/\/get-customer\/(.+)/);
    if (getByIdMatch && method === 'GET') {
      const id = getByIdMatch[1];

      // Simulate a 404 Not Found error for a specific ID
      if (id === '999') {
        const errorResponse = new HttpErrorResponse({
          status: 404,
          statusText: 'Not Found',
          url: req.url,
        });
        return throwError(() => errorResponse).pipe(delay(500));
      }

      const customer = this.mockCustomers.find((c) => c.customerId === id);
      return of(new HttpResponse({ status: 200, body: customer })).pipe(delay(300));
    }

    // ADD new customer
    if (url.endsWith('/add-new-customer') && method === 'POST') {
      const newCustomer = body.customer;
      newCustomer.customerId = (this.mockCustomers.length + 1).toString(); // Simple ID generation
      this.mockCustomers.push(newCustomer);
      return of(new HttpResponse({ status: 201, body: newCustomer })).pipe(delay(500));
    }

    // UPDATE customer
    const updateMatch = url.match(/\/update-customer\/(.+)/);
    if (updateMatch && method === 'PUT') {
      const id = updateMatch[1];
      const updatedCustomerData = body;
      const customerIndex = this.mockCustomers.findIndex(c => c.customerId === id);

      if (customerIndex !== -1) {
        // Merge existing customer with new data
        this.mockCustomers[customerIndex] = { ...this.mockCustomers[customerIndex], ...updatedCustomerData };
        return of(new HttpResponse({ status: 200, body: this.mockCustomers[customerIndex] })).pipe(delay(500));
      }
      return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
    }

    // SEARCH customers
    if (url.includes('/search-customers') && method === 'GET') {
      const customerId = req.params.get('customerId')?.toLowerCase();
      const emailId = req.params.get('emailId')?.toLowerCase();
      const phoneNo = req.params.get('phoneNo')?.toLowerCase();
      
      if (!customerId && !emailId && !phoneNo ) {
        return of(new HttpResponse({ status: 200, body: [] })).pipe(delay(200));
      }
      const results = this.mockCustomers.filter(c =>
        (customerId && c.customerId.toLowerCase().includes(customerId)) ||
        (emailId && c.emailId.toLowerCase().includes(emailId)) ||
        (phoneNo && c.phoneNo.toLowerCase().includes(phoneNo))
      );
      return of(new HttpResponse({ status: 200, body: results })).pipe(delay(400));
    }

    // SEARCH by Card
    if (url.includes('/search-by-card') && method === 'GET') {
      const cardNumber = req.params.get('cardNumber');
      const results = this.mockCustomers.filter(c => c.cardNumber === cardNumber);
      return of(new HttpResponse({ status: 200, body: results })).pipe(delay(400));
    }

    // SEARCH by Loan
    if (url.includes('/search-by-loan') && method === 'GET') {
      const loanNumber = req.params.get('loanNumber');
      const results = this.mockCustomers.filter(c => c.loanAccountNumber === loanNumber);
      return of(new HttpResponse({ status: 200, body: results })).pipe(delay(400));
    }

    // If no route is matched, pass the request through
    return next.handle(req);
  }
}