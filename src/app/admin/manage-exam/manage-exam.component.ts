import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-exam',
  templateUrl: './manage-exam.component.html',
  styleUrl: './manage-exam.component.scss'
})
export class ManageExamComponent {
  selectedSubject: any = null;

  onSubjectSelected(subject: any): void {
    this.selectedSubject = subject;
  }

  clearSelectedSubject(): void {
    this.selectedSubject = null;
  }
}
