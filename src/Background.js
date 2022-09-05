export class Background {
	constructor(game){
		this.game = game;
		this.lastTimestamp = 0;
		this.frameTimer = 0;
		this.fps = 20;
		this.frameInterval = 1000/this.fps;
		this.cellSize = 30;
		this.lineWidth = 0.1;
		this.createGradient(this.game.ctx);
		this.strokeStyle = this.gradient;
		this.radius = 0;
		this.vr = 0.03;
	}

	createGradient(ctx){
		this.gradient = ctx.createLinearGradient(0, 0, this.game.width, this.game.height);
		this.gradient.addColorStop("0.1", "#ff5c33");
		this.gradient.addColorStop("0.9", "#ffff33");
	}

	update(deltaTimestamp){
		if(this.frameTimer > this.frameInterval){
			this.radius += this.vr;
			this.keepRadiusInBounds();
			this.frameTimer = 0;
		}else{
			this.frameTimer += deltaTimestamp;
		}
	}

	draw(ctx){
		ctx.save();
		this.setContextValues(ctx);
		for(let y=0; y<this.game.height; y+=this.cellSize){
			for(let x=0; x<this.game.width; x+=this.cellSize){
				const angle = (Math.cos(x*0.01) + Math.sin(y*0.01)) * this.radius;
				this.drawLine(angle, x, y);
			}
		}
		ctx.restore();
	}

	drawLine(angle, x, y){
		const amplitude = 20;
		this.game.ctx.beginPath();
		this.game.ctx.moveTo(x,y);
		this.game.ctx.lineTo(x + Math.cos(angle)*amplitude, y + Math.sin(angle)*amplitude);
		this.game.ctx.stroke();

	}

	keepRadiusInBounds(){
		const outOfBounds = this.radius > 5 || this.radius < -5;
		if(outOfBounds)
			this.vr *= -1;
	}

	setContextValues(ctx){
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = this.gradient;
	}


}
