import { Component, OnInit } from '@angular/core';
import { Employee } from '../shared/models/employee';
import { EmployeeService } from '../core/services/employee.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  employees: Employee[] = [];
  searchSubject: Subject<string> = new Subject();
  isLoading: boolean = false;

  constructor(private employeeService: EmployeeService,
              private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((searchTerm) => this.searchEmployees(searchTerm));
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching employees:', error);
        this.isLoading = false;
      }
    );
  }

  onSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  searchEmployees(searchTerm: string): void {
    this.isLoading = true;
    this.employeeService.searchEmployees(searchTerm).subscribe(
      (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching employees:', error);
        this.isLoading = false;
      }
    );
  }

  goToEmployeeDetail(employeeId: number | undefined) {
    if (employeeId !== undefined) {
      this.router.navigate(['/employee', employeeId]);
    } else {
      console.error("Employee ID is undefined")
    }
  }
}
