export class Geometry{
	static pointInRect(point, rect){
		const origin = rect.bottomLeft();
		const axisHeight = Point.normalize(Point.subVectors([rect.topLeft(), origin]));
		const axisWidth = Point.normalize(Point.subVectors([rect.bottomRight(), origin]));

		const vector = Point.subVectors([point, origin]);
		const projectionHeight = Point.vecMulti(vector, axisHeight);
		const projectionWidth = Point.vecMulti(vector, axisWidth);

		const checkHeight = (projectionHeight > 0 && projectionHeight < rect.height) ? true : false;
		const checkWidth = (projectionWidth > 0 && projectionWidth < rect.width)? true : false;

		if(checkHeight && checkWidth)
			return true;
		else
			return false;
	}

	static toRad(angle){
		return angle * Math.PI/180;
	}
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

	rotate(origin, angle){
		let translated = Point.subVectors([this, origin]);
		let translatedRotatedX = translated.getX() * Math.cos(angle) - Math.sin(angle) * translated.getY();
		let translatedRotatedY = Math.sin(angle) * translated.getX() + Math.cos(angle) * translated.getY();

		let translatedRotatedPoint = new Point(translatedRotatedX, translatedRotatedY);

		let newPoint = Point.sumVectors([translatedRotatedPoint, origin]);
		this.x = newPoint.getX();
		this.y = newPoint.getY();
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
		ctx.fillStyle = "white";
		ctx.fill();
	}

    static sumVectors(vectors) {
        let x = 0;
        let y = 0;
        for (let vector of vectors) {
            x += vector.getX();
            y += vector.getY();

        }

        return new Point(x, y);

    }

    static subVectors(vectors) {
        let x = vectors[0].getX() - vectors[1].getX();
        let y = vectors[0].getY() - vectors[1].getY();
        return new Point(x, y);

    }

    static vecMulti(p1, p2) {
        let product = p1.getX() * p2.getX() + p1.getY() * p2.getY();

        return product;

    }

    static findNormal(vector) {
        let length = Point.length(vector);
        let x = -vector.getY() / length;
        let y = vector.getX() / length;
        let normal = new Point(x, y);

        return normal;

    }

    static reflectX(point) {
        let x = -point.getX();
        let y = point.getY();
        return new Point(x, y);
    }

    static reflectY(point) {
        let x = point.getX();
        let y = -point.getY();
        return new Point(x, y);
    }

    static scale(scalar, point) {
        let x = scalar * point.getX();
        let y = scalar * point.getY();

        return new Point(x, y);
    }

    static normalize(point) {

        let length = Math.pow((Math.pow(point.getX(), 2) + Math.pow(point.getY(), 2)), 0.5);
        let normalized = Point.scale(1 / length, point);

        return normalized;
    }

    static length(point) {
        let length = Math.pow((Math.pow(point.getX(), 2) + Math.pow(point.getY(), 2)), 0.5);
        return length;
    }

	static distance(point_1, point_2){
		const dx = point_1.getX() - point_2.getX();
		const dy = point_1.getY() - point_2.getY();
		return Math.sqrt(dx * dx + dy * dy);
	}

	static sqDistance(point_1, point_2){
		const dx = point_1.getX() - point_2.getX();
		const dy = point_1.getY() - point_2.getY();
		return (dx * dx + dy * dy);
	}

	distanceToLineSq(line){
		if(line.slope === null)
			return (line.point_1.getX() - this.getX()) * (line.point_1.getX() - this.getX());
		return (Math.pow(this.y - line.slope * this.x - line.intercept, 2) / (1 + Math.pow(line.slope, 2)));

	}

}

export class Circle {

    constructor(center, radius) {
		this.center = center;
		this.radius = radius;
    }

    getCenter() {
        return this.center;
    }

    getRadius() {
        return this.radius;
    }

    static distance(circle_1, circle_2) {
		return Point.distance(circle_1.getCenter(), circle_2.getCenter());
    }

    static detectCollision(circle_1, circle_2){
		if(this.distance(circle_1, circle_2) < (circle_1.getRadius() + circle_2.getRadius()))
			return true;

		return false;
    }

	draw(ctx) {
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.arc(this.center.getX(), this.center.getY(), this.radius, 0, 2 * Math.PI, true);
		ctx.stroke();

	}

