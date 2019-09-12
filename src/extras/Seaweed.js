import { nx, ny } from '../globals/globals';

export class Seaweed {

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.width = size / 10;
        this.cycleTime = 500;
        this.numPoints = 16
    }

    draw(ctx, time) {

        const cyclePos = time / this.cycleTime;

        ctx.strokeStyle = '#006837';
        ctx.fillStyle = '#006837';

        ctx.beginPath();

        ctx.moveTo(this.x - this.width / 2, ny(100));
        
        for(let i = 0; i < this.numPoints; i++) {

            const dx = this.width * (i / this.numPoints);

            ctx.lineTo(this.x - this.width + dx + (this.width / 4) * Math.sin(cyclePos % this.cycleTime + 3 * (2 * Math.PI * i / this.numPoints)), ny(100) - this.size * (i/this.numPoints));

        }

        for(let i = this.numPoints; i >= 0; i--) {

            const dx = this.width * (i / this.numPoints);

            ctx.lineTo(this.x + this.width - dx + (this.width / 4) * Math.sin(cyclePos % this.cycleTime + 3 * (2 * Math.PI * i / this.numPoints)), ny(100) - this.size * (i/this.numPoints));

        }
        
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

    }

    render(ctx, time) {
        this.draw(ctx, time);
    }

}