/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let scoreArea = document.getElementById ("scoreArea");
let canvas;
let ctx;
// let buttonArea = document.getElementById ("buttonArea");
let resetButton = document.getElementById ("resetButton").addEventListener ("click", reset);


canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 760;
canvas.height = 540;
canvas.setAttribute('style', "left: 50%; margin-left:300px; border: 2px solid rgb(107, 82, 197)")
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, monster2Ready, bombReady, bomb2Ready, ghostReady, slashReady, slash2Ready, youlostReady;
let bgImage, heroImage, monsterImage, monster2Image, bombImage, bomb2Image, ghostImage, slashImage, slash2Image, youlostImage;
let heart1Ready, heart2Ready, heart3Ready, heart4Ready;
let heart1Image, heart2Image, heart3Image, heart4Image;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

let controller, loop;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/star.png";

  monster2Image = new Image();
  monster2Image.onload = function () {
    // show the monster image
    monster2Ready = true;
  };
  monster2Image.src = "images/monster2.png";

  bombImage = new Image();
  bombImage.onload = function () {
    // show the bomb image
    bombReady = true;
  };
  bombImage.src = "images/ghost2.png";

  bomb2Image = new Image();
  bomb2Image.onload = function () {
    // show the bomb image
    bomb2Ready = true;
  };
  bomb2Image.src = "images/ghost2.png";

  slashImage = new Image();
  slashImage.onload = function () {
    // show the bomb image
    slashReady = true;
  };
  slashImage.src = "images/slash.png";

  slash2Image = new Image();
  slash2Image.onload = function () {
    // show the bomb image
    slash2Ready = true;
  };
  slash2Image.src = "images/slash2.png";


  heartImage = new Image();
  heartImage.onload = function () {
    heartReady = true;
  };
  heartImage.src = "images/heart1.png";
  heartBar.push({
    img: heartImage,
    x: 10,
    y: 10,
    ready: true
  })
  heart2Image = new Image();
  heart2Image.onload = function () {
    heart2Ready = true;
  };
  heart2Image.src = "images/heart2.png";
  heartBar.push({
    img: heart2Image,
    x: 50,
    y: 10,
    ready: true
  })
  heart3Image = new Image();
  heart3Image.onload = function () {
    heart2Ready = true;
  };
  heart3Image.src = "images/heart3.png";
  heartBar.push({
    img: heart3Image,
    x: 90,
    y: 10,
    ready: true
  })
  heart4Image = new Image();
  heart4Image.onload = function () {
    heart2Ready = true;
  };
  heart4Image.src = "images/heart3.png";
  heartBar.push({
    img: heart3Image,
    x: 130,
    y: 10,
    ready: true
  })

//Heart done

  youlostImage = new Image();
  youlostImage.onload = function () {
    // show the bomb image
    youlostReady = true;
  };
  youlostImage.src = "images/gameover.png";




}


  

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let score = 0;

let heartBar = [];
let gameOver;

let youlostX = 250;
let youlostY = 170;

let heroX = canvas.width / 2;
let heroY = 400;
let jumping = true;

let heroX_velocity = 0;
let heroY_velocity = 0;

let bombX = 200;
let bombY = 400;
let bombSpeedX = 3;
let bombSpeedY = 3;

let bomb2X = 400;
let bomb2Y = 200;
let bomb2SpeedX = 3;
let bomb2SpeedY = 3;

let slashX = canvas.width + 500;
let slash2X = canvas.width + 500;
let monsterX = canvas.width - 60;
let monsterY = 10;
let monsterSpeedX = 2;
let monsterSpeedY = 2;

let monster2X = 100;
let monster2Y = 360;
let monster2SpeedX = 4;
let monster2SpeedY = 4;
let t = 0;



//CONTROLLER
controller = {

  left:false,
  right:false,
  up:false,
  leftattack:false,
  rightattack:false,
  keyListener:function(event) {

    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {
      case 37:// left key
        controller.left = key_state;
      break;
      case 38:// up key
        controller.up = key_state;
      break;
      case 39:// right key
        controller.right = key_state;
      break;
      case 68:// attack right key
        controller.rightattack = key_state;
      break;
      case 65:// attack left key
        controller.leftattack = key_state;
      break;
    }

  }
};
//CONTROLLER DONE

