import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JiraComponent } from './jira.component';

describe('JiraComponent', () => {
  let component: JiraComponent;
  let fixture: ComponentFixture<JiraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JiraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
