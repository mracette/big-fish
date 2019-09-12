import { lerpColorHex, rotatePoint, rgbToHex, ellipse, circle, newEquilateralTriangle, updateEquilateralTriangle, drawEquilateralTriangle } from '../utils/utils';
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

    const lerpAmount = (size - minSize) / (maxSize - minSize);
    
    const color = rgbToHex(lerpColorHex(lerpAmount, colorPalette.testing));

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
        this.currentCoords;
        this.collision;
        this.dispose = false;

        this.tailVertices = newEquilateralTriangle(
            this.size * 1.3, 
            this.direction === 'left' ? this.x + this.size : this.x - this.size, 
            this.y, 
            this.direction === 'left' ? - Math.PI / 2 : Math.PI / 2
        );

    }

    reposition(time) {
        
        const currentCoords = [];

        if(this.direction === 'left') {
            this.x -= this.vx;
        } else {
            this.x += this.vx;
        }

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

    draw(ctx, time) {
        
        this.tailVertices = updateEquilateralTriangle(
            this.tailVertices, 
            this.direction === 'left' ? - this.vx : this.vx,
            0,
            this.direction === 'left' ? this.x - this.vx : this.x + this.vx,
            this.y,
            Math.PI / 64 * Math.sin(time / this.cycleTime)
            );

        // console.log(currentTailVertices);
        
        // draw body
        circle(ctx, this.x, this.y, this.size, this.color);

        // draw tail
        drawEquilateralTriangle(ctx, this.tailVertices, this.color);

        // draw eye


        ctx.fill(); 
        ctx.closePath();
    }

    render(ctx, time, px, py, radius) {

        this.reposition(time);

        if(this.x + this.size < nx(0) || this.x - this.size > nx(100)){this.dispose = true;}

        if(Math.abs(this.x - px) < radius * 4 || Math.abs(this.y - py) < radius * 4) {
            this.collisionDetection(px, py, radius);
        }

        this.draw(ctx, time);

    }
    
}

