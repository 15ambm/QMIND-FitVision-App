import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReplayPage } from './replay.page';

describe('ReplayPage', () => {
  let component: ReplayPage;
  let fixture: ComponentFixture<ReplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
