import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmsView } from './films-view';

describe('FilmsView', () => {
  let component: FilmsView;
  let fixture: ComponentFixture<FilmsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
