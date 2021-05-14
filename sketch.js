let facemesh;
let video;
let predictions = [];

let videoWidth = 640;
let videoHeight = 480;

let pics = [];
let idx = 0;

let input;
let userImg;
let facemeshUserImg;
let predictionsUserImg = [];
let xMouthUserImg;
let yMouthUserImg;
let widthMouthUserImg;
let heightMouthUserImg;


function setup() {
  // createCanvas(640, 480);
  // video = createCapture(VIDEO);

  createCanvas( videoWidth*2, videoHeight );

  let constraints = {
    video: {
      mandatory: {
        maxWidth: videoWidth,
        maxHeight: videoHeight
      }
    },
    audio: false
  };
  
  video = createCapture( constraints );

  // video.size(width, height);


  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();

  input = createFileInput(handleFile);
  input.position(width/2, 20);

}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background(200);
  image(video, 0, 0, width/2, height);

  // We call function to draw all keypoints
  // drawKeypoints();

    /*if (userImg) {
      image(userImg, width/2, 0, width/2, height);
    }*/

  if (predictionsUserImg.length > 0) {
      // image(userImg, width/2, 0, videoWidth, videoHeight);
      // userImg.size(videoWidth,videoHeight);
      image(userImg, width/2, 0);
      console.log('TEST APR AFFICHAGE')
      console.log(userImg)
      drawKeypointsUserImg();
      // noLoop(); // stop looping when the poses are estimated // marche pas parce que l'autre doit avoir une loop
      drawKeypoints();
  }
  
}


// A function to draw ellipses over the detected keypoints of the video
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;


    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      fill(0, 0, 0);
      ellipse(x, y, 2, 2);
      color = color +2;
    }

    // const [v, w] = keypoints[13];
    // console.log(keypoints[13][0]);
    fill(255, 0, 0);

    let widthMouth = keypoints[287][0]-keypoints[57][0];
    let heightMouth = keypoints[18][1]-keypoints[164][1];


    if ( video.loadedmetadata ) { // I've added this check. Only shoot pics if the camera is ready.

      let img = video.get( keypoints[57][0], keypoints[164][1], widthMouth, heightMouth );

      let mouthMask;
      mouthMask = createGraphics(widthMouth, heightMouth);

      let xDepart = keypoints[57][0];
      let yDepart = keypoints[164][1];

      mouthMask.noStroke();
      mouthMask.fill('rgba(0, 0, 0, 1)');
      mouthMask.beginShape();
      mouthMask.vertex(keypoints[57][0]-xDepart, keypoints[57][1]-yDepart);
      mouthMask.vertex(keypoints[186][0]-xDepart, keypoints[186][1]-yDepart);
      mouthMask.vertex(keypoints[92][0]-xDepart, keypoints[92][1]-yDepart);
      mouthMask.vertex(keypoints[165][0]-xDepart, keypoints[165][1]-yDepart);
      mouthMask.vertex(keypoints[167][0]-xDepart, keypoints[167][1]-yDepart);
      mouthMask.vertex(keypoints[164][0]-xDepart, keypoints[164][1]-yDepart);
      mouthMask.vertex(keypoints[393][0]-xDepart, keypoints[393][1]-yDepart);
      mouthMask.vertex(keypoints[391][0]-xDepart, keypoints[391][1]-yDepart);
      mouthMask.vertex(keypoints[322][0]-xDepart, keypoints[322][1]-yDepart);
      mouthMask.vertex(keypoints[410][0]-xDepart, keypoints[410][1]-yDepart);
      mouthMask.vertex(keypoints[287][0]-xDepart, keypoints[287][1]-yDepart);
      mouthMask.vertex(keypoints[273][0]-xDepart, keypoints[273][1]-yDepart);
      mouthMask.vertex(keypoints[335][0]-xDepart, keypoints[335][1]-yDepart);
      mouthMask.vertex(keypoints[406][0]-xDepart, keypoints[406][1]-yDepart);
      mouthMask.vertex(keypoints[313][0]-xDepart, keypoints[313][1]-yDepart);
      mouthMask.vertex(keypoints[18][0]-xDepart, keypoints[18][1]-yDepart);
      mouthMask.vertex(keypoints[83][0]-xDepart, keypoints[83][1]-yDepart);
      mouthMask.vertex(keypoints[182][0]-xDepart, keypoints[182][1]-yDepart);
      mouthMask.vertex(keypoints[106][0]-xDepart, keypoints[106][1]-yDepart);
      mouthMask.vertex(keypoints[43][0]-xDepart, keypoints[43][1]-yDepart);
      mouthMask.endShape(CLOSE);
      // mouthMask.filter(BLUR, 5);

      img.mask(mouthMask);

      //image(mouthMask, 0, 0, widthMouth,heightMouth);


      pics.push(img);

      let ratiosize = widthMouth/widthMouthUserImg;
      let widthMouthDeepfake = widthMouth/ratiosize;
      let heightMouthDeepfake=heightMouth/ratiosize;

      image(pics[idx], width/2+xMouthUserImg+widthMouthUserImg/2-widthMouthDeepfake/2, yMouthUserImg+heightMouthUserImg/2-heightMouthDeepfake/2, widthMouthDeepfake, heightMouthDeepfake);
      idx++;

      // console.log(widthMouth);
      
    }

  }
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    userImg = createImg(file.data,imageReady);
    console.log(userImg)
    // userImg.size(videoWidth,videoHeight);
    console.log(userImg)
    userImg.hide();
  } else {
    userImg = null;
  }
}

// when the image is ready, then load up poseNet
function imageReady() {
  
  facemeshUserImg = ml5.facemesh(modelReadyUserImg);

  facemeshUserImg.on("predict", results => {
    predictionsUserImg = results;
  });
}

function modelReadyUserImg() {
  console.log("Model ready for USER image!");
  facemeshUserImg.predict(userImg);
}

function drawKeypointsUserImg() {
  for (let i = 0; i < predictionsUserImg.length; i += 1) {
    const keypoints = predictionsUserImg[i].scaledMesh;

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      noStroke();
      fill(255, 0, 0);
      ellipse(x+width/2, y, 2, 2);

      xMouthUserImg = keypoints[57][0];
      yMouthUserImg = keypoints[164][1];

      widthMouthUserImg = keypoints[287][0]-keypoints[57][0];
      heightMouthUserImg = keypoints[18][1]-keypoints[164][1];
    }
  }
}