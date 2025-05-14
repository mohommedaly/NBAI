import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
studentName: string = '';

  constructor(private router: Router, private api: ApiService) {}

  startExam() {
    if (this.studentName.trim()) {
      this.api.setStudentName(this.studentName);
      this.router.navigate(['/exm']);
    }
  }
}
