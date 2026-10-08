import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Subject } from '../../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  studentName: string = '';
  subjects: any[] = [];
  selectedSubject: any = null;
  isLoading = true;

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load subjects', error);
        this.isLoading = false;
      }
    });
  }

  startExam(form: any): void {
    if (form.valid && this.selectedSubject) {
      this.api.setStudentName(this.studentName.trim());
      this.api.setSelectedSubject(this.selectedSubject);
      const subjectId = this.selectedSubject.id;

      this.router.navigate(['/exam'], {
        queryParams: { 
          subjectId: subjectId,
          subName: this.selectedSubject.subjectName
        }
      });
    }
  }

  goToAdminLogin(): void {
    this.router.navigate(['/admin']);
  }
}
