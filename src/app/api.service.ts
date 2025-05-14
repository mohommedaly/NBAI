import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'https://json-server-db-exam.onrender.com';

  private studentName: string = '';
  private questions: any[] = [];
  private score: number = 0;

  constructor(private http: HttpClient) {}

  // 🔹 Store student name after login
  setStudentName(name: string) {
    this.studentName = name;
  }

  getStudentName(): string {
    return this.studentName;
  }

  // 🔹 Load questions
  loadQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/questions`);
  }

  // 🔹 Submit result
  submitResult(result: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/results`, result);
  }

  // 🔹 Save result locally to use in ResultComponent
  setResult(questions: any[], score: number) {
    this.questions = questions;
    this.score = score;
  }

  // 🔹 Get result for ResultComponent
  getResult() {
    return {
      questions: this.questions,
      score: this.score,
      studentName: this.studentName
    };
  }

  // 🔹 For admin: Get all submitted results
  getAllResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/results`);
  }
}
