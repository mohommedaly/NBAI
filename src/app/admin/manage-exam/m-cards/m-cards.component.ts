import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-m-cards',
  templateUrl: './m-cards.component.html',
  styleUrls: ['./m-cards.component.scss']
})
export class MCardsComponent implements OnInit {

  subjects: any[] = [];
  @Output() subjectSelected = new EventEmitter<any>();

  showDeleteIcons = false;
  showConfirmDialog = false;
  subjectToDelete: any = null;

  showForm = false;
  subjectForm: FormGroup;

  // Schedule modal state
  selectedSubject: any = null;
  showScheduleModal = false;
  examDate = '';
  examTime = '';
  examDuration = 60;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.subjectForm = this.fb.group({
      subjectName: ['', Validators.required],
      subjectCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchSubjects();
  }
 selectSubject(subject: any) {
    this.selectedSubject = subject;  // Assign the selected subject to the variable
  }
  fetchSubjects(): void {
    this.api.getSubjects().subscribe(
      data => this.subjects = data,
      error => console.error('Error fetching subjects:', error)
    );
  }

  onSubjectClick(subject: any): void {
    if (!this.showDeleteIcons) {
      this.subjectSelected.emit(subject);
    }
  }

  toggleDeleteIcons(): void {
    this.showDeleteIcons = !this.showDeleteIcons;
  }

  openConfirmDialog(subject: any): void {
    this.subjectToDelete = subject;
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.subjectToDelete = null;
    this.showConfirmDialog = false;
  }

  confirmDelete(): void {
    if (!this.subjectToDelete) return;

    this.api.deleteSubject(this.subjectToDelete.id).subscribe({
      next: () => {
        this.subjects = this.subjects.filter(s => s.id !== this.subjectToDelete.id);
        this.deleteQuestionsForSubject(this.subjectToDelete.id);
        this.cancelDelete();
      },
      error: err => {
        console.error('Failed to delete subject:', err);
        this.cancelDelete();
      }
    });
  }

  deleteQuestionsForSubject(subjectId: string): void {
    this.api.getQuestionsBySubject(subjectId).subscribe({
      next: questions => {
        questions.forEach((question: any) => {
          this.api.deleteQuestion(question.id).subscribe();
        });
      },
      error: err => console.error('Error fetching questions to delete:', err)
    });
  }

  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.subjectForm.reset();
  }

  submitForm(): void {
    if (this.subjectForm.valid) {
      const newSubject = this.subjectForm.value;

      this.api.addSubject(newSubject).subscribe({
        next: (response) => {
          this.subjects.push(response);
          this.closeForm();
        },
        error: err => console.error('Error adding subject:', err)
      });
    }
  }

  // 🟢 Schedule Modal Logic
  openScheduleModal(subject: any): void {
    this.selectedSubject = subject;
    this.examDate = subject.examDate || '';
    this.examTime = subject.examTime || '';
    this.examDuration = subject.duration || 60;
    this.showScheduleModal = true;
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
    this.selectedSubject = null;
    this.examDate = '';
    this.examTime = '';
    this.examDuration = 60;
  }

  saveSchedule(): void {
    if (!this.selectedSubject) return;

    const updatedSubject = {
      ...this.selectedSubject,
      examDate: this.examDate,
      examTime: this.examTime,
      duration: this.examDuration
    };

    this.api.updateSubject(updatedSubject.id, updatedSubject).subscribe({
      next: () => {
        this.subjects = this.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s);
        this.closeScheduleModal();
      },
      error: err => console.error('Failed to update subject schedule:', err)
    });
  }
}
