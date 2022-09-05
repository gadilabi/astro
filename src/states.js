import { Smoke } from './Particles.js';
import { Rectangle } from './Geometry.js';

export const states = {
	DRIFTING: 0,
	ROTATING_CLOCKWISE: 1,
	ROTATING_COUNTER_CLOCKWISE: 2,
	ACCELERATING: 3,
	ACCELERATING_ROTATING_CLOCKWISE: 4,
	ACCELERATING_ROTATING_COUNTER_CLOCKWISE: 5,
};

class State {
	constructor(state){
		this.state = state;
	}

	update(player, deltaTimestamp){
		player.angle += player.angularVelocity;
		player.ax = player.acceleration * Math.cos(player.angle*Math.PI/180);
		player.ay = player.acceleration * Math.sin(player.angle*Math.PI/180);
		player.vx += player.ax;
		player.vy += player.ay;

		player.x += player.vx;
		player.y += player.vy;

		player.updateSmoke(deltaTimestamp);
	}
}

export class RotatingClockwise extends State {
	constructor(player){
		super("ROTATING_CLOCKWISE");
		this.player = player;
	}

	enter(){
		this.player.acceleration = 0;
		if(!this.player.completelyTilted("right"))
			this.player.frameDirection = 1;
		this.player.angularVelocity = 1;
	}

	update(player, deltaTimestamp){
		super.update(player, deltaTimestamp);
	}


	handleInput(input){
		const right = input.includes("ArrowRight");
		const left = input.includes("ArrowLeft");
		const up = input.includes("ArrowUp");
		const down = input.includes("ArrowDown");

		if(up && right){
			this.player.setState(states.ACCELERATING_ROTATING_CLOCKWISE);
			return;
		}

		if(left && !up)
			this.player.setState(states.ROTATING_COUNTER_CLOCKWISE);
		if(input.length === 0)
			this.player.setState(states.DRIFTING);

	}
}

export class RotatingCounterClockwise extends State {
	constructor(player){
		super("ROTATING_COUNTER_CLOCKWISE");
		this.player = player;
	}

	enter(){
		this.player.acceleration = 0;
		if(!this.player.completelyTilted("left"))
			this.player.frameDirection = -1;
		this.player.angularVelocity = -1;
	}

	handleInput(input){
		const right = input.includes("ArrowRight");
		const left = input.includes("ArrowLeft");
		const up = input.includes("ArrowUp");
		const down = input.includes("ArrowDown");

		if(up && left){
			this.player.setState(states.ACCELERATING_ROTATING_COUNTER_CLOCKWISE);
			return;
		}
		if(right && !up)
			this.player.setState(states.ROTATING_CLOCKWISE);
		if(left && !up)
			this.player.setState(states.ROTATING_COUNTER_CLOCKWISE);
		if(input.length === 0)
			this.player.setState(states.DRIFTING);
	}
}

export class Accelerating extends State {
	constructor(player){
		super("ACCELERATING");
		this.player = player;
		this.maxSmoke = 3;
	}

	enter(){
		this.player.angularVelocity = 0;
		this.player.frameDirection = 0;
		this.player.acceleration = 0.01;
	}

	handleInput(input){
		if(this.player.smoke.length <= this.maxSmoke){
			this.player.addSmoke(new Smoke(0, 0.5 * this.player.height + this.player.fireImages.height * this.player.scaleFire-20, Math.random() * 5, Math.random()*5));
		}

		const right = input.includes("ArrowRight");
		const left = input.includes("ArrowLeft");
		const up = input.includes("ArrowUp");
		const down = input.includes("ArrowDown");

		if(up && left){
			this.player.setState(states.ACCELERATING_ROTATING_COUNTER_CLOCKWISE);
			return;
		}
		if(up && right){
			this.player.setState(states.ACCELERATING_ROTATING_CLOCKWISE);
			return;
		}
		if(right && !up)
			this.player.setState(states.ROTATING_CLOCKWISE);
		if(left && !up)
			this.player.setState(states.ROTATING_COUNTER_CLOCKWISE);
		if(input.length === 0)
			this.player.setState(states.DRIFTING);

	}
}

export class Drifting extends State {
	constructor(player){
		super("DRIFTING");
		this.player = player;
	}

	enter(){
		this.player.acceleration = 0;
		this.player.frameDirection = 0;
		this.player.angularVelocity = 0;
	}

	handleInput(input){
		const right = input.includes("ArrowRight");
		const left = input.includes("ArrowLeft");
		const up = input.includes("ArrowUp");
		const down = input.includes("ArrowDown");

		if(up)
			this.player.setState(states.ACCELERATING);
		if(right)
			this.player.setState(states.ROTATING_CLOCKWISE);
		if(left)
			this.player.setState(states.ROTATING_COUNTER_CLOCKWISE);

	}
}

export class AcceleratingRotatingClockwise extends State {
	constructor(player){
		super("ACCELERATING_ROTATING");
		this.player = player;
	}

	enter(){
		this.player.acceleration = 0.01;
		this.player.angularVelocity = 1;
		this.player.frameDirection = 1;
	}

	handleInput(input){
		const right = input.includes("ArrowRight");
		const left = input.includes("ArrowLeft");
		const up = input.includes("ArrowUp");
		const down = input.includes("ArrowDown");
		if(up && left){
			this.player.setState(states.ACCELERATING_ROTATING_COUNTER_CLOCKWISE);
			return;
		}

		if(up && !(right || left))
			this.player.setState(states.ACCELERATING);
		if(right && !up)
			this.player.setState(states.ROTATING_CLOCKWISE);
		if(left && !up)
			this.player.setState(states.ROTATING_COUNTER_CLOCKWISE);
		if(input.length === 0)
			this.player.setState(states.DRIFTING);

	}

}

export class AcceleratingRotatingCounterClockwise extends State{
	constructor(player){
		super("ACCELERATING_ROTATING");
		this.player = player;
	}

	enter(){
		this.player.acceleration = 0.01;
		this.player.angularVelocity = -1;
		this.player.frameDirection = -1;
	}

	handleInput(input){
		const right = input.includes("ArrowRight");
		const left = input.includes("ArrowLeft");
		const up = input.includes("ArrowUp");
		const down = input.includes("ArrowDown");
		if(up && right){
			this.player.setState(states.ACCELERATING_ROTATING_CLOCKWISE);
			return;
		}

		if(up && !(right || left))
			this.player.setState(states.ACCELERATING);
		if(left && !up)
			this.player.setState(states.ROTATING_COUNTER_CLOCKWISE);
		if(right && !up)
			this.player.setState(states.ROTATING_CLOCKWISE);
		if(input.length === 0)
			this.player.setState(states.DRIFTING);

	}

}
