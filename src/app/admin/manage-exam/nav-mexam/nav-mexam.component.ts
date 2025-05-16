import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-nav-mexam',
  templateUrl: './nav-mexam.component.html',
  styleUrls: ['./nav-mexam.component.scss']
})
export class NavMexamComponent {
  showForm = false;
  subjectForm: FormGroup;

  subjects: any[] = []; // to show created cards

  constructor(
    private fb: FormBuilder,
    private api: ApiService  // Inject the SubjectService
  ) {
    this.subjectForm = this.fb.group({
      subjectName: ['', Validators.required],
      subjectCode: ['', Validators.required],
    
    });
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.subjectForm.reset();
  }

  submitForm() {
    if (this.subjectForm.valid) {
      const formData = this.subjectForm.value;

      // Format date to readable string
      const date = new Date(formData.createdDate);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      });

      const newSubject = {
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
      
      };

      // Post data to JSON server using the service
      this.api.addSubject(newSubject).subscribe((response: any) => {
        console.log('Subject added:', response);

        // After posting, you may want to update the local list or handle UI updates
        this.subjects.push(response);  // Assuming the server returns the created object
      }, (error: any) => {
        console.error('Error adding subject:', error);
      });

      this.closeForm();
    }
  }
}