//LOOP FUNCTION
loop = function() {

  if (controller.up && jumping == false) {
    heroY_velocity -= 20;
    jumping = true;
  }

  if (controller.left) {
    heroX_velocity -= 0.5;
  }

  if (controller.right) {
    heroX_velocity += 0.5;
  }

  if (controller.rightattack) {
    slashX = heroX + 60;
    slashY = heroY - 5; 
  } else {
    slashX = -500;
    slashY = -500;}

  if (controller.leftattack) {
    slash2X = heroX - 60;
    slash2Y = heroY - 5; 
  } else {
    slash2X = -500;
    slash2Y = -500;}

  heroY_velocity += 1.5;// gravity
  heroX += heroX_velocity;
  heroY += heroY_velocity;
  heroX_velocity *= 0.9;// friction
  heroY_velocity *= 0.9;// friction

  // if rectangle is falling below floor line
  if (heroY > 400) {
    jumping = false;
    heroY = 400;
    heroY_velocity = 0;
  }

  // // if rectangle is going off the left of the screen
  // if (rectangle.x < -32) {

  //   rectangle.x = 320;

  // } else if (rectangle.x > 320) {// if rectangle goes past right boundary

  //   rectangle.x = -32;

  // }

  if (heroX <= 0) heroX = canvas.width - 32;
  if (heroX >= canvas.width) heroX = 0;
  if (heroY <= 0) heroY = canvas.height - 32;
  if (heroY >= canvas.height) heroY = 0;

  bombX = bombX + bombSpeedX;
  bombY = bombY + bombSpeedY;
  if (bombX <= 0) { bombSpeedX = -bombSpeedX }
  if (bombX >= canvas.width - 50) { bombSpeedX = -bombSpeedX }
  if (bombY <= 0) { bombSpeedY = -bombSpeedY }
  if (bombY >= canvas.height - 100) { bombSpeedY = -bombSpeedY }

  bomb2X = bomb2X + bomb2SpeedX;
  bomb2Y = bomb2Y + bomb2SpeedY;
  if (bomb2X <= 0) { bomb2SpeedX = -bomb2SpeedX }
  if (bomb2X >= canvas.width - 50) { bomb2SpeedX = -bomb2SpeedX }
  if (bomb2Y <= 0) { bomb2SpeedY = -bomb2SpeedY }
  if (bomb2Y >= canvas.height - 60) { bomb2SpeedY = -bomb2SpeedY }

  if (heroX <= (bombX + 32)
&& bombX <= (heroX + 32)
&& heroY <= (bombY + 32)
&& bombY <= (heroY + 32)) {if((heartBar.length > 0)){
  heartBar.pop(); 
  bombX = 32 + (Math.random() * (canvas.width - 64))
  bombY = canvas.height - 500
  heroX += 40
}  
};

if (heroX <= (bomb2X + 32)
&& bomb2X <= (heroX + 32)
&& heroY <= (bomb2Y + 32)
&& bomb2Y <= (heroY + 32)) {if((heartBar.length > 0)){
  heartBar.pop(); 
  bomb2X = 32 + (Math.random() * (canvas.width - 64))
  bomb2Y = canvas.height - 400
  heroX += 40
}  
};

//IF HERO COLLIDES WITH MONSTER2//
if (heroX <= (monster2X + 32)
&& monster2X <= (heroX + 32)
&& heroY <= (monster2Y + 32)
&& monster2Y <= (heroY + 32)) {if((heartBar.length > 0))
  {
  heartBar.pop(); 
  if(heroX = monster2X + 50) {heroX_velocity += 20} else if (heroX - 50 <= (monster2X - 30)) {heroY_velocity -= 20}
}  
};
//IF HERO COLLIDES WITH MONSTER2 DONE//

monster2X = monster2X + monster2SpeedX;
t += 0.1;
monster2Y = monster2Y + (Math.sin(t * 1) * 0.1 * 50);

if (monster2X <= 0) { monster2SpeedX = -monster2SpeedX }
if (monster2X >= canvas.width - 50) { monster2SpeedX = -monster2SpeedX }


 // // star speed
 monsterX = monsterX - monsterSpeedX;
 monsterY = monsterY + monsterSpeedY;
// // if star is going off the screen

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = 32 + (Math.random() * (canvas.width - 64)  );;
    monsterY = 32 + (Math.random() * (canvas.height - 500)  );
    monsterX = monsterX - monsterSpeedX;
    score += 1;
    console.log ("score", score);
    scoreArea.innerHTML = `${score}`;
    // monsterY = 32 + (Math.random() * (canvas.height - 64) );
  };


  if (monsterX < -50) {monsterX = 32 + (Math.random() * (canvas.width - 64)  );;
    monsterY = canvas.height - 500}
  if (monsterY >= canvas.height) {monsterX = 32 + (Math.random() * (canvas.width - 64));
    monsterY = canvas.height - 500}




if (monster2X <= (slashX+30) && slashX <= (monster2X + 30)) {
monster2X +=10;
}
if (monster2X <= (slash2X+30) && slash2X <= (monster2X + 30)) {
  monster2X -=10;
}
  
if (heartBar.length <= 0) {gameOver = true;}

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};


function reset() {
  location.reload();
}
//LOOP FUNCTION DONE





/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (monster2Ready) {
    ctx.drawImage(monster2Image, monster2X, monster2Y);
  }
  if (bombReady) {
    ctx.drawImage(bombImage, bombX, bombY);
  }
  if (bomb2Ready) {
    ctx.drawImage(bomb2Image, bomb2X, bomb2Y);
  }
  if (slashReady) {
    ctx.drawImage(slashImage, slashX, slashY);
  }
  if (slash2Ready) {
    ctx.drawImage(slash2Image, slash2X, slash2Y);
  }
  for (let i = 0; i < heartBar.length; i++) {
    console.log(heartBar)
    if (heartBar[i].ready)
      ctx.drawImage(heartBar[i].img, heartBar[i].x, heartBar[i].y)
  }
  if (youlostReady && gameOver == true) {
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 120, canvas.width, 270);
    ctx.drawImage(youlostImage, youlostX, youlostY);
    scoreArea.innerHTML = 0;
    heroX = 340;
    bombX = 300;    bombY = 430;  
    bomb2X = 300;    bomb2Y = 410;
    monster2X = 390; monster2Y = 395;
    monsterX = 300; monsterY = 240; 

  }

  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
main();
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);