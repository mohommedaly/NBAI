import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  countdown = 60;
  timer: any;

  subjectId = '';
  subName = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.studentName = this.api.getStudentName();
    if (!this.studentName) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.queryParams.subscribe(params => {
      this.subjectId = params['subjectId'];
      this.subName = params['subName'] || '';

      if (!this.subjectId) {
        this.router.navigate(['/login']);
        return;
      }

      this.api.getQuestionsBySubject(this.subjectId).subscribe(data => {
        this.questions = data.map((q: any) => ({ ...q, selectedAnswer: '' }));
        this.startTimer();
      });
    });
  }

  startTimer(): void {
    this.countdown = 60;
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  selectAnswer(option: string): void {
    this.questions[this.currentQuestionIndex].selectedAnswer = option;
    this.nextQuestion();
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
      subjectId: this.subjectId,
      subName: this.subName,
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
