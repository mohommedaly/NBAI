import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-m-cards',
  templateUrl: './m-cards.component.html',
  styleUrls: ['./m-cards.component.scss']
})
export class MCardsComponent implements OnInit {

  subjects: any[] = [];

  // 👇 Emit event to parent
  @Output() subjectSelected = new EventEmitter<any>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getSubjects().subscribe(
      data => {
        this.subjects = data;
        console.log('Fetched Subjects:', this.subjects);
      },
      error => {
        console.error('Error fetching subjects:', error);
      }
    );
  }

  // ✅ Called when a card is clicked
  onSubjectClick(subject: any): void {
    console.log('Subject clicked:', subject);
    this.subjectSelected.emit(subject);  // Emit to parent
  }
}
