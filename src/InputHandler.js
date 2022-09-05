export default class InputHandler {
	constructor(){
		this.lastKey = "";
		this.legalKeys = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Enter'];
		this.keys = [];

		window.addEventListener("keydown", (e)=>{
			let isKeyLegit = (this.legalKeys.indexOf(e.key)) === -1 ? false : true;
			let isKeyPressed = (this.keys.indexOf(e.key)) === -1 ? false : true;
			if(isKeyLegit && !isKeyPressed){
				this.keys.push(e.key);
				this.lastKey = e.key;
			}
		});

		window.addEventListener("keyup", (e)=>{
			this.lastKey = "";
			this.keys = this.keys.filter((key)=> e.key !== key);

		});
	}

	isPressed(key){
		let isKeyPressed = (this.keys.indexOf(key)) === -1 ? false : true

		return isKeyPressed;
	}

}
