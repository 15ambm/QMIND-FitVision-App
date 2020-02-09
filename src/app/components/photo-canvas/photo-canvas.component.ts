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
  @ViewChild('displayCanvas', null) displayCanvas: ElementRef<HTMLCanvasElement>;
  private photoCtx: CanvasRenderingContext2D;
  private displayCtx: CanvasRenderingContext2D;
  private net: posenet.PoseNet;
  pose: posenet.Pose;

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
    this.photoCtx = this.photoCanvas.nativeElement.getContext('2d');

    this.displayCanvas.nativeElement.width = window.screen.width;
    this.displayCanvas.nativeElement.height = window.screen.height;
    this.displayCtx = this.displayCanvas.nativeElement.getContext('2d');

    const image = new Image();
    setInterval(async () => {
      const src = await this.cameraPreview.takeSnapshot();
      console.log(src);
      image.src = `data:image/png;base64,${src}`;
    }, 1000 / 60);

    image.onload = async () => {
      this.photoCtx.clearRect(0, 0, this.photoCanvas.nativeElement.width, this.photoCanvas.nativeElement.height);
      this.photoCtx.drawImage(image, 0, 0, this.photoCanvas.nativeElement.width, this.photoCanvas.nativeElement.height);
      this.pose = await this.net.estimateSinglePose(this.photoCanvas.nativeElement);
      const connectedJoints = posenet.getAdjacentKeyPoints(this.pose.keypoints, 0.5);

      this.displayCtx.clearRect(0, 0, this.displayCanvas.nativeElement.width, this.displayCanvas.nativeElement.height);
      this.displayCtx.drawImage(image, 0, 0, this.displayCanvas.nativeElement.width, this.displayCanvas.nativeElement.height);
      this.displayCtx.strokeStyle = 'blue';
      this.displayCtx.lineWidth = 2;
      this.displayCtx.fillStyle = 'blue';
      this.pose.keypoints.forEach(point => {
        if (point.score) {
          this.displayCtx.fillRect(point.position.x, point.position.y, 5, 5);
        }
      });
      connectedJoints.forEach(points => {
        this.displayCtx.beginPath();
        this.displayCtx.moveTo(points[0].position.x, points[0].position.y);
        this.displayCtx.lineTo(points[1].position.x, points[1].position.y);
        this.displayCtx.closePath();
        this.displayCtx.stroke();
      });
    };
  }
}
