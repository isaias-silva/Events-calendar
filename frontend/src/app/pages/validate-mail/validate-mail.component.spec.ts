import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateMailComponent } from './validate-mail.component';

describe('ValidateMailComponent', () => {
  let component: ValidateMailComponent;
  let fixture: ComponentFixture<ValidateMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateMailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidateMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
