import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  type: string;
  difficulty: string;
  subjectId: string;
  text: string;
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://json-server-db-exam.onrender.com';

  private studentName: string = '';
  private questions: any[] = [];
  private score: number = 0;
  private selectedSubject: any;

  constructor(private http: HttpClient) {}

  // 🔹 Utility method to generate a unique id
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // 🔹 Subject Management
  addSubject(subject: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subjects`, subject);
  }

  updateSubject(id: string, subject: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/subjects/${id}`, subject);
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/subjects/${id}`);
  }

  getSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/subjects`);
  }

  setSelectedSubject(subject: any): void {
    this.selectedSubject = subject; // ✅ Store full subject object
  }

  getSelectedSubject(): any {
    return this.selectedSubject;
  }

  // 🔹 Student Management
  setStudentName(name: string): void {
    this.studentName = name;
  }

  getStudentName(): string {
    return this.studentName;
  }

  // 🔹 Question Management
  loadQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/questions`);
  }

  getQuestionsBySubject(subjectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/questions?subjectId=${subjectId}`);
  }

  addQuestion(question: any): Observable<any> {
    // Ensure the question has a unique id before posting
    if (!question.id) {
      question.id = this.generateId();
    }
    return this.http.post<any>(`${this.baseUrl}/questions`, question);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/questions/${id}`);
  }

  addBulkQuestions(questions: any[]): Observable<any[]> {
    // For each question, assign an id if missing
    const questionsWithId = questions.map(q => {
      if (!q.id) {
        q.id = this.generateId();
      }
      return q;
    });
    return forkJoin(
      questionsWithId.map(q => this.http.post(`${this.baseUrl}/questions`, q))
    );
  }

  // 🔹 Result Management
  submitResult(result: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/results`, result);
  }

  deleteResult(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/results/${id}`);
  }

  getAllResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/results`);
  }

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
