import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
  results: any[] = [];

  constructor(private api:ApiService) {}

  ngOnInit() {
    this.api.getAllResults().subscribe(data => {
      this.results = data;
    });
  }
}
