import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './shared/components/icon/icon.component';
import { SkillInputComponent } from './shared/components/skill-input/skill-input.component';

@NgModule({
  declarations: [
    AppComponent,
    IconComponent,
    EmployeeDetailComponent,
    HomeComponent,
    SkillInputComponent,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
