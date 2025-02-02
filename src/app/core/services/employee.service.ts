import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Employee } from '../../shared/models/employee';
import { Qualification } from '../../shared/models/employee';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = '/backend';
  private baseUrl = environment.apiUrl;
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

  getEmployee(id: number): Observable<Employee> {
    return this.http
      .get<Employee>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http
      .put<Employee>(`${this.baseUrl}/employees/${employee.id}`, employee, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getEmployeeQualifications(id: number): Observable<Qualification[] | null> {
    return this.http
      .get<Qualification[] | null>(`${this.baseUrl}/employees/${id}/qualifications`, this.httpOptions)
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

  getAllQualifications(): Observable<Qualification[]> {
    return this.http.get<Qualification[]>(`${this.baseUrl}/qualifications`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addQualification(skill: string): Observable<Qualification> {
    return this.http.post<Qualification>(`${this.baseUrl}/qualifications`, {skill: skill}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteQualification(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/qualifications/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addQualificationToEmployee(employeeId: number, skill: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/employees/${employeeId}/qualifications`, { skill }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteQualificationFromEmployee(employeeId: number, qualificationId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employees/${employeeId}/qualifications/${qualificationId}`, this.httpOptions)
      .pipe(catchError(this.handleError))
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error.message || 'Server error');
  }
}
