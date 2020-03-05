import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { fromImageArray } from './whammy';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  private replay: string[];
  private video: string;
  private FPS: number;

  constructor() {
    this.replay = [];
    this.video = '';
    this.FPS = 60;
   }

  calculateFPS(duration: number) {
    this.FPS = this.replay.length / duration * 1000;
    console.log(this.FPS);
  }

  getReplay(): string {
    return this.video;
  }

  setReplay(replay: string[]) {
    this.replay = replay;
  }

  clearFrames() {
    this.replay = [];
  }

  recordFrame(frame: string) {
    this.replay.push(frame);
  }

  compile() {
    const blob = fromImageArray(this.replay, this.FPS);
    this.video = URL.createObjectURL(blob);
  }
}
