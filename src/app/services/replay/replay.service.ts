import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  private replay: string;
  constructor() {
    this.replay = null;
   }

  getReplay(): Observable<string> {
    return of(this.replay);
  }

  setReplay(replay: string) {
    this.replay = replay;
  }
}
