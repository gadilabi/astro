import {Point, Circle} from './Geometry.js';

class Astroid {
	constructor(image, x, y){
		this.image = image;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.scaleImage = 0.25;
		this.width = this.image.width * this.scaleImage;
		this.height = this.image.height * this.scaleImage;

		this.hitbox = this.calcCircleHitbox(x, y, this.width, this.height);
	}

	draw(ctx){
		ctx.drawImage(this.image, this.x, this.y, this.image.width * this.scaleImage, this.image.height * this.scaleImage);
	}

	calcCircleHitbox(x, y, width, height){
		const radius = Math.max(width, height)/2;
		return new Circle(new Point(x + width/2, y + height/2), radius);
	}
}

export default class AstroidField{
	constructor(image, map){
		this.image = image;
		this.astroids = [];
		this.populateAstroids(map);
		this.msg = [];
	}

	update(player){
		this.astroids = this.astroids.filter((astroid)=>{
			if(astroid.hitbox.intersectWithRect(player.hitbox)){
				return false;
			}
			return true;

		});

		if(this.astroids.length === 0 && !this.msg.includes("GAME_OVER"))
			this.msg.push("GAME_OVER") ;


	}

	draw(ctx){
		this.astroids.forEach(astroid=>{
			astroid.draw(ctx);
			astroid.hitbox.draw(ctx);
		});
	}

	populateAstroids(map){
		map.forEach(astroid=>{
			this.astroids.push(new Astroid(this.image, astroid.x, astroid.y));
		});

	}

	readMsg(){
		const msg = this.msg;
		this.msg = [];
		return msg;
	}

}
