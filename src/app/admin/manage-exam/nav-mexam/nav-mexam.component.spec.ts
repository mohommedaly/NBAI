import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMexamComponent } from './nav-mexam.component';

describe('NavMexamComponent', () => {
  let component: NavMexamComponent;
  let fixture: ComponentFixture<NavMexamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavMexamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavMexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
