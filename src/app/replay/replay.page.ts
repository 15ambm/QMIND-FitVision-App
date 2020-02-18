import { Component, OnInit } from '@angular/core';
import { ReplayService } from '../services/replay/replay.service';

@Component({
  selector: 'app-replay',
  templateUrl: './replay.page.html',
  styleUrls: ['./replay.page.scss'],
})
export class ReplayPage implements OnInit {
  public image: string;
  constructor(private replayService: ReplayService) {}

  ngOnInit() {
    this.replayService.getReplay().subscribe(image => this.image = image);
  }
}
