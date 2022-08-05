var socket;

let video;
let poseNet;
let pose;
let virus = [];
let needleLength = 0;
let x;
let y;
let pinState = 0;
let virusX2 = 800;
let virusY2 = 600;
let arr = [];
let scores = 0;
var newArr;
let ElbowRX = 0;
let ElbowRY = 0;
let ElbowLX = 0;
let ElbowLY = 0;

let gameState = 0;//游戏进行状态
let virusState = [];
let virus1 = [];
let win = 0;
let music;
let  musicState = 0;

let state = 'waiting';//训练的状态
let targetLabel;

let timer = 60;//倒计时
let ran = [];


function preload(){
	blueVirus = loadImage('img/blueVirus.png');
	grayVirus = loadImage('img/grayVirus.png');
	greenVirus = loadImage('img/greenVirus.png');
	purpleVirus = loadImage('img/purpleVirus.png');
	redVirus= loadImage('img/redVirus.png');
	needle = loadImage('img/needle.png');
	pin = loadImage('img/pin.png');
	boom = loadImage('img/boom.png');
	light = loadImage('img/light.png');
	charging = loadImage('img/charging.png');
	chargingFlip = loadImage('img/chargingFlip.png');
	soundFormats('mp3', 'ogg');
	music = loadSound('music/music.mp3');
	food = loadSound('music/food.mp3');

	video = createCapture(VIDEO, () => {
		video.size(640, 480);
		video.hide();
	});

  }

function setup() {
	 createCanvas(840, 480);
	// background(0);

	//🌟🌟🌟🌟🌟🌟
	//socket = io.connect('http://5386w319o8.qicp.vip'); 
	//socket = io.connect('http://localhost:3000'); 
	socket = io.connect('https://hitting-virus.herokuapp.com/');

	// video = createCapture(VIDEO);
	// video.size(640, 480);
	// video.hide();
	poseNet = ml5.poseNet(video, modelLoaded);
	poseNet.on('pose', gotPoses);

	// createCanvas(640, 480);
	// video = createCapture(VIDEO);
	// video.hide(); 
	// poseNet = ml5.poseNet(video, modelLoaded);
	// poseNet.on('pose', gotPoses);

}

