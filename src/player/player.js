import { ny, nx, width, colorPalette } from '../globals/globals';
import { lerp, lerpColorHex, rgbToHex, rotatePoint, circle } from '../utils/utils';

export default class Player {

    constructor(x, y, radius, theta) {

        this.x = x || nx(50);
        this.y = y || ny(50);
        this.size = radius || ny(1.5);
        this.diameter = this.size * 2;
        this.vx = 0;
        this.vy = 0;
        this.theta = theta || 0;
        this.speedDelta = ny(0.0135);
        this.thetaDelta = ny(0.0145);

        this.rightPressed = false;
        this.leftPressed = false;
        this.upPressed = false;
        this.downPressed = false;

        this.bubble = false;
        this.bubblePoppedTime = 0
        this.bubblePopped = false;

    }

    draw(ctx, time) {

        // draw circle
        ctx.fillStyle = colorPalette.goldFishTwo;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    
        // draw tail
        const side = this.size * 1.5;
        const h = side * Math.sqrt(3) / 2;
    
        const points = [
            [this.x, this.y + this.size / 2],
            [this.x - side / 2, this.y + h + this.size / 2],
            [this.x + side / 2, this.y + h + this.size / 2],
            [this.x, this.y + this.size / 2]
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
    
        ctx.closePath();
        ctx.fill(); 

        if(this.bubble) {

            if(this.bubblePopped) {
                const color = rgbToHex(lerpColorHex(0.5 + 0.5 * Math.sin(time / 50), ['#FFFFFF', colorPalette.blueTwo]));
                ctx.lineWidth = 2;
                circle(ctx, this.x, this.y, this.size * 1.15, null, true, color);
                circle(ctx, this.x, this.y, this.size * 1.1, null, true, color, 0, Math.PI / 8);
                if(time > this.bubblePoppedTime + 2500) {
                    this.bubble = false;
                    this.bubblePopped = false;
                }
            } else {
                circle(ctx, this.x, this.y, this.size * 1.15, null, true, '#FFFFFF');
                circle(ctx, this.x, this.y, this.size * 1.1, null, true, '#FFFFFF', 0, Math.PI / 8);                
            }

        }
            
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
        if(this.x >= width + this.size) {
            this.x = -this.size;
        } else if(this.x <= -this.size) {
            this.x = width + this.size;
        }
    
        // flip momentum for bounce effect on bottom and top of screen
        if(this.y >= ny(100) - this.size) {
            this.y = ny(100) - this.size;
            this.vy = -0.33 * this.vy;
        } else if(this.y <= ny(0) + this.size) {
            this.y = ny(0) + this.size;
            this.vy = -0.33 * this.vy;
        }
    
    }

    render(ctx, time) {
        this.reposition();
        this.draw(ctx, time);
    }

}