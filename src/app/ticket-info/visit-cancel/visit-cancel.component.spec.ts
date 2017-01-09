/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { VisitCancelComponent } from './visit-cancel.component';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";

describe('VisitCancelComponent', () => {
  let component: VisitCancelComponent;
  let fixture: ComponentFixture<VisitCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitCancelComponent ],
      providers: [ {provide: Router, useClass: QmRouterModule}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create VisitCancelComponent', () => {
    expect(component).toBeTruthy();
  });
});