import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../api.service';  // Import the ApiService

interface Question {
  id?: string;
  questionText: string;
  options: string[];  // Array to store multiple options
  correctAnswer: string;  // Correct answer selected by the user
  type: string;
  difficulty: string;
  subjectId: string;  // To associate the question with a subject
  text:any;
  answer:any;
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

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['subject'] && this.subject) {
      this.resetForm();
      this.loadQuestionsForSubject();
    }
  }

  // Load questions for the selected subject
  loadQuestionsForSubject() {
    if (this.subject?.id) {
      this.api.getQuestionsBySubject(this.subject.id).subscribe(
        (questions: Question[]) => {
          this.currentQuestions = questions;
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
      answer: ''
    };

    // Call the service to post the question
    this.api.addQuestion(question).subscribe(
      (response: any) => {
        console.log('Question added successfully:', response);
        // Reload questions to show the newly added question
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
}


