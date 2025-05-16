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
  private selectedSubject: any;
  constructor(private http: HttpClient) {}



setSelectedSubject(subject: any) {
  this.selectedSubject = subject;
}

getSelectedSubject(): any {
  return this.selectedSubject;
}

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

  // 🔹 For admin:
  getAllResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/results`);
    
  }


  addSubject(subject: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/subjects`, subject);  // Correct URL here
  }

  getSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/subjects`);  // Corrected the URL
  }
  // 🔹 Add Question
  addQuestion(question: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/questions`, question);  // URL for questions
  }
  getQuestionsBySubject(subjectId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/questions?subjectId=${subjectId}`);
}


}
