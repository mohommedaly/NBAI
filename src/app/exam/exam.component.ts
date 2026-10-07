import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestionIndex = 0;
  score = 0;
  studentName = '';
  submitted = false;
  loading = true;

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

      this.loadQuestions();
    });
  }

  loadQuestions(): void {
    this.loading = true;

    this.api.getQuestionsBySubject(this.subjectId).subscribe({
      next: (data: any[]) => {
        console.log('📥 API Response:', data);
        console.log('📊 Total:', data?.length);
        console.log('🎯 subjectId:', this.subjectId, typeof this.subjectId);

        if (!data || data.length === 0) {
          alert('⚠️ No questions found for this subject!');
          this.loading = false;
          return;
        }

        // Normalize options (string → array)
        this.questions = data.map((q: any) => {
          let opts = q.options;
          if (typeof opts === 'string') {
            try { opts = JSON.parse(opts); } catch (e) { opts = []; }
          }
          if (!Array.isArray(opts)) opts = [];

          return { ...q, options: opts, selectedAnswer: '' };
        });

        console.log('✅ Loaded questions:', this.questions.length);
        this.loading = false;
        this.startTimer();
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.loading = false;
        alert('Failed to load questions');
      }
    });
  }

  startTimer(): void {
    this.countdown = 60;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) this.nextQuestion();
    }, 1000);
  }

  selectAnswer(option: string): void {
    this.questions[this.currentQuestionIndex].selectedAnswer = option;
    setTimeout(() => this.nextQuestion(), 300);
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
    this.score = this.questions.filter(
      q => q.selectedAnswer === q.correctAnswer
    ).length;

    const result = {
      studentName: this.studentName,
      subjectId: this.subjectId,
      subName: this.subName,
      score: this.score,
      total: this.questions.length,
      date: new Date().toISOString(),
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

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}