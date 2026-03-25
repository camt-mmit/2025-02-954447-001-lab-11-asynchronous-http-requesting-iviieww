import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsInsertPage } from './events-insert-page';

describe('EventsInsertPage', () => {
  let component: EventsInsertPage;
  let fixture: ComponentFixture<EventsInsertPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsInsertPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsInsertPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
