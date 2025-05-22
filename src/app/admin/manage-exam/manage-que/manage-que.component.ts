import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../api.service';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  type: string;
  difficulty: string;
  subjectId: string;
  text: any; // for code snippet
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
  codeText = '';
  options: string[] = ['', '', '', ''];
  currentQuestions: Question[] = [];
  showDeleteConfirm = false;
  questionToDelete!: Question;

  // 👇 Bulk upload support
  bulkText: string = '';
  bulkFileError: string = '';
  bulkFileName: string = '';

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
          this.currentQuestions = questions ?? [];
          console.log('Fetched questions for subject:', this.currentQuestions);
        },
        (error: any) => {
          console.error('Error fetching questions:', error);
        }
      );
    }
  }

  addQuestion() {
    if (!this.subject?.id) return;

    const question: Question = {
      questionText: this.questionText,
      options: this.options,
      correctAnswer: this.correctAnswer,
      type: this.questionType,
      difficulty: this.difficulty,
      subjectId: this.subject.id,
      text: this.codeText,
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
    this.codeText = '';
    this.options = ['', '', '', ''];
  }

  openDeleteConfirmDialog(question: Question) {
    this.questionToDelete = question;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.questionToDelete = undefined!;
  }

  confirmDelete() {
    if (this.questionToDelete) {
      this.api.deleteQuestion(this.questionToDelete.id).subscribe(
        () => {
          this.currentQuestions = this.currentQuestions.filter(q => q.id !== this.questionToDelete.id);
          this.showDeleteConfirm = false;
          this.questionToDelete = undefined!;
        },
        (error) => {
          console.error('Error deleting question:', error);
          this.showDeleteConfirm = false;
        }
      );
    }
  }

  handleBulkTextChange(event: any) {
    this.bulkText = event.target.value;
  }

  onBulkFileChange(event: any) {
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
        id: '',
        questionText: questionLine,
        options,
        correctAnswer: answerLine,
        type: 'MCQ',
        difficulty: 'Medium',
        subjectId: this.subject.id,
        text: '',
        answer: ''
      });

      i += 6; // Next question block
    }

    return questions;
  }

  submitBulkQuestions() {
    if (!this.bulkText.trim()) {
      alert('Please paste or upload MCQ data.');
      return;
    }

    const questions = this.parseBulkQuestions();
    if (questions.length === 0) {
      alert('No valid questions found. Please check your input format.');
      return;
    }

    this.api.addBulkQuestions(questions).subscribe(
      res => {
        console.log('Bulk questions added successfully:', res);
        this.bulkText = '';
        this.bulkFileName = '';
        this.loadQuestionsForSubject();
        alert(`${questions.length} questions added successfully.`);
      },
      err => {
        console.error('Error adding bulk questions:', err);
        alert('Failed to upload bulk questions.');
      }
    );
  }
}
