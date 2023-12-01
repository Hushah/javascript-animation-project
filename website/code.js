/*************************************************************************** Classes ***************************************************************************/
// Class for creating the background sprites
class backgroundSprite {
    constructor(name, pos, width, height) {
        this.image = document.createElement("img");
        this.image.src = name;
        this.pos = new Vector(pos[0], pos[1]);
        this.width = width;
        this.height = height;
    }

    // Draw static background
    draw() {
        ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
    }

    // Draw scrolling background
    scrollingBackground(scrollDirection, speed) {
        // Scrolling left to right
        if (scrollDirection == 0) {
            // Draw background at position
            ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);

            // Increment position
            this.pos.x += speed;

            // Scrolling right to left !!!Not Used: No need to implement!!!
        } else if (scrollDirection == 1) {
            // Code here...
        }
    }
}


// Class for creating a single instance of a star
class StarSingle {
    constructor() {
        this.radius = 0.3;
        this.maxRadius = getRandomNum(1, 3);
        this.velocity = new Vector(0, 0);
        let t = getRandomNum(1, 5);
        this.velocity = new Vector(0, t);

        this.pos = new Vector(0, 0);
        this.startPos = new Vector(0, 0);
        this.startPos.x = this.pos.x = getRandomNum(0, ctx.canvas.width);
        this.startPos.y = this.pos.y = getRandomNum(0, ctx.canvas.height);
    }

    // Draw the star
    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Update the star
    update() {
        // Increment position of the star
        this.pos.add(this.velocity);

        // Reset the star to top of the screen if it goes below the screen
        if (this.pos.y > ctx.canvas.height) {
            this.pos.y = 0;
        }

        // Increment the radius of the star (Stars fading in)
        if (this.radius < this.maxRadius) {
            this.radius += 0.01;
        }
    }
}


// Class for collection of stars
class Stars {
    constructor(size) {
        this.size = size;
        this.array = [];
    }

    // Initialize the stars
    init() {
        for (let i = 0; i < this.size; i++) {
            this.array.push(new StarSingle());
        }
    }

    // Update the stars
    update() {
        for (let i = 0; i < this.size; i++) {
            this.array[i].update();
        }
    }

    // Draw the stars
    draw() {
        for (let i = 0; i < this.size; i++) {
            this.array[i].draw();
        }
    }

    // Reset the stars
    reset() {
        for (let i = 0; i < this.size; i++) {
            this.array[i].radius = 0.3;
        }
    }
}


// Class for animation of sprite
class SpriteAnimation {
    constructor(walkingArray) {
        this.walkingArray = walkingArray;
        this.poseLoopIndex = 0;
        this.animationDelayIndex = 0;
    }

    // Draw the sprite walking left
    walkLeft(spriteWidth, spriteHeight, spriteY, spriteVelocity, animationDelayAmount) {
        // Change to next animation if we have delayed the animation long enough
        if (this.animationDelayIndex >= animationDelayAmount) {
            this.poseLoopIndex++;
            this.animationDelayIndex = 0;
        }

        // If we have reached the end of the walking poses, reset to first pose
        if (this.poseLoopIndex >= this.walkingArray.length) {
            this.poseLoopIndex = 0;
        }

        // Draw the sprite
        ctx.drawImage(this.walkingArray[this.poseLoopIndex], manSpriteX, spriteY, spriteWidth, spriteHeight);

        // Move the sprite
        manSpriteX -= spriteVelocity;

        // Increment the animation delay index
        this.animationDelayIndex++;
    }

}
/*************************************************************************** Classes ***************************************************************************/




/*************************************************************************** Functions ***************************************************************************/
// Function for a single isntance of the fire particle
function particle() {
    // Speed, angle and direction of the fire particle
    this.speed = { x: -5 + Math.random() * 10, y: 15 + Math.random() * 10 };

    // Location of the fire particle
    this.location = { x: fireParticlesStartPointX, y: fireParticlesStartPointY };

    // Radius of the fire particle
    this.radius = 10 + Math.random() * 20;

    // Life of the fire particle
    this.life = 20 + Math.random() * 10;

    // Remaining life of the fire particle
    this.remaining_life = this.life;

    // Colours
    this.r = Math.round(Math.random() * 255);
    this.g = Math.round(Math.random() * 255);
    this.b = Math.round(Math.random() * 255);
}


