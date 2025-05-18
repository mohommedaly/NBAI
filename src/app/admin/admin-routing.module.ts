import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageExamComponent } from './manage-exam/manage-exam.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [{ path: '', component: AdminDashboardComponent },
  { path: 'manageexam', component: ManageExamComponent},
  { path: 'result', component: ResultComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
