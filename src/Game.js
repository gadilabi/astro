import {MenuState, PlayingState, GameOverState} from './GameStates.js';
import AstroidField from './Astroid.js';
import Spaceship from './Spaceship.js';
import {Background} from './Background.js';
import { Header } from './Header.js';
import { Geometry } from './Geometry.js';

export default class Game {
	constructor(ctx, width, height, menu, player, astroidField){
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.menu = menu;
		this.player = player;
		this.header = new Header(this);
		this.background = new Background(this);
		this.astroidField = this.createMap();
		this.states = [new MenuState(this), new PlayingState(this), new GameOverState(this)];
		this.currentState = this.states[0];
		this.started = false;
		this.gameOver = false;

		this.timer = 0;
	}

	update(deltaTimestamp, input){
		switch(this.currentState.state){
			case "MENU":
				const menuMsg = this.menu.readMsg();
				this.currentState.handleInput(input, menuMsg);
				this.header.update(deltaTimestamp);
				break;
			case "PLAYING":
				this.timer += deltaTimestamp;
				this.player.update(deltaTimestamp, input);
				this.astroidField.update(this.player);
				//this.background.update(deltaTimestamp);
				const msg = (this.astroidField.readMsg()[0]) || "no msg";
				this.currentState.handleInput(input, msg);
				break;
			case "GAME_OVER":
				console.log("game over");
				this.currentState.handleInput(input);
				//this.restart();
				break;

		}
	}

	draw(){
		switch(this.currentState.state){
			case "MENU":
				this.menu.draw(this.ctx);
				this.header.draw(this.ctx);
				break;
			case "PLAYING":
				this.drawTimer(this.timer);
				//this.background.draw(this.ctx);
				this.player.draw(this.ctx);
				this.astroidField.draw(this.ctx);
				break;
			case "GAME_OVER":
				this.drawTable();
				break;

		}
	}

	createMap(){
		let map = [];
		let astroidNumber = 18;
		let angle = Geometry.toRad(0);
		while(map.length < astroidNumber){
			const x = Math.abs(Math.sin(Geometry.toRad(90) + angle) * (this.width - 500)) + 250;
			const y = Math.abs(Math.sin(1.5 * angle) * (this.height - 500)) + 250;
			map.push({x, y});
			angle += Geometry.toRad(20);
		}
		console.log(map);
		return new AstroidField(astroid, map);
	}

	drawTable(){
		this.ctx.font = "40px sans-serif";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "center";
		this.ctx.fillText("Game Over", this.width/2, this.height/2);
		this.ctx.fillText("Press Enter to continue", this.width/2, this.height/2 + 60);
		this.ctx.fill();
	}

	setState(state){
		this.currentState = this.states[state];
		this.currentState.enter();
	}

	drawTimer(time){
		const timeInSeconds = Math.floor(time / 1000);
		const seconds = timeInSeconds % 60;
		const minutes = Math.floor(timeInSeconds / 60);
		let secondsText = "";
		let minutesText = "";
		this.ctx.fontStyle = "30px Impact";

		if(seconds < 10)
			secondsText = `0${seconds}`;
		else
			secondsText = `${seconds}`;

		if(minutes < 10)
			minutesText = `0${minutes}`;
		else
			minutesText = `${minutes}`;

		const clock = `${minutesText}:${secondsText}`;

		this.ctx.fillText(clock, 600, 50);
	}

	createRandomAstoridMap(astroidNumber){
		let map = [];
		for(let i = 0; i < astroidNumber; i++){
			const x = Math.random() * this.width;
			const y = Math.random() * this.height;
			map.push({x, y});
		}
		return new AstroidField(astroid, map);
	}

	restart(){
		this.astroidField = this.createMap();
		this.currentState = this.states[0];
		this.timer = 0;
		this.player = new Spaceship(this.player.spaceshipSprites, this.player.fireImages);
	}

}
