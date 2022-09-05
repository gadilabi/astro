import { roundedRect } from './utils.js';

export default class Menu {
	constructor(ctx, options, font){
		this.ctx = ctx;
		this.options = options;
		this.font = font;
		this.margin = {
			horizontalMargin: 20,
			verticalMargin: 40,
		};

		this.measureOptions();

		this.width = 0;
		this.height = 0;
		this.setWidthAndHeight(options, this.font);
		this.x = 0;
		this.y = 0;
		this.setBackgroundCoordinates();
		this.setOptionsCoordinates();

		this.show = true;

		this.msg = "";
		canvas.addEventListener("click", e=>{
			this.click(e.x, e.y);
		});

	}

	readMsg(){
		const msg= this.msg;
		this.msg = "";

		return msg;
	}

	update(){
	}

	draw(ctx){
		ctx.textAlign = "left";
		// Draw the menu area
		roundedRect(ctx, [30,30,30,30], this.x, this.y, this.width, this.height, "rgba(255,255,255, 0.3)", "white");
		//this.ctx.fillRect(this.x, this.y, this.width, this.height);

		// Set the font for menu
		this.ctx.font = this.font;
		this.ctx.fillStyle = "black";

		this.options.forEach((option, index)=>{
			ctx.fillText(option.text, option.x, option.y);
		});
	}

	click(canvasX, canvasY){
		this.options.forEach((option)=>{
			const inBoundX = canvasX > option.x && canvasX < (option.x + option.width);
			const inBoundY = canvasY < option.y && canvasY > (option.y - option.height);

			console.log("ed");
			if(inBoundX && inBoundY && this.show){
				this.msg = option.text;
			} 
		});
	}

	measureOptions(){
		this.ctx.font = this.font;
		this.options.forEach((option)=>{
			const metric = this.ctx.measureText(option.text);
			option.width = metric.width;
			option.height = metric.fontBoundingBoxAscent + metric.fontBoundingBoxDescent;
		});


	}

	setWidthAndHeight(options, font){
		this.ctx.font = this.font;
		const width = options.reduce((acc, curr)=>{
			return Math.max(acc, this.ctx.measureText(curr).width);
		}, 0) + 2 * this.margin.horizontalMargin;

		this.width = width;

		const height = options.reduce((acc, curr)=>{
			return acc + curr.height
		}, 0) + this.options.length * this.margin.verticalMargin;

		this.height = height;

	}

	setBackgroundCoordinates(){
		this.x = window.innerWidth/2 - this.width/2;
		this.y = window.innerHeight/2 - this.height/2;
	}

	setOptionsCoordinates(){
		this.options.forEach((option, index)=>{
			const x = this.x + (this.width - option.width)/2 ;
			const y = this.y + (index + 1) * option.height + this.margin.verticalMargin;
			option.x = x;
			option.y = y;
		});

	}
}
