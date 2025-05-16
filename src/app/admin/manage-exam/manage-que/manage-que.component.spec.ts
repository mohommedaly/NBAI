import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQueComponent } from './manage-que.component';

describe('ManageQueComponent', () => {
  let component: ManageQueComponent;
  let fixture: ComponentFixture<ManageQueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageQueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageQueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
