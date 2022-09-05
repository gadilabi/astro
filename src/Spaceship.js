import {states, Drifting, RotatingClockwise, RotatingCounterClockwise, Accelerating, AcceleratingRotatingClockwise, AcceleratingRotatingCounterClockwise} from './states.js';
import {Point, Circle, Rectangle} from './Geometry.js';

export default class Spaceship {
	constructor(spaceshipSprites, fireImages){
		this.gameWidth = window.innerWidth;
		this.gameHeight = window.innerHeight;
		this.states = [
			new Drifting(this),
			new RotatingClockwise(this), 
			new RotatingCounterClockwise(this),
			new Accelerating(this),
			new AcceleratingRotatingClockwise(this),
			new AcceleratingRotatingCounterClockwise(this),
		];
		this.currentState = this.states[0];
		this.currentState.enter();
		this.x = 200;
		this.y = 200;
		this.vx = 0;
		this.vy = 0;
		this.acceleration = 0;
		this.ax = 0;
		this.ay = 0;
		this.velocity = 0;
		this.angle = 0;
		this.angularVelocity = 0;
		this.width = 95;
		this.height = 151;
		this.spaceshipSprites = spaceshipSprites;
		this.maxFrame = spaceshipSprites.length-1;
		this.fireImages = fireImages;
		this.frame = 0;

		this.scaleFire = 0.2;
		this.smoke = [];
		this.fps = 20;
		this.spaceshipTimer = 0;
		this.frameInterval = 1000/this.fps;
		this.frameDirection = 1;
		this.setState(0);

		//this.setHitbox();
		this.hitbox = new Rectangle(this.x, this.y, this.width, this.height, 0.5 * Math.PI);
	}

	setState(stateIndex){
		this.currentState = this.states[stateIndex];
		this.currentState.enter();
	}

	update(deltaTimestamp, input){
		//this.rect.rotateAroundCenter(Math.PI/2 + this.angle*Math.PI/180);
		this.currentState.handleInput(input.keys);
		this.currentState.update(this, deltaTimestamp);
		/*
		this.angle += this.angularVelocity;
		this.ax = this.acceleration * Math.cos(this.angle*Math.PI/180);
		this.ay = this.acceleration * Math.sin(this.angle*Math.PI/180);
		this.vx += this.ax;
		this.vy += this.ay;

		this.x += this.vx;
		this.y += this.vy;

		this.updateSmoke(deltaTimestamp);
		*/
		this.hitbox = new Rectangle(this.x, this.y, this.width, this.height, 0.5 * Math.PI + this.angle * Math.PI/180);

		this.setHitbox();
		if(this.spaceshipTimer > this.frameInterval){
			this.frame += this.frameDirection;
			if(this.frame <= 0)
				this.frame = 0;
			if(this.frame >= this.maxFrame)
				this.frame = this.maxFrame;
			this.spaceshipTimer = 0;
		}else{
			this.spaceshipTimer += deltaTimestamp;
		}


	}

	completelyTilted(direction){
		const tiltedRight = this.frame === this.maxFrame 
		const tiltedLeft = this.frame === 0;
		if(direction === "right" && tiltedRight)
			return true;

		if(direction === "left" && tiltedLeft)
			return true;

		return false;
	}

	draw(ctx){
		this.hitbox.draw(ctx);
		let frameWidth = this.spaceshipSprites[this.frame].width;
		let frameHeight = this.spaceshipSprites[this.frame].height;
		ctx.save();
		ctx.translate(this.x + frameWidth/2, this.y + frameHeight/2);
		ctx.rotate(Math.PI/2 + this.angle*Math.PI/180);
		ctx.drawImage(this.spaceshipSprites[this.frame], -frameWidth/2, -frameHeight/2);
		this.drawSmoke(ctx);
		ctx.restore();

		if(this.acceleration > 0)
			this.drawFire(ctx, frameWidth, frameHeight);

	}

	drawFire(ctx, frameWidth, frameHeight){
		ctx.save();
		ctx.translate(this.x + frameWidth/2, this.y + frameHeight/2);
		ctx.rotate(3 * Math.PI/2 + this.angle*Math.PI/180);
		//ctx.fillRect(this.fireImages.width/2, this.fireImages.height/2, this.fireImages.width, this.fireImages.height);
		let fireResizedWidth = this.fireImages.width * this.scaleFire;
		let fireResizedHeight = this.fireImages.height * this.scaleFire;
		ctx.drawImage(this.fireImages, -fireResizedWidth/2, -fireResizedHeight/2 - frameHeight/2, fireResizedWidth, fireResizedHeight);

		ctx.restore();

	}

	resizeScreen(){
		this.gameWidth = window.innerWidth;
		this.gameHeight = window.innerHeight;
	}

	setHitbox(){
		//this.hitbox = new Rectangle(this.x, this.y, this.width, this.height);
		/*
		this.hitbox = new Circle(
			new Point(this.x + this.width/2, this.y + this.height/2),
			75
		);
		*/

	}

	addSmoke(smoke){
		this.smoke.push(smoke);
	}

	updateSmoke(deltaTimestamp){
		this.smoke.forEach((smoke, index)=>{
			smoke.update(deltaTimestamp);
			if(smoke.markedForDeletion)
				this.smoke.splice(index, 1);
		});
	}

	drawSmoke(ctx){
		this.smoke.forEach(smoke=>{
			smoke.draw(ctx);
		});

	}
}