	intersectWithLineSegment(line){


		// The ends of the segment are in the circle
		const distanceSqToEnds = Math.min(Point.sqDistance(line.point_1, this.center), Point.sqDistance(line.point_2, this.center));
		if(distanceSqToEnds < this.radius * this.radius){
			console.log("end inside");
			return true;
		}

		// The segment is a chord of the circle
		// which means distance to center is smaller the radius
		const distanceSq = this.center.distanceToLineSq(line);
		if(distanceSq < (this.radius * this.radius)){
			const origin = line.point_1;
			const axis = Point.normalize(Point.subVectors([line.point_2, origin]));
			const vector = Point.subVectors([this.center, origin]);
			const projection = Point.vecMulti(vector, axis);

			if(projection > 0 && (projection * projection) < Point.sqDistance(line.point_1, line.point_2)){
				console.log(line);
				console.log("projection is " + projection);
				console.log("shorter thean radius");
				return true;
			}
		}

		return false;
	}

	intersectWithRect(rect){
		if(Geometry.pointInRect(this.center, rect))
			return true;

		const sides = rect.getSides();
		for(let side of Object.values(sides)){
			if(this.intersectWithLineSegment(side)){
				console.log(sides);
				return true;
			}
		}

		return false;
	}
}

export class Rectangle{
	constructor(x, y, width, height, rotationAngle){
		this.vertices = 
			[
				new Point(x, y),
				new Point(x + width, y),
				new Point(x + width, y + height),
				new Point(x, y + height),
			];
		this.width = width;
		this.height = height;
		this.rotationAngle = rotationAngle;
		this.rotateAroundCenter(rotationAngle);
	}

	topLeft(){
		return this.vertices[0];
	}

	topRight(){
		return this.vertices[1];
	}

	bottomRight(){
		return this.vertices[2];
	}

	bottomLeft(){
		return this.vertices[3];
	}

	getSides(){
		const top = new Line(this.topLeft(), this.topRight());
		const right = new Line(this.topRight(), this.bottomRight());
		const bottom = new Line(this.bottomRight(), this.bottomLeft());
		const left = new Line(this.bottomLeft(), this.topLeft());
		return {top, right, bottom, left};
	}

	rotate(origin, angle){
		this.vertices.forEach((vertex)=>{
			vertex.rotate(origin, angle);
		});
	}

	rotateAroundCenter(angle){
		const topLeft = this.topLeft();
		const bottomRight = this.bottomRight();
		const sum = Point.sumVectors([topLeft, bottomRight]);
		const center = Point.scale(0.5, sum);

		this.rotate(center, angle);
	}

	draw(ctx){
		ctx.beginPath();
		ctx.moveTo(this.topLeft().getX(), this.topLeft().getY())
		ctx.lineTo(this.topRight().getX(), this.topRight().getY());
		ctx.lineTo(this.bottomRight().getX(), this.bottomRight().getY())
		ctx.lineTo(this.bottomLeft().getX(), this.bottomLeft().getY())
		ctx.closePath();
		ctx.strokeStyle = "white";
		ctx.stroke();
	}


}

class Line {
	constructor(point_1, point_2){
		this.point_1 = point_1;
		this.point_2 = point_2;
		this.slope = this.calcSlope(point_1, point_2);
		this.intercept = this.calcIntercept(point_1, this.slope);

	}

	calcSlope(point_1, point_2){
		const dy = point_2.getY() - point_1.getY();
		const dx = point_2.getX() - point_1.getX();

		if(dx === 0)
			return null;

		return (dy/dx);
	}

	calcIntercept(point, slope){
		if(slope === null)
			return null;
		return point.getY() - slope * point.getX();
	}

	normal(point){
		let normalSlope;
		if(this.slope === 0){
			return new Line(point, new Point())

		}
		const slope = -1/this.slope;

	}

	static linesIntersection(line_1, line_2){
		if(line_1.slope === line_2.slope)
			return null;
		const intersectionX = (line_1.intercept - line_2.intercept) / (line_2.slope - line_1.slope);
		const intersectionY = line_1.slope * intersectionX + line_1.intercept;

		return new Point(intersectionX, intersectionY);
	}
}
