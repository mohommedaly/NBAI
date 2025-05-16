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
    // Fetch subjects from json-server
    this.api.getSubjects().subscribe(
      (data) => this.subjects = data,
      (error) => console.error('Failed to load subjects', error)
    );
  }

  startExam() {
    if (this.studentName.trim() && this.selectedSubject) {
      this.api.setStudentName(this.studentName);

      // Optional: Store selected subject if needed elsewhere
      this.api.setSelectedSubject(this.selectedSubject);

      // Navigate to exam page
      this.router.navigate(['/exm'], {
        queryParams: { subjectId: this.selectedSubject.id }
      });
    }
  }
}
