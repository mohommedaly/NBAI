import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, Question } from '../api.service';
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
  noQuestions = false;

  countdown = 200;
  timer: any;

  subjectId = '';
  subName = '';

  // Fill-in-blank selections mapping
  fillSelections: { [qIndex: number]: string[] } = {};

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
    this.noQuestions = false;

    this.api.getQuestionsBySubject(this.subjectId).subscribe({
      next: (data: any[]) => {
        if (!data || data.length === 0) {
          this.noQuestions = true;
          this.loading = false;
          return;
        }

        // Normalize data
        this.questions = data.map((q: any) => {
          let opts = q.options;
          if (typeof opts === 'string') {
            try { opts = JSON.parse(opts); } catch { opts = []; }
          }
          if (!Array.isArray(opts)) opts = [];

          let blanks = q.blanks;
          if (typeof blanks === 'string') {
            try { blanks = JSON.parse(blanks); } catch { blanks = []; }
          }
          if (!Array.isArray(blanks)) blanks = [];

          return { ...q, options: opts, blanks, selectedAnswer: '' };
        });

        this.loading = false;
        this.startTimer();
      },
      error: (err) => {
        console.error('Error loading exam questions:', err);
        this.noQuestions = true;
        this.loading = false;
      }
    });
  }

  startTimer(): void {
    this.countdown = 60;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.handleTimeout();
      }
    }, 1000);
  }

  handleTimeout(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer();
    } else {
      this.submitExam();
    }
  }

  selectOption(option: string): void {
    this.questions[this.currentQuestionIndex].selectedAnswer = option;
  }

  updateFillAnswer(blankIndex: number, value: string): void {
    if (!this.fillSelections[this.currentQuestionIndex]) {
      this.fillSelections[this.currentQuestionIndex] = [];
    }
    this.fillSelections[this.currentQuestionIndex][blankIndex] = value;
  }

  isFillCorrect(qIndex: number): boolean {
    const q = this.questions[qIndex];
    if (!q.blanks || !Array.isArray(q.blanks)) return false;

    const selected = this.fillSelections[qIndex] || [];
    return q.blanks.every((ans: any, i: number) =>
      String(selected[i] ?? '').trim().toLowerCase() === String(ans ?? '').trim().toLowerCase()
    );
  }

  goToPreviousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.startTimer();
    }
  }

  goToNextQuestion(): void {
    const currentQ = this.questions[this.currentQuestionIndex];
    if (currentQ.type === 'Fill') {
      const selected = this.fillSelections[this.currentQuestionIndex] || [];
      currentQ.selectedAnswer = selected.join('|');
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer();
    } else {
      this.submitExam();
    }
  }

  submitExam(): void {
    clearInterval(this.timer);

    let calculatedScore = 0;
    this.questions.forEach((q, i) => {
      if (q.type === 'Fill') {
        if (this.isFillCorrect(i)) calculatedScore++;
      } else {
        const sel = String(q.selectedAnswer ?? '').trim().toLowerCase();
        const corr = String(q.correctAnswer ?? '').trim().toLowerCase();
        if (sel && corr && sel === corr) {
          calculatedScore++;
        }
      }
    });
    this.score = calculatedScore;

    const result = {
      studentName: this.studentName,
      subjectId: this.subjectId,
      subName: this.subName,
      score: this.score,
      total: this.questions.length,
      date: new Date().toISOString(),
      answers: this.questions.map((q, i) => ({
        question: q.questionText,
        selected: q.type === 'Fill'
          ? (this.fillSelections[i] || []).join('|')
          : q.selectedAnswer,
        correct: q.correctAnswer
      }))
    };

    this.api.submitResult(result).subscribe({
      next: () => {
        this.api.setResult(this.questions, this.score);
        this.submitted = true;
      },
      error: () => {
        this.submitted = true;
      }
    });
  }

  get answeredCount(): number {
    return this.questions.filter((q, i) => {
      if (q.type === 'Fill') {
        const sel = this.fillSelections[i] || [];
        return sel.some(s => s && String(s).trim());
      }
      return !!q.selectedAnswer;
    }).length;
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}