import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../api.service';  // Import the ApiService

interface Question {
  id: string;  // No more optional id, we assume it's always available
  questionText: string;
  options: string[];  // Array to store multiple options
  correctAnswer: string;  // Correct answer selected by the user
  type: string;
  difficulty: string;
  subjectId: string;  // To associate the question with a subject
  text: any;
  answer: any;
}

@Component({
  selector: 'app-manage-que',
  templateUrl: './manage-que.component.html',
  styleUrls: ['./manage-que.component.scss']
})
export class ManageQueComponent implements OnChanges {

  @Input() subject: any;

  questionText = '';
  questionType = '';
  difficulty = '';
  correctAnswer = '';
  options: string[] = ['', '', '', ''];  // Array to store 4 options
  currentQuestions: Question[] = [];
  showDeleteConfirm = false;
  questionToDelete!: Question;  // Question is always defined now

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['subject'] && this.subject) {
      this.resetForm();
      this.loadQuestionsForSubject();
    }
  }

  loadQuestionsForSubject() {
    if (this.subject?.id) {
      this.api.getQuestionsBySubject(this.subject.id).subscribe(
        (questions: Question[]) => {
          this.currentQuestions = questions ?? [];  // Fallback to empty array if null
          console.log('Fetched questions for subject:', this.currentQuestions);
        },
        (error: any) => {
          console.error('Error fetching questions:', error);
        }
      );
    }
  }

  // Add question with options
  addQuestion() {
    if (!this.subject?.id) return;

    const question: Question = {
      questionText: this.questionText,
      options: this.options, // Array of options
      correctAnswer: this.correctAnswer,
      type: this.questionType,
      difficulty: this.difficulty,
      subjectId: this.subject.id,
      text: '',
      answer: '',
      id: ''
    };

    this.api.addQuestion(question).subscribe(
      (response: any) => {
        console.log('Question added successfully:', response);
        this.loadQuestionsForSubject();
        this.resetForm();
      },
      (error: any) => {
        console.error('Error adding question:', error);
      }
    );
  }

  resetForm() {
    this.questionText = '';
    this.questionType = '';
    this.difficulty = '';
    this.correctAnswer = '';
    this.options = ['', '', '', ''];  // Reset options
  }

  // Open delete confirmation dialog
  openDeleteConfirmDialog(question: Question) {
    this.questionToDelete = question;
    this.showDeleteConfirm = true;
  }

  // Cancel delete
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.questionToDelete ;
  }

  // Confirm delete
  confirmDelete() {
    if (this.questionToDelete) {  // No null check anymore, questionToDelete is always defined
      this.api.deleteQuestion(this.questionToDelete.id).subscribe(
        () => {
          // Remove the question from the list after successful deletion
          this.currentQuestions = this.currentQuestions.filter(q => q.id !== this.questionToDelete.id);
          this.showDeleteConfirm = false;
          this.questionToDelete ;  // After deletion, set to null
        },
        (error) => {
          console.error('Error deleting question:', error);
          this.showDeleteConfirm = false;
        }
      );
    }
  }
}