function gotPoses(poses){
	//console.log(poses);
	if(poses.length > 0){
	  pose = poses[0].pose;
	}
  }
  
  function modelLoaded(){
	console.log('poseNet ready');
  }

  function keyPressed(){
	if(key == 's'){  //按下s游戏开始
	  gameState = 1;
	  
	  timer = 60;
	  scores = 0;
	  newArr.length = 0;
	  arr.length = 0;
	  console.log(newArr.length);
	  let temp = gameState;
	  socket.emit('gameState', temp);

	  for(let i = 1; i < 60; i++){
		ran[i] = Math.floor(random(1,6));
	}
	for(let i = 1; i < 60; i++){

	  let ranx = Math.floor(random(150,400));
	  virus[i] = new Virus(ranx, -80*i*2, ran[i]);
	}
	
	
	socket.on('gameState', function(temp){
		console.log('got temp: ' + temp);
		gameState = temp;
		console.log('gameState: ' + gameState);

	    timer = 60;
		scores = 0;

	});
	
		socket.on('sendVirus', function(virusState){
			//console.log(temp);
			//socket.broadcast.emit('sendVirus', virusState[i]);
			for(let i = 1; i < 60; i++){
				
				virus1[i] = virusState[i];
			}
			for(let i = 1; i < 60; i++){
				//ran = Math.floor(random(1,6));
				virus[i] = new Virus(virus1[i].x, virus1[i].y, virus1[i].i);
			  }
			console.log(virus);
		});

	  for(let i = 1; i < 60; i++){
		
		virusState[i]= virus[i];
		//virusState0 = virusState[0];
		//console.log(virusState[0]);
		
	  }
	  socket.emit('sendVirus', virusState);
	  console.log(virus);
	  
	}
	
  }
  
  
  function draw() {
	
	translate(video.width, 0);
	scale(-1, 1);
	//image(flipVideo, 0, 0);
	image(video, 0, 0);
	translate(640, 0);
	scale(-1, 1);
	//image(light, 20, 20, 100, 100);
	noFill();
	strokeWeight(4);
	stroke(51);
	//rect(0, 100, 80, 80);
	// rect(0, 300, 80, 80);
	image(charging, 0, 300, 80, 80);
	//rect(560, 100, 80, 80);
	// rect(560, 300, 80, 80);
	image(chargingFlip, 560, 300, 80, 80);
	noStroke();
	fill('green');
	
	// if(gameState == 0){
	// 	noStroke();
	// 	textSize(30);
	// 	text(' Press \'s\'\n\n to start\n\n the game', 650, 200);	
	// }
	if (timer<=0) {
  
	  //print("END GAME");
	  strokeWeight(5);
	  stroke(255);//(39, 72, 98);
	  textSize(60);
	  text('YOU GOT '+scores+' SCORES', 20, 250);
	  gameState = 0;//游戏停止
	  let scores0 = scores;
	  socket.emit('sendScores', scores0);
	  socket.on('sendScores', function(scores0){
		scores1 = scores0;
		if(scores > scores0){
			win = 1;
		}
	});
}
	newArr = [];
	var o = {};  // { 1:true, 2:true}
	for (let i = 0; i < arr.length; i++) {
		var t = arr[i];
		if(o[t]){  			// 标记是否处理过 
						
		}else{
			newArr.push(arr[i]);
			o[t] = true;
		}
	}
	scores = newArr.length;


	
	if(gameState){
		musicState++;
		if(musicState == 1){
			//music.play();
		}
		if (frameCount % 40 == 0 && timer > 0) { 
			//console.log(timer);
			timer--;
		  }
		textSize(50);
		//fill(217, 104, 49);
		text('Time: '+timer, 20, 50);//显示倒计时
		textSize(50);
		text('SCORES: '+scores, 350, 50);

		if(pose){
			// let dS = dist(pose.leftShoulder.x, pose.leftShoulder.y, pose.rightShoulder.x, pose.rightShoulder.y);
			
			// translate(640, 0);
			// scale(-1, 1);
			// image(chargingFlip, pose.leftShoulder.x+160, pose.leftShoulder.y-50, dS/2, dS/4);

			// image(charging, pose.rightShoulder.x-210, pose.rightShoulder.y-50, dS/2, dS/4);
			// translate(640, 0);
			// scale(-1, 1);
			 let d = dist(pose.leftElbow.x, pose.leftElbow.y, pose.rightElbow.x, pose.rightElbow.y);
			 //console.log(d);
			 x = (pose.leftElbow.x + pose.rightElbow.x)/2;
			 y = (pose.leftElbow.y + pose.rightElbow.y)/2;
			 if(d > 500 & needleLength<115){
			 needleLength++;
		   }
			 if(d < 500 & needleLength>0){
			 needleLength-=2;
		   }
			translate(640, 0);
			scale(-1, 1);
			fill('white');
			let newRX = pose.rightElbow.x;
			let newRY = pose.rightElbow.y;
			ElbowRX = lerp(ElbowRX, newRX, 0.4);
			ElbowRY = lerp(ElbowRY, newRY, 0.4);
    		ellipse(ElbowRX, ElbowRY, needleLength/2);
			let newLX = pose.leftElbow.x;
			let newLY = pose.leftElbow.y;
			ElbowLX = lerp(ElbowLX, newLX, 0.4);
			ElbowLY = lerp(ElbowLY, newLY, 0.4);
			ellipse(ElbowLX, ElbowLY, needleLength/2);
			// console.log(needleLength);
			// image(light, ElbowRX-30, ElbowRY, needleLength/2, needleLength/2);
			// image(light, ElbowLX, ElbowLY, needleLength/2, needleLength/2);
			//rect(45, 53, needleLength, 23);
			translate(640, 0);
			scale(-1, 1);
			 if(needleLength>1 & d < 200){
			   //image(pin, x, y, 100, 100 );
			   pinState = 1;
				
		   }else{
			 pinState = 0;
		   }
		   	
			 for(let i = 1; i < 60; i++){
			   //console.log(needleLength);
			   let d2 = dist(x, y, virus[i].x , virus[i].y);
			   
			   if(pinState == 1 & d2<150){//手肘和病毒接触
				 virusY2 = virus[i].y;
				 virusX2 = virus[i].x;
				 virus[i].y = 600;
				 append(arr, i);
				 food.play();
			   }else{
				 virus[i].show();
				 virus[i].move();
			   }
			   image(boom, virusX2, virusY2, 80, 80);
			   
			 
		   }
		 }
		 
	}else{
		music.stop();
		musicState = 0;
	}

	
  
  
  

}


function Virus(x,y,i){
	this.x = x;
	this.y = y;
	this.i = i;
	
	
	this.show = function(){
	  if(i == 1){
		image(blueVirus, this.x, this.y, 80, 80);
	  }
	  if(i == 2){
		image(grayVirus, this.x, this.y, 80, 80);
	  }
	  if(i == 3){
		image(greenVirus, this.x, this.y, 80, 80);
	  }
	  if(i == 4){
		image(purpleVirus, this.x, this.y, 80, 80);
	  }
	  if(i == 5){
		image(redVirus, this.x, this.y, 80, 80);
	  }
	}
	
	this.move = function(){//从上往下落下
	  this.y+=3;
	}
	
	
  }
  