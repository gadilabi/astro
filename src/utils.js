export function drawStatusText(ctx, input, player, color){
	ctx.font = '30px arial';
	ctx.fillStyle = color;
	let everyKey = "";
	input.keys.forEach((key)=>everyKey += `${key} `);
	ctx.fillText(`Keys pressed: ${everyKey}`, 10, 40);
	ctx.fillText(`Player state: ${player.currentState.state}`, 10, 70);

}

export function roundedRect(ctx, radiusArray, x, y, width, height, fillStyle, strokeStyle){
	ctx.beginPath()
	// top left corner
	ctx.arc(x + radiusArray[0], y + radiusArray[0], radiusArray[0], Math.PI, -0.5 * Math.PI);

	// top line
	ctx.lineTo(x + width - radiusArray[1], y);

	//ctx.moveTo(x + width - radiusArray[1], y + radiusArray[1] )
	// top right corner
	ctx.arc(x + width - radiusArray[1], y + radiusArray[1] , radiusArray[1], - 0.5 * Math.PI, 0);

	// Right line
	ctx.lineTo(x + width, y + height - radiusArray[2])
	
	// Bottom Right corner
	ctx.arc(x + width - radiusArray[2], y + height - radiusArray[2] , radiusArray[2], 0, 0.5 * Math.PI);

	// Bottom line
	ctx.lineTo(x + radiusArray[3], y + height);

	// Bottom left corner
	ctx.arc(x + radiusArray[3], y + height - radiusArray[3], radiusArray[3], 0.5 * Math.PI, Math.PI);

	// left line
	ctx.lineTo(x, y + radiusArray[0]);

	ctx.fillStyle = fillStyle;
	ctx.fill();

	ctx.strokeStyle = strokeStyle;
	ctx.stroke();


}
