import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Employee } from '../../shared/models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = '/backend';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(this.apiUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  searchEmployees(searchTerm: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, this.httpOptions).pipe(
      map((employees) =>
        employees.filter(
          (emp) =>
            emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error.message || 'Server error');
  }
}
