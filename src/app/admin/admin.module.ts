import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NavAdminComponent } from './nav-admin/nav-admin.component';
import { CardsDashboardComponent } from './admin-dashboard/cards-dashboard/cards-dashboard.component';
import { ManageExamComponent } from './manage-exam/manage-exam.component';

import { MCardsComponent } from './manage-exam/m-cards/m-cards.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageQueComponent } from './manage-exam/manage-que/manage-que.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    NavAdminComponent,
    CardsDashboardComponent,
    ManageExamComponent,
   
    MCardsComponent,
    ManageQueComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule
   
  ]
})
export class AdminModule { }
