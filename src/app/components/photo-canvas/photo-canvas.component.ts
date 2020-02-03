import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import * as posenet from '@tensorflow-models/posenet';

@Component({
  selector: 'app-photo-canvas',
  templateUrl: './photo-canvas.component.html',
  styleUrls: ['./photo-canvas.component.scss'],
})
export class PhotoCanvasComponent implements OnInit {
  @ViewChild('photoCanvas', null) photoCanvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private net: posenet.PoseNet;
  pose: posenet.Pose;
  poseStr: string;

  constructor(private cameraPreview: CameraPreview) {
    this.loadPoseNet();
  }

  async loadPoseNet() {
    this.net = await posenet.load();
  }

  async ngOnInit() {
    await this.cameraPreview.startCamera({
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'front',
      toBack: true,
      alpha: 1
    });

    this.photoCanvas.nativeElement.width = window.screen.width;
    this.photoCanvas.nativeElement.height = window.screen.height;
    this.ctx = this.photoCanvas.nativeElement.getContext('2d');

    const image = new Image();
    setInterval(async () => {
      const src = await this.cameraPreview.takeSnapshot();
      console.log(src);
      image.src = `data:image/jpeg;base64,${src}`;
    }, 1000 / 100);

    image.onload = async () => {
      this.ctx.clearRect(0, 0, this.photoCanvas.nativeElement.width, this.photoCanvas.nativeElement.height);
      this.ctx.drawImage(image, 0, 0, this.photoCanvas.nativeElement.width, this.photoCanvas.nativeElement.height);
      this.pose = await this.net.estimateSinglePose(this.photoCanvas.nativeElement);
      const connectedJoints = posenet.getAdjacentKeyPoints(this.pose.keypoints, 0.5);
      this.poseStr = JSON.stringify(this.pose);

      this.ctx.strokeStyle = 'blue';
      this.ctx.lineWidth = 2;
      this.ctx.fillStyle = 'blue';
      this.pose.keypoints.forEach(point => {
        if (point.score) {
          this.ctx.fillRect(point.position.x, point.position.y, 5, 5);
        }
      });
      connectedJoints.forEach(points => {
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].position.x, points[0].position.y);
        this.ctx.lineTo(points[1].position.x, points[1].position.y);
        this.ctx.closePath();
        this.ctx.stroke();
      });
    };
  }
}
