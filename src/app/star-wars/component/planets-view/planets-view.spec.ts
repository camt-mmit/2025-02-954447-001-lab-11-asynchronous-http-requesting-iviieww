import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsView } from './planets-view';

describe('PlanetsView', () => {
  let component: PlanetsView;
  let fixture: ComponentFixture<PlanetsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
