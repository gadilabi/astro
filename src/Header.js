import { MeteorShower, Orbiter } from './Particles.js';

export class Header {
	constructor(game){
		this.game = game;
		this.text = "Astro";
		this.fontFamily = "sans-serif";
		this.fontSize = "150";
		this.align = "center";
		this.fillColor = "rgba(255,255,255, 0.3)";
		this.strokeColor = "white";
		this.x = this.game.width / 2;
		this.y = 200;
		this.width = this.getWidth();
		this.height = 150;
		//this.shower = new MeteorShower(1, this.x - this.width/2, this.y - this.height, this.width, this.height);
		this.orbiter = new Orbiter(this.x, this.y - this.height/2, this.height/2, 1, 0, 20, "");
	}

	update(deltaTimestamp){
		//this.shower.update(deltaTimestamp);
		this.orbiter.update();
	}

	draw(ctx){
		//this.shower.draw(ctx);
		this.orbiter.draw(ctx);
		ctx.save();
		ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.strokeColor;
		ctx.textAlign = this.align;
		ctx.fillText(`${this.text}`, this.x, this.y);
		ctx.strokeText(`${this.text}`, this.x, this.y);
		ctx.restore();
	}

	getWidth(){
		this.game.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		this.game.ctx.fillStyle = this.fillColor;
		this.game.ctx.strokeStyle = this.strokeColor;
		return this.game.ctx.measureText(this.text).width;
	}


}
