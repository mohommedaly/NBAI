import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService, Question } from '../../../api.service';

@Component({
  selector: 'app-manage-que',
  templateUrl: './manage-que.component.html',
  styleUrls: ['./manage-que.component.scss']
})
export class ManageQueComponent implements OnChanges {
  @Input() subject: any;

  activeTab: 'manual' | 'bulk' | 'list' = 'manual';
  isLoading = false;
  isSaving = false;

  questionText = '';
  questionType = 'MCQ';
  difficulty = 'Medium';
  correctAnswer = '';
  codeText = '';
  options: string[] = ['', '', '', ''];
  currentQuestions: Question[] = [];
  showDeleteConfirm = false;
  questionToDelete!: Question;

  bulkText: string = '';
  bulkFileName: string = '';

  // Fill in blanks
  fillCode = '';
  fillAnswers: string[] = [''];

  notification: { message: string; type: 'success' | 'error' } | null = null;

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subject'] && this.subject) {
      this.resetForm();
      this.loadQuestionsForSubject();
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 4000);
  }

  loadQuestionsForSubject(): void {
    if (this.subject?.id) {
      this.isLoading = true;
      this.api.getQuestionsBySubject(this.subject.id).subscribe({
        next: (questions: Question[]) => {
          this.currentQuestions = (questions ?? []).map((q: any) => {
            if (q.blanks && typeof q.blanks === 'string') {
              try { q.blanks = JSON.parse(q.blanks); } catch { q.blanks = []; }
            }
            if (q.options && typeof q.options === 'string') {
              try { q.options = JSON.parse(q.options); } catch { q.options = []; }
            }
            return q;
          });
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching questions:', error);
          this.isLoading = false;
        }
      });
    }
  }

  addQuestion(): void {
    if (!this.subject?.id) return;
    this.isSaving = true;

    const question: Question = {
      questionText: this.questionText,
      options: this.questionType === 'MCQ' ? this.options : (this.questionType === 'True/False' ? ['True', 'False'] : []),
      correctAnswer: this.correctAnswer,
      type: this.questionType,
      difficulty: this.difficulty,
      subjectId: this.subject.id,
      text: this.codeText,
      answer: ''
    };

    this.api.addQuestion(question).subscribe({
      next: () => {
        this.loadQuestionsForSubject();
        this.resetForm();
        this.isSaving = false;
        this.showToast('Question added successfully!');
      },
      error: (error: any) => {
        console.error('Error adding question:', error);
        this.isSaving = false;
        this.showToast('Failed to add question', 'error');
      }
    });
  }

  getBlankCount(): number {
    if (!this.fillCode) return 0;
    const matches = this.fillCode.match(/___+/g);
    return matches ? matches.length : 0;
  }

  onFillCodeChange(): void {
    const count = this.getBlankCount();
    while (this.fillAnswers.length < count) this.fillAnswers.push('');
    this.fillAnswers = this.fillAnswers.slice(0, count);
  }

  addFillQuestion(): void {
    if (!this.subject?.id) return;

    if (!this.fillCode.trim()) {
      this.showToast('Please enter code snippet with ___ blanks', 'error');
      return;
    }

    const count = this.getBlankCount();
    if (count === 0) {
      this.showToast('Include at least one ___ blank in code', 'error');
      return;
    }

    if (this.fillAnswers.some(a => !a || !a.trim())) {
      this.showToast('Fill in all answers for blanks', 'error');
      return;
    }

    this.isSaving = true;
    const question: Question = {
      questionText: this.questionText || 'Fill in the blanks in code snippet',
      options: [],
      correctAnswer: this.fillAnswers.join('|'),
      type: 'Fill',
      difficulty: this.difficulty || 'Medium',
      subjectId: this.subject.id,
      text: this.fillCode,
      answer: '',
      blanks: [...this.fillAnswers]
    };

    this.api.addQuestion(question).subscribe({
      next: () => {
        this.loadQuestionsForSubject();
        this.resetForm();
        this.isSaving = false;
        this.showToast('Fill-in question added successfully!');
      },
      error: (error: any) => {
        console.error('Error adding fill question:', error);
        this.isSaving = false;
        this.showToast('Failed to add question', 'error');
      }
    });
  }

  resetForm(): void {
    this.questionText = '';
    this.questionType = 'MCQ';
    this.difficulty = 'Medium';
    this.correctAnswer = '';
    this.codeText = '';
    this.options = ['', '', '', ''];
    this.fillCode = '';
    this.fillAnswers = [''];
  }

  openDeleteConfirmDialog(question: Question): void {
    this.questionToDelete = question;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.questionToDelete = undefined!;
  }

  confirmDelete(): void {
    const questionId = this.questionToDelete?.id;
    if (!questionId) return;

    this.api.deleteQuestion(questionId).subscribe({
      next: () => {
        this.currentQuestions = this.currentQuestions.filter(q => q.id !== questionId);
        this.showDeleteConfirm = false;
        this.questionToDelete = undefined!;
        this.showToast('Question deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting question:', error);
        this.showDeleteConfirm = false;
        this.showToast('Failed to delete question', 'error');
      }
    });
  }

  onBulkFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.bulkFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.bulkText = e.target.result;
    };
    reader.readAsText(file);
  }

  parseBulkQuestions(): Question[] {
    const lines = this.bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const questions: Question[] = [];

    for (let i = 0; i < lines.length;) {
      const questionLine = lines[i];
      const options = lines.slice(i + 1, i + 5);
      const answerLine = lines[i + 5];

      if (options.length < 4 || !answerLine) break;

      questions.push({
        questionText: questionLine,
        options,
        correctAnswer: answerLine,
        type: 'MCQ',
        difficulty: 'Medium',
        subjectId: this.subject.id,
        text: '',
        answer: ''
      });

      i += 6;
    }
    return questions;
  }

  submitBulkQuestions(): void {
    if (!this.bulkText.trim()) {
      this.showToast('Please enter or upload bulk MCQ text', 'error');
      return;
    }

    const questions = this.parseBulkQuestions();
    if (questions.length === 0) {
      this.showToast('No valid MCQs parsed. Please verify the format.', 'error');
      return;
    }

    this.isSaving = true;
    this.api.addBulkQuestions(questions).subscribe({
      next: () => {
        this.bulkText = '';
        this.bulkFileName = '';
        this.loadQuestionsForSubject();
        this.isSaving = false;
        this.showToast(`${questions.length} questions imported successfully!`);
      },
      error: (err) => {
        console.error('Error adding bulk questions:', err);
        this.isSaving = false;
        this.showToast('Failed to import bulk questions', 'error');
      }
    });
  }
}