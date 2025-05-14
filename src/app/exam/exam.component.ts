import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  questions: any[] = [];
  currentQuestionIndex = 0;
  score = 0;
  studentName = '';
  submitted = false;

  countdown = 20;
  timer: any;

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.studentName = this.api.getStudentName();
    if (!this.studentName) {
      this.router.navigate(['/login']);
      return;
    }

    this.api.loadQuestions().subscribe(data => {
      this.questions = data.map((q: any) => ({ ...q, selectedAnswer: '' }));
      this.startTimer(); // Start first question's timer
    });
  }

  startTimer(): void {
    this.countdown = 20;

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  selectAnswer(option: string): void {
    this.questions[this.currentQuestionIndex].selectedAnswer = option;
    this.nextQuestion(); // Auto-next on selection
  }

  nextQuestion(): void {
    clearInterval(this.timer);

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer();
    } else {
      this.submitExam();
    }
  }

  submitExam(): void {
    clearInterval(this.timer);

    this.score = this.questions.filter(q => q.selectedAnswer === q.correctAnswer).length;

    const result = {
      studentName: this.studentName,
      score: this.score,
      total: this.questions.length,
      answers: this.questions.map(q => ({
        question: q.questionText,
        selected: q.selectedAnswer,
        correct: q.correctAnswer
      }))
    };

    this.api.submitResult(result).subscribe(() => {
      this.api.setResult(this.questions, this.score);
      this.submitted = true;
    });
  }
}
