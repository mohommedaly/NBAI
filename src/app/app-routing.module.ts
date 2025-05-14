import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam/exam.component';
import { ResultComponent } from './result/result.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
path:'',component:LoginComponent
  },
 { path: 'exm', component: ExamComponent },
  { path: 'result', component: ResultComponent }, // optional
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
