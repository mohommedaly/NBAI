import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  results: any[] = [];
  subjects: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSubjects().subscribe({
      next: (subjects) => this.subjects = subjects,
      error: (err) => console.error('Failed to fetch subjects', err)
    });

    this.api.getAllResults().subscribe({
      next: (results) => {
        console.log('Results:', results); // Log the results to inspect the subjectId
        this.results = results;
      },
      error: (err) => console.error('Failed to fetch results', err)
    });
  }

  getSubjectName(subjectId: string): string {
    if (!subjectId) {
      console.warn('Subject ID is missing or undefined');
      return 'Unknown Subject';  // Return a fallback name
    }

    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.subjectName : 'Unknown Subject';
  }
deleteResult(id: string): void {
  if (confirm('Are you sure you want to delete this result?')) {
    this.api.deleteResult(id).subscribe({
      next: () => {
        // Remove the deleted result from the local array
        this.results = this.results.filter(r => r.id !== id);
        console.log('Result deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete result', err);
      }
    });
  }
}


}
