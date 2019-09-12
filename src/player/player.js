import { ny, nx, height, width, colorPalette } from '../globals/globals';
import { lerp, rotatePoint } from '../utils/utils';

export default class Player {

    constructor(x, y, radius, theta) {

        this.x = x || nx(50);
        this.y = y || ny(50);
        this.radius = radius || ny(1.5);
        this.diameter = this.radius * 2;
        this.vx = 0;
        this.vy = 0;
        this.theta = theta || 0;
        this.speedDelta = ny(0.0135);
        this.thetaDelta = ny(0.0145);

        this.rightPressed = false;
        this.leftPressed = false;
        this.upPressed = false;
        this.downPressed = false;

    }

    draw(ctx) {

        // draw circle
        ctx.fillStyle = colorPalette.goldFishTwo;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    
        // draw tail
        const side = this.radius * 1.5;
        const h = side * Math.sqrt(3) / 2;
    
        const points = [
            [this.x, this.y + this.radius / 2],
            [this.x - side / 2, this.y + h + this.radius / 2],
            [this.x + side / 2, this.y + h + this.radius / 2],
            [this.x, this.y + this.radius / 2]
        ];
    
        ctx.beginPath();
    
        points.map((point, i) => {
            const rotatedPoint = rotatePoint(point[0], point[1], this.x, this.y, this.theta);
            if(i === 0) {
                ctx.moveTo(rotatedPoint.x, rotatedPoint.y);
            } else {
                ctx.lineTo(rotatedPoint.x, rotatedPoint.y);
            }
        });
    
        ctx.fill(); 
        ctx.closePath();
        ctx.save();
            
    }

    reposition() {

        if(this.leftPressed){
            this.vx -= this.speedDelta; 
            if(this.theta > Math.PI / 2) {
                this.theta = lerp(this.theta, 3 * Math.PI / 2, this.thetaDelta)
            } else if(this.theta <= Math.PI / 2) {
                this.theta = lerp(this.theta, - Math.PI / 2, this.thetaDelta)
            } else {
    
            }
        };
        if(this.upPressed){
            this.vy -= this.speedDelta;
            if(this.theta < Math.PI && this.theta >= 0) {
                this.theta = lerp(this.theta, 0, this.thetaDelta);
            } else {
                this.theta = lerp(this.theta, 2 * Math.PI, this.thetaDelta);
            }
        };
        if(this.rightPressed){
            this.vx += this.speedDelta;
            if(this.theta < 3 * Math.PI / 2 && this.theta >= Math.PI / 2) {
                this.theta = lerp(this.theta, Math.PI / 2, this.thetaDelta);
            } else if(this.theta >= 3 * Math.PI / 2) {
                this.theta = lerp(this.theta, 5 * Math.PI / 2, this.thetaDelta);
            } else {
                this.theta = lerp(this.theta, Math.PI / 2, this.thetaDelta);
            }
        };
        if(this.downPressed){
            this.vy += this.speedDelta;
            this.theta = lerp(this.theta, Math.PI, this.thetaDelta);
        };
    
        // cap rotation at [0, 2PI);
        if(this.theta > 2 * Math.PI){
            this.theta = this.theta - 2 * Math.PI;
        } else if(this.theta < 0) {
            this.theta = 2 * this.theta + 2 * Math.PI;
        }
    
        this.x += this.vx;
        this.y += this.vy;
    
        // flip to other side of screen if necessary
        if(this.x >= width + this.radius) {
            this.x = -this.radius;
        } else if(this.x <= -this.radius) {
            this.x = width + this.radius;
        }
    
        if(this.y >= height + this.radius) {
            this.y = -this.radius;
        } else if(this.y <= -this.radius) {
            this.y = height + this.radius;
        }
    
    }

    render(ctx) {
        this.reposition();
        this.draw(ctx);
    }

}