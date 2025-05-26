import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  studentName: string = '';
  subjects: any[] = [];
  selectedSubject: any;

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSubjects().subscribe(
      (data) => this.subjects = data,
      (error) => console.error('Failed to load subjects', error)
    );
  }

  startExam(form: any) {
    if (form.valid) {
      this.api.setStudentName(this.studentName);
      this.api.setSelectedSubject(this.selectedSubject);
      const subjectId = this.selectedSubject.id;

      this.router.navigate(['/exm'], {
        queryParams: { subjectId: subjectId }
      });
    }
  }

  goToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }
}
