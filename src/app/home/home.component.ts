import { Component, OnInit } from '@angular/core';
import { Employee } from '../shared/models/employee';
import { EmployeeService } from '../core/services/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data) => (this.employees = data),
      (error) => console.error('Error fetching employees:', error)
    );
  }
}
