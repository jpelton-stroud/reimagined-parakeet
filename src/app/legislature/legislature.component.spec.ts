import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislatureComponent } from './legislature.component';

describe('LegislatureComponent', () => {
  let component: LegislatureComponent;
  let fixture: ComponentFixture<LegislatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegislatureComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegislatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
