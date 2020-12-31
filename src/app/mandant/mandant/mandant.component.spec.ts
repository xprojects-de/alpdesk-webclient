import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MandantComponent } from './mandant.component';

describe('MandantComponent', () => {
  let component: MandantComponent;
  let fixture: ComponentFixture<MandantComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MandantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
