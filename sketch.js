let facemesh;
let video;
let predictions = [];

let videoWidth = 640;
let videoHeight = 480;

let picsMouth = [];
let idx = 0;

let input;
let userImg;
let facemeshUserImg;
let predictionsUserImg = [];
let xMouthUserImg;
let yMouthUserImg;
let widthMouthUserImg;
let heightMouthUserImg;

let idxLeftEye = 0;
let picsLeftEye = [];
let xLeftEyeUserImg;
let yLeftEyeUserImg;
let widthLeftEyeUserImg;
let heightLeftEyeUserImg;


let idxRightEye = 0;
let picsRightEye = [];
let xRightEyeUserImg;
let yRightEyeUserImg;
let widthRightEyeUserImg;
let heightRightEyeUserImg;

let userImgResized;

function setup() {
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


  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();

  let div = createDiv('');
  div.addClass('lineBreak');

  input = createFileInput(handleFile);

  //create the about section
  let aboutSection = createDiv(`<h2>What's Blended Faces?</h2>
<p>BlendedFaces is THE trendy filter. Select an image of one of your friends or a celebrity, one of your choice, and let the site put your mouth and eyes over the selected image. Make them do weird faces, sing the worst songs or make them say anything you want.</p>
<div><a href="https://github.com/EstelleThvn/ea_creative_project">Our github project 🤗</a></div>`);
aboutSection.addClass('aboutSection');

}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background('#edf2f4');
  image(video, 0, 0, width/2, height);

  if (predictionsUserImg.length > 0) {
      image(userImgResized, width/2, 0,videoWidth,videoHeight);

      //draws the keypoints on the image imported by the user
      drawKeypointsUserImg();

      //draws the keypoints on the video
      drawKeypoints();
  }
}


