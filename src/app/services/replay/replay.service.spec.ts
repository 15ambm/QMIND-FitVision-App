import { TestBed } from '@angular/core/testing';

import { ReplayService } from './replay.service';

describe('ReplayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplayService = TestBed.get(ReplayService);
    expect(service).toBeTruthy();
  });
});
