import { Component, OnInit } from '@angular/core';
import { ApiService, Subject, Result } from '../../../api.service';

@Component({
  selector: 'app-cards-dashboard',
  templateUrl: './cards-dashboard.component.html',
  styleUrls: ['./cards-dashboard.component.scss']
})
export class CardsDashboardComponent implements OnInit {
  subjects: any[] = [];
  results: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.api.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data || [];
        this.loadResults();
      },
      error: (err) => {
        console.error('Error fetching subjects:', err);
        this.loadResults();
      }
    });
  }

  loadResults(): void {
    this.api.getAllResults().subscribe({
      next: (data) => {
        this.results = (data || []).sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch results:', err);
        this.loading = false;
      }
    });
  }

  get scheduledExamsCount(): number {
    return this.subjects.filter(s => s.examDate).length;
  }

  get topResults(): any[] {
    return this.results.slice(0, 6);
  }

  get averageScore(): number {
    if (!this.results.length) return 0;
    const totalPercentage = this.results.reduce((acc, r) => {
      const total = r.total || 10;
      return acc + ((r.score || 0) / total) * 100;
    }, 0);
    return Math.round(totalPercentage / this.results.length);
  }

  getSubjectName(subjectId: string): string {
    if (!subjectId) return 'General';
    const sub = this.subjects.find(s => s.id === subjectId);
    return sub ? sub.subjectName : 'General';
  }
}
