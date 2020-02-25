import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReplayService } from '../services/replay/replay.service';

@Component({
  selector: 'app-replay',
  templateUrl: './replay.page.html',
  styleUrls: ['./replay.page.scss'],
})
export class ReplayPage implements OnInit {
  @ViewChild('replay', null) replay: ElementRef<HTMLVideoElement>;
  constructor(private replayService: ReplayService) {}

  ngOnInit() {
    this.replay.nativeElement.src = this.replayService.getReplay();
    this.replay.nativeElement.load();
    this.replay.nativeElement.play();
  }
}
