import { Component, OnInit } from '@angular/core';
import { ApiService, Subject, Result } from '../../api.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  results: any[] = [];
  subjects: any[] = [];
  searchTerm = '';
  filterStatus = 'all'; // 'all' | 'pass' | 'fail'
  isLoading = true;

  resultToDelete: any = null;
  showDeleteModal = false;
  isDeleting = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.api.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects || [];
        this.loadResults();
      },
      error: (err) => {
        console.error('Failed to fetch subjects', err);
        this.loadResults();
      }
    });
  }

  loadResults(): void {
    this.api.getAllResults().subscribe({
      next: (results) => {
        this.results = (results || []).sort((a: any, b: any) => {
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch results', err);
        this.isLoading = false;
      }
    });
  }

  get filteredResults(): any[] {
    return this.results.filter(r => {
      const studentMatch = (r.studentName || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      const subName = this.getSubjectName(r.subjectId).toLowerCase();
      const subjectMatch = subName.includes(this.searchTerm.toLowerCase());
      
      const total = r.total || 10;
      const isPassed = ((r.score || 0) / total) >= 0.5;

      let statusMatch = true;
      if (this.filterStatus === 'pass') statusMatch = isPassed;
      if (this.filterStatus === 'fail') statusMatch = !isPassed;

      return (studentMatch || subjectMatch) && statusMatch;
    });
  }

  get totalSubmissions(): number {
    return this.results.length;
  }

  get passRate(): number {
    if (!this.results.length) return 0;
    const passed = this.results.filter(r => ((r.score || 0) / (r.total || 10)) >= 0.5).length;
    return Math.round((passed / this.results.length) * 100);
  }

  get highestScore(): number {
    if (!this.results.length) return 0;
    return Math.max(...this.results.map(r => r.score || 0));
  }

  getSubjectName(subjectId: string): string {
    if (!subjectId) return 'General Subject';
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.subjectName : 'General Subject';
  }

  openDeleteModal(result: any): void {
    this.resultToDelete = result;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.resultToDelete = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.resultToDelete?.id) return;
    this.isDeleting = true;

    this.api.deleteResult(this.resultToDelete.id).subscribe({
      next: () => {
        this.results = this.results.filter(r => r.id !== this.resultToDelete.id);
        this.isDeleting = false;
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Failed to delete result', err);
        this.isDeleting = false;
        this.cancelDelete();
      }
    });
  }
}
