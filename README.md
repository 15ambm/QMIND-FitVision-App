# FitVision
### Developed by Justin Paoli, Jaden Edhlund, Dean Sacoransky and Alex Mason

FitVision is an application that aims to help casual and experienced gym-goers refine and perfect their form for the squat. The application is designed to detect and estimate the users pose through a phone camera and classify their current pose as a squat or not. The app will be able to count proper reps and replay the set to the user when they are finished. Through consistent use of the app users will develop clean and consistent form for both movements. 

## Check out a demo below!
![](FitVisionDemoDS.gif)


## Technologies
Built using JavaScript (TypeScript) and the Ionic Framework for cross-platform mobile development. For our pose estimation we used [PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet), a real-time pose estimation model built on top of TensorFlow.js.

## Installation Instructions
Due to the integration with the native camera, the application will not function properly on emulated devices and therefore a physical mobile device running Android or iOS is required. To run the app, clone the repository, and then follow the instructions for your mobile operating system.

### Android
To run FitVision on android, ensure that Android Studio is installed and configured correctly on your computer, and then run `ionic cordova run android` from the main project directory with your phone plugged in.

### iOS
To run FitVision on android, ensure that XCode is installed and configured correctly on your computer, and then run `ionic cordova run ios` from the main project directory with your phone plugged in.

### In association with QMIND, Queen's Universities preeminent club on Machine Learning and Artificial Intelligence