// Function to draw the fire particles
function drawFire() {
    // Change the composition of the fire particles to make it look brighter
    ctx.globalCompositeOperation = "lighter";

    // Loop through the fire particles
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        ctx.beginPath();

        // Changing opacity according to the life.
        // Opacity goes to 0 at the end of life of a particle
        p.opacity = Math.round(p.remaining_life / p.life * 100) / 100

        // A gradient instead of white fill
        var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
        gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
        gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
        gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");

        ctx.fillStyle = gradient;
        ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
        ctx.fill();

        // Incrementing and decrementing variables
        p.remaining_life--;
        p.radius--;
        p.location.x += p.speed.x;
        p.location.y += p.speed.y;

        // Regenerate particles
        if (p.remaining_life < 0 || p.radius < 0) {
            // A brand new particle replacing the dead one
            particles[i] = new particle();
        }
    }

    // Reset the global composition to not affect other objects
    ctx.globalCompositeOperation = "source-over";
}


// Function to generate random number
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}


// Function to display text
function displayText(text, x, y, colour, size) {
    ctx.fillStyle = colour;
    ctx.font = size + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

/*
// Function to show the timer in top left corner
// Debug function used to check the current time of the animation 
function stopClock(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 110, 40);
    ctx.fillStyle = "black";
    ctx.font = "normal 16pt Arial";
    ctx.textAlign = "left";
    ctx.fillText("Timer: " + timer, 10, 25);
}
*/

// Function to animate the rocket flying up
function makeRocketFlyVertical() {
    ctx.drawImage(rocketSprite, rocketSpriteX, rocketSpriteY, rocketSpriteWidth, rocketSpriteHeight);
    // Draw fire partincles coming out of the rocket
    drawFire();

    // Increment the rocket's y position
    rocketSpriteY -= rocketSpriteVelocity;

    // Increment the fire particles start point
    fireParticlesStartPointY -= rocketSpriteVelocity;
}


// Function to animate scene 1
// timer >= 1 && timer < 13
function scene1() {
    if (timer < 7) {
        // Scroll neighbourhood background
        scene1neighbourhood.scrollingBackground(0, 0.5);

        // Animated man walking in place
        man.walkLeft(144, 192, 260, 0, 18);
    }

    if (timer >= 7 && timer < 13) {
        // Scroll forest background
        scene1forest.scrollingBackground(0, 0.5);

        // Animate man walking in place
        man.walkLeft(144, 192, 260, 0, 18);
    }
}


// Function to animate scene 2
// timer >= 13 && timer < 26
function scene2() {
    if (timer < 19) {
        // Draw the desert blurred background (static)
        scene2desertblurred.draw();

        // Draw picture of man and wife
        ctx.drawImage(scene2PhotoSprite, 80, 100, 639, 424.5);

    } else if (timer >= 19 && timer < 26) {
        // Scroll desert background
        scene2desert.scrollingBackground(0, 0.5);

        // Animate man walking in place
        man.walkLeft(144, 192, 260, 0, 20);
    }
}


// Function to animate scene 3
// timer >= 26 && timer < 41
function scene3() {
    // Once the scene begins, change position of man 
    if (scene3TempCounter == 0) {
        scene3TempCounter++;
        manSpriteX = 700;
    }

    // Reset desert background size and centre position
    scene2desert.width = 1080;
    scene2desert.height = 600;
    scene2desert.pos.x = -140;
    scene2desert.pos.y = 0;

    // Draw desert background (static)
    scene2desert.draw();

    if (timer >= 26 && timer < 35) {
        // Draw man walking left until he goes behind the rocket
        if (timer < 32) {
            man.walkLeft(48, 64, 350, 1, 10);
        }

        // Draw rocket
        ctx.drawImage(rocketSprite, rocketSpriteX, rocketSpriteY, rocketSpriteWidth, rocketSpriteHeight);
    }

    // At 35 seconds make the rocket fly up off the screen
    if (timer >= 35 && timer < 40) {
        makeRocketFlyVertical();
    }

    // Make screen slowly fade
    if (timer >= 35 && timer < 41) {
        ctx.globalAlpha -= 0.004;
    }

    // At the end of scene, change position of the rocket and fire particles
    if (timer == 39) {
        rocketSpriteY = ctx.canvas.height;
        fireParticlesStartPointY = (rocketSpriteY + rocketSpriteHeight) + 10;
    }
}


// Function to animate scene 4
// timer >= 41 && timer < 53
function scene4() {
    // Draw background
    ctx.fillStyle = "rgb(0, " + scene4Green + ", " + scene4Blue + ")";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Decrease green and blue values
    if (scene4Green > 0) {
        scene4Green -= scene4GreenSpeed;
    }
    if (scene4Blue > 50) {
        scene4Blue -= scene4BlueSpeed;
    }

    // Draw red planet
    ctx.drawImage(redPlanetSprite, redPlanetStartingX, redPlanetStartingY, redPlanetWidth, redPlanetHeight);
    redPlanetStartingY += 0.2;

    // Draw stars
    stars.update();
    stars.draw();

    // Draw rocket
    rocketSpriteVelocity = 2;
    makeRocketFlyVertical();

    // At 47 Seconds, draw the end screen text
    if (timer >= 47 && timer < 53) {
        displayText("An Entire Universe of Possibilities", ctx.canvas.width / 2, ctx.canvas.height / 2, "yellow", 30);
    }
    if (timer >= 49 && timer < 53) {
        displayText("JoinTheSpaceForce.Org", ctx.canvas.width / 2, (ctx.canvas.height / 2) + 35, "yellow", 30);
    }
}


// The Animation Loop
function animationLoop(timestamp) {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Code to reset timer once it reaches time limit
    timer = Math.floor((timestamp - (ticker * (timeLimitSeconds * 1000))) / 1000);
    if (timer > timeLimitSeconds) {
        // ticker used to declare when a loop has finished, and reset timer
        ticker++;
    }

    // Play music once animation starts
    if (timer == 1) {
        music.play();
    }

    // Scene 0
    if (timer < 1) {
        // Black screen to start animation
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Scene 1
    if (timer >= 1 && timer < 13) {
        scene1();
    }

    // Scene 2
    if (timer >= 13 && timer < 26) {
        scene2();
    }

    // Scene 3
    if (timer >= 26 && timer < 41) {
        scene3();
    }

    // Scene 4
    if (timer >= 41 && timer < 53) {
        // Reset globalAlpha, since scene 3 fades the screen
        ctx.globalAlpha = 1;

        scene4();
    }

    // End of the loop
    if (timer == 52) {
        // Resetting values
        // Reset neighbourhood background
        scene1neighbourhood.width = 1325;
        scene1neighbourhood.height = 605;
        scene1neighbourhood.pos.x = -525;
        scene1neighbourhood.pos.y = 0;

        // Reset forest background
        scene1forest.width = 1080;
        scene1forest.height = 600;
        scene1forest.pos.x = -280;
        scene1forest.pos.y = 0;

        // Reset desert background
        scene2desert.width = 2160;
        scene2desert.height = 1200;
        scene2desert.pos.x = -1360;
        scene2desert.pos.y = -400;

        // Reset colour values of the sky in the star scene
        scene4Green = 200;
        scene4Blue = 255;

        // Reset stars
        stars.reset();

        // Reset red planet
        redPlanetStartingY = -160;

        // Reset rocket and fire particles
        rocketSpriteY = (ctx.canvas.height / 2) - (rocketSpriteHeight / 2);
        fireParticlesStartPointY = (rocketSpriteY + rocketSpriteHeight) + 10;
        rocketSpriteVelocity = 1.5;

        // Reset man sprite
        manSpriteX = (ctx.canvas.width / 2) - 100;

        // Reset temporary counter for scene 3
        scene3TempCounter = 0;

        // Change background colour to the end value of the sky in the star scene
        ctx.fillStyle = "rgb(0, 0, 50)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }



    // Debug function just to check the current time and adjust scene transitions
    // stopClock();

    // Calling animation too keep looping
    window.requestAnimationFrame(animationLoop);
}
/*************************************************************************** Functions ***************************************************************************/




/*************************************************************************** Main ***************************************************************************/
let ctx = document.querySelector("canvas").getContext("2d");

// Timer
let timer = 0;

// Ticker to flag the end of the animation loop
let ticker = 0;

// Time limit for the animation
let timeLimitSeconds = 52;

// Music
let music = new Audio("./audio/ColterWall_Cowpoke.wav");

// Values for the sky in the star scene
let scene4Green = 200;
let scene4Blue = 255;
let scene4GreenSpeed = 0.5;
let scene4BlueSpeed = 0.5;

// Creating stars
let stars = new Stars(100);
stars.init();

// Neighbourhood background
let scene1neighbourhood = new backgroundSprite("./images/background/neighbourhood_background_6976x3185.jpg", [-525, 0], 1325, 605);

// Forest background
let scene1forest = new backgroundSprite("./images/background/forest_background_6325x3514.jpg", [-280, 0], 1080, 600);

// Desert backgrounds
let scene2desertblurred = new backgroundSprite("./images/background/desert_blurred_background_800x600.jpg", [0, 0], 800, 600);
let scene2desert = new backgroundSprite("./images/background/desert_background_6325x3514.jpg", [-1360, -400], 2160, 1200); //  original size: 1080, 600 middle position: -280, 0

// Red planet variables
let redPlanetSprite = new Image();
redPlanetSprite.src = "./images/sprites/kenney_planets/Planets/redplanet_1280x1280.png";
let redPlanetWidth = 150;
let redPlanetHeight = 150;
let redPlanetStartingX = 600;
let redPlanetStartingY = -160;

// Rocket variables
let rocketSprite = new Image();
rocketSprite.src = "./images/sprites/kenney_spaceshooterextension/PNG/Sprites X2/Rockets/spaceRocket_313x618.png";
let rocketSpriteWidth = 156.5;
let rocketSpriteHeight = 309;
let rocketSpriteX = (ctx.canvas.width / 2) - (rocketSpriteWidth / 2);
let rocketSpriteY = (ctx.canvas.height / 2) - (rocketSpriteHeight / 2);
let rocketSpriteVelocity = 1.5;

// Creating man sprite animation
let walkingPosesArray = new Array(8);
for (let i = 0; i < walkingPosesArray.length; i++) {
    walkingPosesArray[i] = new Image();
    walkingPosesArray[i].src = "./images/sprites/kenney_tooncharacters1/Male person/PNG/Poses HD/character_malePerson_walk" + i + ".png";
}
let man = new SpriteAnimation(walkingPosesArray);
let manSpriteX = (ctx.canvas.width / 2) - 100;

// Temporary counter for scene 3
let scene3TempCounter = 0;

// Photo of man with wife
let scene2PhotoSprite = new Image();
scene2PhotoSprite.src = "./images/sprites/photoofwife_finaledit_1278x849.png";

// Fire particles variables
let fireParticlesStartPointX = rocketSpriteX + (rocketSpriteWidth / 2);
let fireParticlesStartPointY = (rocketSpriteY + rocketSpriteHeight) + 10;

// Fire particles array
var particles = [];

// Populating the array with particles
var particle_count = 200;
for (var i = 0; i < particle_count; i++) {
    particles.push(new particle());
}

// Calling loop
window.requestAnimationFrame(animationLoop);
/*************************************************************************** Main ***************************************************************************/
