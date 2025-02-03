import { Component, OnInit } from '@angular/core';
import { Employee, Qualification } from '../shared/models/employee';
import { EmployeeService } from '../core/services/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import { forkJoin, Observable } from "rxjs";

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | undefined;
  employeeId: number = 0;
  isEditing: boolean = false;
  employeeNotFoundError: boolean = false;

  firstNameInput: string = '';
  lastNameInput: string = '';
  streetInput: string = '';
  cityInput: string = '';
  postcodeInput: string = '';
  phoneInput: string = '';
  selectedSkills: Qualification[] = [];
  isLoading: boolean = false;


  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.employeeId = +params['id'];
      this.loadEmployee();
    });
  }

  loadEmployee() {
    this.isLoading = true;
    this.employeeService.getEmployee(this.employeeId).subscribe(
      (employee) => {
        if (employee) {
          this.employee = employee;
          this.firstNameInput = employee.firstName || '';
          this.lastNameInput = employee.lastName || '';
          this.streetInput = employee.street || '';
          this.cityInput = employee.city || '';
          this.postcodeInput = employee.postcode || '';
          this.phoneInput = employee.phone || '';
          this.selectedSkills = (this.employee?.skillSet || []).map(skill => ({id: skill.id, skill: skill.skill}))
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching employee:', error);
        this.employeeNotFoundError = true;
        this.isLoading = false;
      }
    );
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  saveEmployee() {
    if (!this.employee || !this.employeeId) return;

    const updatedFields: Partial<Employee> = {};

    if (this.firstNameInput !== this.employee.firstName) {
      updatedFields.firstName = this.firstNameInput;
    }
    if (this.lastNameInput !== this.employee.lastName) {
      updatedFields.lastName = this.lastNameInput;
    }
    if (this.streetInput !== this.employee.street) {
      updatedFields.street = this.streetInput;
    }
    if (this.cityInput !== this.employee.city) {
      updatedFields.city = this.cityInput;
    }
    if (this.postcodeInput !== this.employee.postcode) {
      updatedFields.postcode = this.postcodeInput;
    }
    if (this.phoneInput !== this.employee.phone) {
      updatedFields.phone = this.phoneInput;
    }

    updatedFields.id = this.employeeId;

    this.isLoading = true;

    this.employeeService.updateEmployee(updatedFields as Employee).subscribe(
      (updatedEmp) => {
        this.employee = { ...this.employee, ...updatedFields };
        this.updateEmployeeSkills();
      },
      (error) => {
        console.error('Error updating employee:', error);
        this.isLoading = false;
      }
    );
  }

  updateEmployeeSkills() {
    if (!this.employeeId) {
      return;
    }
    this.isLoading = true;

    this.employeeService.getEmployeeQualifications(this.employeeId).subscribe(
      (currentQualifications) => {
        let currentSkillIds: number[] = [];
        if (Array.isArray(currentQualifications)) {
          currentSkillIds = currentQualifications
            .map(q => q.id)
            .filter(id => id !== undefined) as number[];
        }

        const skillsToRemove = currentSkillIds.filter(skillId => !this.selectedSkills.map(skill => skill.id).includes(skillId))
          .map(skillId => ({ id: skillId }));

        const addObservables = this.selectedSkills.map(skill => {
          if (skill.id && !currentSkillIds.includes(skill.id) && skill.skill) {
            return this.employeeService.addQualificationToEmployee(this.employeeId, skill.skill);
          }
          return null;
        }).filter(observable => observable !== null) as Observable<any>[];

        const removeObservables = skillsToRemove.map(skill => {
          if (skill.id) {
            return this.employeeService.deleteQualificationFromEmployee(this.employeeId, skill.id);
          }
          return null;
        }).filter(observable => observable !== null) as Observable<any>[];

        forkJoin([...addObservables, ...removeObservables]).subscribe(
          () => {
            this.isEditing = false;
            this.loadEmployee();
            console.log('Employee updated successfully with skills:', this.selectedSkills);
          },
          (error) => {
            console.error('Error updating employee skills:', error);
          }
        );
      },
      (error) => {
        console.error("Error fetching employee skills", error);
      }
    ).add(() => this.isLoading = false);
  }

  skillsChanged(skills: Qualification[]) {
    this.selectedSkills = skills;
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }
}
