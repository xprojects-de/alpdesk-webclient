import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomContainerComponent } from './custom-container.component';

describe('CustomContainerComponent', () => {
  let component: CustomContainerComponent;
  let fixture: ComponentFixture<CustomContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
