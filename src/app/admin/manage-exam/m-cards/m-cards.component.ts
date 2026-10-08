import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService, Subject } from '../../../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-m-cards',
  templateUrl: './m-cards.component.html',
  styleUrls: ['./m-cards.component.scss']
})
export class MCardsComponent implements OnInit {
  subjects: any[] = [];
  @Output() subjectSelected = new EventEmitter<any>();

  showConfirmDialog = false;
  subjectToDelete: any = null;

  showForm = false;
  subjectForm: FormGroup;

  // Schedule modal state
  selectedSubjectForSchedule: any = null;
  showScheduleModal = false;
  examDate = '';
  examTime = '';
  examDuration = 60;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.subjectForm = this.fb.group({
      subjectName: ['', [Validators.required, Validators.minLength(2)]],
      subjectCode: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.api.getSubjects().subscribe({
      next: data => this.subjects = data || [],
      error: error => console.error('Error fetching subjects:', error)
    });
  }

  onManageQuestions(subject: any): void {
    this.subjectSelected.emit(subject);
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
    if (!this.subjectToDelete?.id) return;

    const subjectId = this.subjectToDelete.id;
    this.isSubmitting = true;

    this.api.getQuestionsBySubject(subjectId).subscribe({
      next: (questions: any[]) => {
        const validQuestions = (questions || []).filter((q: any) => q.id);
        const deleteRequests = validQuestions.map((q: any) => this.api.deleteQuestion(q.id));

        if (deleteRequests.length > 0) {
          forkJoin(deleteRequests).subscribe({
            next: () => this.executeDeleteSubject(subjectId),
            error: () => this.executeDeleteSubject(subjectId)
          });
        } else {
          this.executeDeleteSubject(subjectId);
        }
      },
      error: () => {
        this.executeDeleteSubject(subjectId);
      }
    });
  }

  private executeDeleteSubject(subjectId: string): void {
    this.api.deleteSubject(subjectId).subscribe({
      next: () => {
        this.subjects = this.subjects.filter(s => s.id !== subjectId);
        this.isSubmitting = false;
        this.cancelDelete();
      },
      error: err => {
        console.error('Failed to delete subject:', err);
        this.isSubmitting = false;
        this.cancelDelete();
      }
    });
  }

  openForm(): void {
    this.subjectForm.reset();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.subjectForm.reset();
  }

  submitForm(): void {
    if (this.subjectForm.valid) {
      this.isSubmitting = true;
      const newSubject = this.subjectForm.value;

      this.api.addSubject(newSubject).subscribe({
        next: (response) => {
          this.subjects.push(response || newSubject);
          this.isSubmitting = false;
          this.closeForm();
          this.fetchSubjects();
        },
        error: err => {
          console.error('Error adding subject:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  openScheduleModal(subject: any): void {
    this.selectedSubjectForSchedule = subject;
    this.examDate = subject.examDate || '';
    this.examTime = subject.examTime || '';
    this.examDuration = subject.duration || 60;
    this.showScheduleModal = true;
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
    this.selectedSubjectForSchedule = null;
    this.examDate = '';
    this.examTime = '';
    this.examDuration = 60;
  }

  saveSchedule(): void {
    if (!this.selectedSubjectForSchedule) return;

    this.isSubmitting = true;
    const updatedSubject = {
      ...this.selectedSubjectForSchedule,
      examDate: this.examDate,
      examTime: this.examTime,
      duration: this.examDuration
    };

    this.api.updateSubject(updatedSubject.id, updatedSubject).subscribe({
      next: () => {
        this.subjects = this.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s);
        this.isSubmitting = false;
        this.closeScheduleModal();
      },
      error: err => {
        console.error('Failed to update subject schedule:', err);
        this.isSubmitting = false;
      }
    });
  }
}
