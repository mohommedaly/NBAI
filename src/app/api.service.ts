import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id?: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  type: string;              // 'MCQ' | 'True/False' | 'Short' | 'Long' | 'Fill'
  difficulty: string;
  subjectId: string;
  text: string;
  answer: string;
  blanks?: string[];         // 👈 NEW — Fill type ke liye
}

export interface Subject {
  id?: string;
  subjectName: string;
  subjectCode: string;
}

export interface Result {
  id?: string;
  studentName: string;
  subjectId: string;
  score: number;
  total: number;
  date?: string;
  subName?: string;
  answers?: any[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = 'https://script.google.com/macros/s/AKfycbycYiuTM9slfUlnT5Qrkf9JKqaEoK6VQJvCIBqeMo-IUo8f3m4xrEUQAlAlU0QIoFLq/exec';

  private studentName: string = '';
  private questions: any[] = [];
  private score: number = 0;
  private selectedSubject: any;

  constructor(private http: HttpClient) {}

  // ---------- INTERNAL ----------
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private call(action: string, sheet: string, params: any = {}, body?: any): Observable<any> {
    let httpParams = new HttpParams()
      .set('action', action)
      .set('sheet', sheet);

    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null) {
        httpParams = httpParams.set(k, String(params[k]));
      }
    });

    const url = `${this.baseUrl}?${httpParams.toString()}`;

    if (body) {
      return this.http.post(url, JSON.stringify(body), {
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
    }
    return this.http.get(url);
  }

  // ---------- SETUP ----------
  setupAllSheets(): Observable<any> {
    return this.call('setupAll', '');
  }

  // ---------- SUBJECTS ----------
  addSubject(subject: Subject): Observable<any> {
    if (!subject.id) subject.id = this.generateId();
    return this.call('add', 'subjects', {}, subject);
  }

  updateSubject(id: string, subject: Subject): Observable<any> {
    return this.call('update', 'subjects', { id }, subject);
  }

  deleteSubject(id: string | number): Observable<any> {
    return this.call('delete', 'subjects', { id: String(id) });
  }

  getSubjects(): Observable<Subject[]> {
    return this.call('getAll', 'subjects');
  }

  setSelectedSubject(subject: any): void { this.selectedSubject = subject; }
  getSelectedSubject(): any { return this.selectedSubject; }

  // ---------- STUDENT ----------
  setStudentName(name: string): void { this.studentName = name; }
  getStudentName(): string { return this.studentName; }

  // ---------- QUESTIONS ----------
  loadQuestions(): Observable<Question[]> {
    return this.call('getAll', 'questions');
  }

  getQuestionsBySubject(subjectId: string): Observable<Question[]> {
    return this.call('getByField', 'questions', {
      field: 'subjectId',
      value: subjectId
    });
  }

  addQuestion(question: Question): Observable<any> {
    if (!question.id) question.id = this.generateId();
    return this.call('add', 'questions', {}, question);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.call('delete', 'questions', { id });
  }

  addBulkQuestions(questions: Question[]): Observable<any> {
    const rows = questions.map(q => {
      if (!q.id) q.id = this.generateId();
      return q;
    });
    return this.call('addBulk', 'questions', {}, { rows });
  }

  // ---------- RESULTS ----------
  submitResult(result: Result): Observable<any> {
    if (!result.id) result.id = this.generateId();
    if (!result.date) result.date = new Date().toISOString();
    return this.call('add', 'results', {}, result);
  }

  deleteResult(id: string): Observable<any> {
    return this.call('delete', 'results', { id });
  }

  getAllResults(): Observable<Result[]> {
    return this.call('getAll', 'results');
  }

  // ---------- IN-MEMORY RESULT ----------
  setResult(questions: any[], score: number): void {
    this.questions = questions;
    this.score = score;
  }

  getResult() {
    return {
      questions: this.questions,
      score: this.score,
      studentName: this.studentName
    };
  }
}