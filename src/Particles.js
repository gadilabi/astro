class Particle{
	constructor(){
		//this.game = game;
	}

}

export class Smoke extends Particle{
	constructor(x, y, vx, vy){
		super();
		this.size = 5;
		this.shrink = 0.5;
		this.minSize = 1;
		this.fade = 0.01;
		this.minAlpha = 0.05;
		this.alpha = 0.1;
		this.markedForDeletion = false;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.frameTimer = 0;
		this.fps = 20;
		this.frameInterval = 1000 / this.fps;
	}

	update(deltaTimestamp){
		if(this.frameTimer > this.frameInterval){
			this.size -= this.shrink;
			this.alpha -= this.fade;
			this.x += this.vx;
			this.y += this.vy;
			this.frameTimer = 0;
			if(this.size <= this.minSize || this.alpha < this.minAlpha)
				this.markedForDeletion = true;
		}else{
			this.frameTimer += deltaTimestamp;
		}
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
		ctx.fill();
	}

}

export class Commet extends Particle{
	constructor(x, y, vx, vy, movement){
		super();
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.movement = movement;
		this.starFillColor = "white";
		this.starStrokeColor = "white";
		this.tailFillColor = "rgba(255,255,255,0.5)";
		this.tailStrokeColor = "white";
		this.tailLength = 40;
		this.angle = 10 * (Math.PI/180);
		this.radius = 5;
		this.rotationAngle = this.calcRotationAngle();
	}

	update(deltaTimestamp){
	}

	draw(ctx){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotationAngle);
		// Draw the tail
		ctx.fillStyle = this.tailFillColor;
		ctx.strokeStyle = this.tailStrokeColor;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(- this.tailLength * Math.sin(this.angle), this.tailLength);
		ctx.moveTo(0, 0);
		ctx.lineTo(this.tailLength * Math.sin(this.angle), this.tailLength);
		ctx.lineTo(- 1 * this.tailLength * Math.sin(this.angle), this.tailLength);
		//ctx.closePath();
		ctx.fill();

		// Draw the star
		ctx.fillStyle = this.starFillColor;
		ctx.strokeStyle = this.starStrokeColor;
		ctx.beginPath();

		ctx.arc(0, this.tailLength, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}

	calcRotationAngle(){
		if(this.vx > 0)
			return Math.atan(this.vy/this.vx) - 0.5 * Math.PI;
		else
			return Math.PI/2 - Math.atan(-this.vy/this.vx);
	}
	 
	reset(x, y, vx, vy){
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.tailLength = 40;
		this.rotationAngle = this.calcRotationAngle();
	}
}

export class FallingStar extends Particle{
	constructor(x, y, vx, vy){
		super();
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.starFillColor = "white";
		this.starStrokeColor = "white";
		this.tailFillColor = "rgba(255,255,255,0.5)";
		this.tailStrokeColor = "white";
		this.tailLength = 40;
		this.angle = 10 * (Math.PI/180);
		this.radius = 5;
		this.rotationAngle = this.calcRotationAngle();
	}

	update(deltaTimestamp){
		this.x += this.vx;
		this.y += this.vy;
		//this.tailLength += 1;

	}

	draw(ctx){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotationAngle);
		// Draw the tail
		ctx.fillStyle = this.tailFillColor;
		ctx.strokeStyle = this.tailStrokeColor;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(- this.tailLength * Math.sin(this.angle), this.tailLength);
		ctx.moveTo(0, 0);
		ctx.lineTo(this.tailLength * Math.sin(this.angle), this.tailLength);
		ctx.lineTo(- 1 * this.tailLength * Math.sin(this.angle), this.tailLength);
		//ctx.closePath();
		ctx.fill();

		// Draw the star
		ctx.fillStyle = this.starFillColor;
		ctx.strokeStyle = this.starStrokeColor;
		ctx.beginPath();

		ctx.arc(0, this.tailLength, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}

	calcRotationAngle(){
		if(this.vx > 0)
			return Math.atan(this.vy/this.vx) - 0.5 * Math.PI;
		else
			return Math.PI/2 - Math.atan(-this.vy/this.vx);
	}
	 
	reset(x, y, vx, vy){
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.tailLength = 40;
		this.rotationAngle = this.calcRotationAngle();
	}
}

export class MeteorShower{
	/*
	 * numberOfStars: the number of particles we will animate
	 * x, y, width, height: The dimensions of the  
	 * rectangle to which the shower is limited.
	 *
	*/
	constructor(numberOfStars, x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.numberOfStars = numberOfStars;
		this.stars = [];
		this.createStars(numberOfStars);
		console.log(x, y, width, height);
		console.log(this.stars);
	}

	update(deltaTimestamp){
		this.stars.forEach(star=>{
			star.update(deltaTimestamp);
			const inBoundsX = star.x < this.x + this.width && star.x > this.x;
			const inBoundsY = !(star.y > this.y + this.height);
			if(!inBoundsX || !inBoundsY)
				this.reInitializeStar(star)
		});
	}

	draw(ctx){
		this.stars.forEach((star)=>{
			star.draw(ctx);
		});
	}

	createStars(number){
		for(let i=0; i<number; i++){
			const x = this.x + Math.random()*this.width;
			const y = this.y + 10;
			const vx = Math.random()*1 + 1;
			const vy = 1;
			this.stars.push(new FallingStar(x, y, vx, vy));
		}
	}

	reInitializeStar(star){
		const x = this.x + Math.random()*this.width;
		const y = this.y + 10;
		const vx = Math.random() * 8 - 4;
		const vy = Math.random() * 4;
		star.reset(x, y, vx, vy);
	}

}

export class Orbiter extends Particle{
	constructor(centerX, centerY, orbitRadius, angularVelocity, startingAngle, particleRadius, shape){
		super();
		this.centerX = centerX;
		this.centerY = centerY;
		this.orbitRadius = orbitRadius;
		this.angularVelocity = angularVelocity;
		this.angle = startingAngle;
		this.particleRadius = particleRadius;
		this.shape = shape;
	}

	update(){
		this.angle += this.angularVelocity * Math.PI/180;
	}

	draw(ctx){
		ctx.save();
		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(this.angle);
		this.drawShape(ctx);
		ctx.fill();
		ctx.restore();
	}

	drawShape(ctx){
		switch(this.shape){
			case "commet":
				ctx.save();
				ctx.translate(this.centerX + this.orbitRadius, 0);
				// Draw the tail
				ctx.fillStyle = this.tailFillColor;
				ctx.strokeStyle = this.tailStrokeColor;
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(- this.tailLength * Math.sin(this.angle), this.tailLength);
				ctx.moveTo(0, 0);
				ctx.lineTo(this.tailLength * Math.sin(this.angle), this.tailLength);
				ctx.lineTo(- 1 * this.tailLength * Math.sin(this.angle), this.tailLength);
				//ctx.closePath();

				// Draw the star
				ctx.fillStyle = this.starFillColor;
				ctx.strokeStyle = this.starStrokeColor;
				ctx.beginPath();

				ctx.arc(0, this.tailLength, this.radius, 0, 2 * Math.PI);
				ctx.restore();
				break;
			default:
				ctx.beginPath();
				ctx.arc(this.orbitRadius, 0, this.particleRadius, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fillStyle = "white";
				break;


		}
	}



}