// A function to copy the eyes and mouth from the video
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;


    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      fill(0, 0, 0);
      ellipse(x, y, 2, 2);
    }


    fill(255, 0, 0);

    let widthMouth = keypoints[287][0]-keypoints[57][0];
    let heightMouth = keypoints[18][1]-keypoints[164][1];

    let widthLeftEye = keypoints[244][0]-keypoints[35][0];
    let heighLeftEye = keypoints[230][1]-keypoints[223][1];


    let widthRightEye = keypoints[265][0]-keypoints[464][0];
    let heighRightEye = keypoints[450][1]-keypoints[443][1];


    if ( video.loadedmetadata ) {

      let img = video.get(keypoints[57][0]-10, keypoints[164][1]-10, widthMouth+20, heightMouth+20);

      let mouthMask;
      mouthMask = createGraphics(widthMouth+20, heightMouth+20);

      let xDepart = keypoints[57][0]-10;
      let yDepart = keypoints[164][1]-10;

      //creates the shape of the mask for the mouth
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
      mouthMask.filter(BLUR, 8);

      img.mask(mouthMask);

      picsMouth.push(img);

      let ratiosize = widthMouth/widthMouthUserImg;
      let widthMouthDeepfake = widthMouth/ratiosize;
      let heightMouthDeepfake= heightMouth/ratiosize;

      image(picsMouth[idx], width/2+xMouthUserImg+widthMouthUserImg/2-widthMouthDeepfake/2*1.5, yMouthUserImg+heightMouthUserImg/2-heightMouthDeepfake/2*1.5, widthMouthDeepfake*1.5, heightMouthDeepfake*1.5);
      idx++;




      let leftEye = video.get(keypoints[35][0]-10, keypoints[223][1]-10, widthLeftEye+20, heighLeftEye+20);

      let leftEyeMask;
      leftEyeMask = createGraphics(widthLeftEye+20, heighLeftEye+20);

      let xLeftEyeDepart = keypoints[35][0]-10;
      let yLeftEyeDepart = keypoints[223][1]-10;

      leftEyeMask.noStroke();
      leftEyeMask.fill('rgba(0, 0, 0, 1)');
      leftEyeMask.beginShape();
      leftEyeMask.vertex(keypoints[35][0]-xLeftEyeDepart, keypoints[35][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[31][0]-xLeftEyeDepart, keypoints[31][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[228][0]-xLeftEyeDepart, keypoints[228][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[229][0]-xLeftEyeDepart, keypoints[229][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[230][0]-xLeftEyeDepart, keypoints[230][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[231][0]-xLeftEyeDepart, keypoints[231][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[232][0]-xLeftEyeDepart, keypoints[232][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[233][0]-xLeftEyeDepart, keypoints[233][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[244][0]-xLeftEyeDepart, keypoints[244][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[189][0]-xLeftEyeDepart, keypoints[189][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[221][0]-xLeftEyeDepart, keypoints[221][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[222][0]-xLeftEyeDepart, keypoints[222][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[223][0]-xLeftEyeDepart, keypoints[223][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[224][0]-xLeftEyeDepart, keypoints[224][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[225][0]-xLeftEyeDepart, keypoints[225][1]-yLeftEyeDepart);
      leftEyeMask.vertex(keypoints[113][0]-xLeftEyeDepart, keypoints[113][1]-yLeftEyeDepart);
      leftEyeMask.endShape(CLOSE);
      leftEyeMask.filter(BLUR, 8);

      leftEye.mask(leftEyeMask);


      picsLeftEye.push(leftEye);

      let LeftEyeratiosize = widthLeftEye/widthLeftEyeUserImg;
      let widthLeftEyeDeepfake = widthLeftEye/LeftEyeratiosize;
      let heightLeftEyeDeepfake=heighLeftEye/LeftEyeratiosize;

      image(picsLeftEye[idxLeftEye], width/2+xLeftEyeUserImg+widthLeftEyeUserImg/2-widthLeftEyeDeepfake/2*1.5, yLeftEyeUserImg+heightLeftEyeUserImg/2-heightLeftEyeDeepfake/2*1.5, widthLeftEyeDeepfake*1.5, heightLeftEyeDeepfake*1.5);
      idxLeftEye++;




      
      let RightEye = video.get(keypoints[464][0]-10, keypoints[443][1]-10, widthRightEye+20, heighRightEye+20);
      console.log(RightEye)

      let RightEyeMask;
      RightEyeMask = createGraphics(widthRightEye+20, heighRightEye+20);

      let xRightEyeDepart = keypoints[464][0]-10;
      let yRightEyeDepart = keypoints[443][1]-10;

      RightEyeMask.noStroke();
      RightEyeMask.fill('rgba(0, 0, 0, 1)');
      RightEyeMask.beginShape();
      RightEyeMask.vertex(keypoints[265][0]-xRightEyeDepart, keypoints[265][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[261][0]-xRightEyeDepart, keypoints[261][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[448][0]-xRightEyeDepart, keypoints[448][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[449][0]-xRightEyeDepart, keypoints[449][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[450][0]-xRightEyeDepart, keypoints[450][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[451][0]-xRightEyeDepart, keypoints[451][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[452][0]-xRightEyeDepart, keypoints[452][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[453][0]-xRightEyeDepart, keypoints[453][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[464][0]-xRightEyeDepart, keypoints[464][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[413][0]-xRightEyeDepart, keypoints[413][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[441][0]-xRightEyeDepart, keypoints[441][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[442][0]-xRightEyeDepart, keypoints[442][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[443][0]-xRightEyeDepart, keypoints[443][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[444][0]-xRightEyeDepart, keypoints[444][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[445][0]-xRightEyeDepart, keypoints[445][1]-yRightEyeDepart);
      RightEyeMask.vertex(keypoints[342][0]-xRightEyeDepart, keypoints[342][1]-yRightEyeDepart);
      RightEyeMask.endShape(CLOSE);
      RightEyeMask.filter(BLUR, 8);

      RightEye.mask(RightEyeMask);



      picsRightEye.push(RightEye);

      let RightEyeratiosize = widthRightEye/widthRightEyeUserImg;
      let widthRightEyeDeepfake = widthRightEye/RightEyeratiosize;
      let heightRightEyeDeepfake=heighRightEye/RightEyeratiosize;

      image(picsRightEye[idxRightEye], width/2+xRightEyeUserImg+widthRightEyeUserImg/2-widthRightEyeDeepfake/2*1.5, yRightEyeUserImg+heightRightEyeUserImg/2-heightRightEyeDeepfake/2*1.5, widthRightEyeDeepfake*1.5, heightRightEyeDeepfake*1.5);
      idxRightEye++;
      
    }

  }
}

//a function to handle the file imported by the user
function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    userImg = createImg(file.data,imageReady);
    userImgResized = createImg(file.data, '');

    userImg.size(videoWidth,videoHeight);

    
    userImg.hide();
    userImgResized.hide();
  } else {
    userImg = null;
    userImgResized = null;
  }
}

// when the imported image is ready, we load up facemesh
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

//a function to get the coordinates of each keypoints of the imported image
function drawKeypointsUserImg() {
  for (let i = 0; i < predictionsUserImg.length; i += 1) {
    const keypoints = predictionsUserImg[i].scaledMesh;

    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];

      noStroke();
      // ellipse(x+width/2, y, 2, 2);

      xMouthUserImg = keypoints[57][0];
      yMouthUserImg = keypoints[164][1];

      widthMouthUserImg = keypoints[287][0]-keypoints[57][0];
      heightMouthUserImg = keypoints[18][1]-keypoints[164][1];


      xLeftEyeUserImg = keypoints[35][0];
      yLeftEyeUserImg = keypoints[223][1];

      widthLeftEyeUserImg = keypoints[244][0]-keypoints[35][0];
      heightLeftEyeUserImg = keypoints[230][1]-keypoints[223][1];


      xRightEyeUserImg = keypoints[464][0];
      yRightEyeUserImg = keypoints[443][1];

      widthRightEyeUserImg = keypoints[265][0]-keypoints[464][0];
      heightRightEyeUserImg = keypoints[450][1]-keypoints[443][1];

    }
  }
}