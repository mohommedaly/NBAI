import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';  // Update path as necessary

@Component({
  selector: 'app-cards-dashboard',
  templateUrl: './cards-dashboard.component.html',
  styleUrls: ['./cards-dashboard.component.scss']
})
export class CardsDashboardComponent implements OnInit {

  subjects: any[] = [];
  results: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // Fetch subjects on component init
    this.fetchSubjects();

    // Fetch results (example, can be removed or adjusted as needed)
    this.api.getAllResults().subscribe({
      next: data => {
        this.results = data.sort((a, b) => b.score - a.score); // highest first
      },
      error: err => console.error('Failed to fetch results:', err)
    });
  }

  fetchSubjects(): void {
    this.api.getSubjects().subscribe({
      next: data => {
        this.subjects = data;
        console.log('Fetched subjects:', this.subjects);  // Debugging line to check the subjects
      },
      error: err => {
        console.error('Error fetching subjects:', err);
      }
    });
  }

  get allSubjects(): any[] {
    return this.subjects;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  get topResults() {
    return this.results.slice(0, 5); // Show top 5 results
  }
}
