import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
goToAdminLogin() {
this.router.navigate(['/admin-login']);
}
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
    // Store student name
    this.api.setStudentName(this.studentName);

    // Store the selected subject
    this.api.setSelectedSubject(this.selectedSubject);

    // You can also directly store the subjectId if needed
    const subjectId = this.selectedSubject.id;
    this.api.setSelectedSubject(subjectId);  // Store the subjectId

    // Navigate to the exam page
    this.router.navigate(['/exm'], {
      queryParams: { subjectId: subjectId }
    });
  }
}

}
