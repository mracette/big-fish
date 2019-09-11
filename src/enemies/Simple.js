import { lerpColorHex, rotatePoint, hexToRgb, rgbToHex, cividis } from '../utils/utils';
import { nx, ny, colorPalette } from '../globals/globals'; 

export function generateSimpleParams() {

    const minSize = ny(1);
    const maxSize = ny(7);
    const size = minSize + ny(6) * Math.random();
    const cycleTime = 30 + size;
    const speed = nx(0.05) - size / 100 + Math.random() * nx(0.075);
    const direction = Math.random() >= .5 ? 'left' : 'right';
    const x = direction === 'right' ? - size : nx(100) + size;
    const y = Math.random() * ny(100);

    // colors come from the size and the array in the colorpalette object
    // const colorOne = hexToRgb(colorPalette.simpleFish[0]);
    // const colorTwo = hexToRgb(colorPalette.simpleFish[1]);
    const lerpAmount = (size - minSize) / (maxSize - minSize);
    console.log(lerpAmount);
    
    const color = rgbToHex(lerpColorHex(lerpAmount, colorPalette.testing));// cividis(1 - lerpAmount);// rgbToHex(lerpColor(colorOne, colorTwo, lerpAmount));

    console.log(color);

    return { size, cycleTime, speed, x, y, direction, color};

}

export class Simple {

    constructor(size, cycleTime, speed, x, y, direction, color) {

        this.size = size;
        this.diameter = size * 2;
        this.cycleTime = cycleTime;
        this.vx = speed;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
        
        this.vertices = 4;
        this.tailSide = this.size * 1.3;
        this.tailHeight = this.tailSide * Math.sqrt(3) / 2;

        this.coords = [
            [0, this.tailSide / 2],
            [-this.tailSide / 2, this.tailHeight + this.size / 2],
            [this.tailSide / 2, this.tailHeight + this.size / 2],
            [0, this.tailSide / 2]
        ];

        this.currentCoords;
        this.collision;
        this.dispose = false;

    }

    reposition(time) {
        
        const currentCoords = [];

        if(this.direction === 'left') {
            this.x -= this.vx;
        } else {
            this.x += this.vx;
        }
        
        this.coords.map((c, i) => {

            const initialX = this.x + c[0];
            const initialY = this.y + c[1];

            let rotationBase;

            if(this.direction === 'left') {
                rotationBase = - Math.PI / 2;
            } else {
                rotationBase = Math.PI / 2;
            }

            const rotationDelta = Math.PI / 16 * Math.sin(time / this.cycleTime);

            const rotatedPoint = rotatePoint(initialX, initialY, this.x, this.y, rotationBase + rotationDelta);

            currentCoords.push([rotatedPoint.x, rotatedPoint.y]);

        })

        this.currentCoords = currentCoords;

    }

    collisionDetection(x, y, radius) {

        const xx = (this.x - x) * (this.x - x)
        const yy = (this.y - y) * (this.y - y)
        const dd = xx + yy;
        const rr = (this.size + radius) * (this.size + radius);

        if(dd < rr) {this.collision = true;} else {
            this.collision = false;
        }

    }

    render(ctx, time, px, py, radius) {

        this.reposition(time);

        if(this.x + this.size < nx(0) || this.x - this.size > nx(100)){this.dispose = true;}

        if(Math.abs(this.x - px) < radius * 4 || Math.abs(this.y - py) < radius * 4) {
            this.collisionDetection(px, py, radius);
        }

        // draw circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        // draw tail
        ctx.beginPath();
        this.currentCoords.map((c, i) => {
            if(i === 0) {
                ctx.moveTo(c[0], c[1]);
            } else {
                ctx.lineTo(c[0], c[1]);
            }
        });

        ctx.fill(); 
        ctx.closePath();

    }
    
}

