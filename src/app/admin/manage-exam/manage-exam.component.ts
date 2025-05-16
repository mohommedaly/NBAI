import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-exam',
  templateUrl: './manage-exam.component.html',
  styleUrl: './manage-exam.component.scss'
})
export class ManageExamComponent {
  selectedSubject: any;

  // This method is triggered when a subject is selected in MCardsComponent
  onSubjectSelected(subject: any): void {
    console.log('Selected Subject:', subject);
    this.selectedSubject = subject;  // Store the selected subject
  }

}
