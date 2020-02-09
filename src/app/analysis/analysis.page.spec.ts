import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnalysisPage } from './analysis.page';

describe('AnalysisPage', () => {
  let component: AnalysisPage;
  let fixture: ComponentFixture<AnalysisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
