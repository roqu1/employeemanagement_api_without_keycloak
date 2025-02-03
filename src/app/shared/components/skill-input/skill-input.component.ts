import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Qualification } from '../../models/employee';
import {EmployeeService} from "../../../core/services/employee.service";

@Component({
  selector: 'app-skill-input',
  templateUrl: './skill-input.component.html',
  styleUrls: ['./skill-input.component.css']
})
export class SkillInputComponent implements OnInit, OnChanges {
  @Input() isEditing: boolean = false;
  @Input() selectedSkillsInput: Qualification[] = [];
  @Output() skillsChange = new EventEmitter<Qualification[]>();

  allQualifications: Qualification[] = [];
  selectedSkills: Qualification[] = [];
  newSkill: string = '';

  isLoading: boolean = false;
  isAdding: boolean = false;
  selectedSkillId: number | null = null;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadQualifications();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSkillsInput'] && this.selectedSkillsInput) {
      this.selectedSkills = [...this.selectedSkillsInput];
      console.log("selectedSkills changed", this.selectedSkills)
    }
  }

  loadQualifications(): void {
    this.isLoading = true;
    this.employeeService.getAllQualifications().subscribe(
      (data: Qualification[]) => {
        this.allQualifications = data.filter(qualification =>
          !this.selectedSkills.some(selectedSkill => selectedSkill.id === qualification.id)
        );
        this.isLoading = false;
        if (this.selectedSkillsInput) {
          this.selectedSkills = [...this.selectedSkillsInput]
        }
      },
      (error: any) => {
        console.error('Error fetching qualifications:', error);
        this.isLoading = false;
      }
    )
  }

  addSelectedSkill(): void {
    if (this.selectedSkillId) {
      const skill = this.allQualifications.find(s => s.id === this.selectedSkillId)
      if(skill) {
        this.toggleSkill(skill);
        this.selectedSkillId = null;
      }
    }
  }

  addSkill(skill: string): void {
    if (!skill) {
      return;
    }
    this.isLoading = true;
    this.employeeService.addQualification(skill).subscribe(
      (newSkill) => {
        this.allQualifications.push(newSkill);
        this.newSkill = '';
        this.loadQualifications();
      },
      (error: any) => {
        console.error('Error adding skill:', error);
      }
    ).add(() => this.isLoading = false);
  }

  toggleSkill(skill: Qualification): void {
    const index = this.selectedSkills.findIndex(s => s.id === skill.id)
    if (index === -1) {
      this.selectedSkills.push(skill)
    } else {
      this.selectedSkills.splice(index, 1)
    }
    this.skillsChange.emit(this.selectedSkills)
  }

  removeSkill(skill: Qualification): void {
    this.selectedSkills = this.selectedSkills.filter(s => s.id !== skill.id);
    this.skillsChange.emit(this.selectedSkills);
  }

  toggleAddMode(): void {
    this.isAdding = !this.isAdding;
  }

  isSelected(skill: Qualification): boolean {
    return this.selectedSkills.some(s => s.id === skill.id);
  }

  deleteSelectedQualification(): void {
    if (this.selectedSkillId) {
      this.isLoading = true;
      this.employeeService.deleteQualification(this.selectedSkillId)
        .subscribe(
          () => {
            this.allQualifications = this.allQualifications.filter(q => q.id !== this.selectedSkillId);
            this.selectedSkills = this.selectedSkills.filter(q => q.id !== this.selectedSkillId);
            this.selectedSkillId = null;
            this.skillsChange.emit(this.selectedSkills);
            console.log('Qualification successfully deleted.');
          },
          (error) => {
            console.error('Error deleting qualification:', error);
          }
        ).add(() => this.isLoading = false);
    }
  }
}
