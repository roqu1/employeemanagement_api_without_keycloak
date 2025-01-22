import { Component, OnInit } from '@angular/core';
import { Employee } from '../shared/models/employee';
import { EmployeeService } from '../core/services/employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | undefined;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployee();
  }

  loadEmployee() {
    this.employee = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      street: "123 Main St",
      postcode: "12345",
      city: "Anytown",
      phone: "555-123-4567",

    };
  }
}
