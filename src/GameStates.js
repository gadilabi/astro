const gameStates = {
	MENU: 0,
	PLAYING: 1,
	GAME_OVER: 2,
};

class GameStates {
	constructor(state){
		this.state = state;
	}
}

export class MenuState extends GameStates{
	constructor(game){
		super("MENU");
		this.game = game;
	}

	enter(){
		//this.game.menu.show();
	}

	handleInput(input, menuMsg){
		if(menuMsg === "New Game")
			this.game.setState(gameStates.PLAYING);
	}
}

export class PlayingState extends GameStates{
	constructor(game){
		super("PLAYING");
		this.game = game;
	}

	enter(){
	}

	handleInput(input, msg){
		if(msg === "GAME_OVER")
			this.game.setState(gameStates.GAME_OVER);
		
	}
}

export class GameOverState extends GameStates{
	constructor(game){
		super("GAME_OVER");
		this.game = game;
	}

	enter(){
	}

	handleInput(input){
		console.log(input);
		//this.game.setState(gameStates.MENU);
		if(input.keys.includes("Enter")){
			console.log("restarted");
			this.game.restart();
		}
	}
}
