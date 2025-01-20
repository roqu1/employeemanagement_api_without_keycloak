import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../shared/models/employee';
import { EmployeeService } from '../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees$: Observable<Employee[]>;

  constructor(private employeeService: EmployeeService) {
    this.employees$ = this.employeeService.getEmployees();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.employeeService.getEmployees();
  }
}
