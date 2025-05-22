import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam/exam.component';
import { ResultComponent } from './admin/result/result.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {
path:'',component:LoginComponent
  },
 { path: 'exm', component: ExamComponent },
  { path: 'result', component: ResultComponent },
  { path: 'admin1', component:AdminComponent, loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }, // optional
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
