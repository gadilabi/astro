import Game from './Game.js';
import Spaceship from './Spaceship.js';
import AstroidField from './Astroid.js';
import InputHandler from './InputHandler.js';
import { drawStatusText, roundedRect } from './utils.js';
import Menu from './Menu.js';
import { FallingStar } from './Particles.js';
import { Point, Rectangle } from './Geometry.js';

window.addEventListener("load", (e)=>{
	const canvas = document.querySelector("#canvas");
	const ctx = canvas.getContext("2d");
	const input = new InputHandler();
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.textBaseline = 'bottom';
	const star = new FallingStar(200, 500, 0.1, 0.9);
	const astroidImage = document.querySelector("#astroid");
	const fireImages = document.querySelector("#fire");
	const menuFont = '50px sans-serif';
	const menuOptions = 
		[
			{
				text: "New Game",
				width: 0,
				height: 0,
			},
			{
				text: "Rules",
				width: 0,
				height: 0,
			},
		];
	const spaceshipImages = [];
	const playerSpriteNumber = 11;
	for(let i=0; i<playerSpriteNumber; i++){
		spaceshipImages.push(document.querySelector(`#player_${i+1}`));
	}

	const game = new Game(
		ctx,
		canvas.width,
		canvas.height,
		new Menu(ctx, menuOptions, menuFont),
		new Spaceship(spaceshipImages, fireImages),
	);

	window.addEventListener("resize", (e)=>{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		//spaceship.resizeScreen();
	});


	let lastTimestamp = 0;
	let deltaTimestamp = 0;
	function animate(timestamp){
		if(!timestamp)
			timestamp = 0;
		deltaTimestamp = timestamp - lastTimestamp;
		lastTimestamp = timestamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTimestamp, input);
		game.draw();

		drawStatusText(ctx, input, game.player, 'white');


		requestAnimationFrame(animate);
	}

	animate();

});
