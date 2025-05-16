import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MCardsComponent } from './m-cards.component';

describe('MCardsComponent', () => {
  let component: MCardsComponent;
  let fixture: ComponentFixture<MCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
