import { circle } from '../utils/utils';
import { nx, ny } from '../globals/globals'; 

export class Bubble {
 
    constructor() {
        this.x = nx(5) + nx(90) * Math.random();
        this.y = ny(100);
        this.vy = ny(0.2);
        this.collision = false;
        this.color = '#FFFFFF';
        this.size = ny(3);
        this.type = 'bubble';
        this.dispose = false;
    }

    draw(ctx) {
        circle(ctx, this.x, this.y, this.size, null, true, this.color);
        circle(ctx, this.x, this.y, this.size * 0.9, null, true, this.color, 0, Math.PI / 8);
    }

    collisionDetection(dd, rr) {
        if(dd < rr) {this.collision = true;} else {
            this.collision = false;
        }
    }

    reposition() {

        this.y -= this.vy;
        if(this.y <= ny(0)) {this.dispose = true;};

    }

    render(ctx, time, px, py, radius) {

        this.reposition(time);
        
        const xx = (this.x - px) * (this.x - px)
        const yy = (this.y - py) * (this.y - py)
        const dd = xx + yy;
        const rr = (this.size + radius) * (this.size + radius);

        this.collisionDetection(dd, rr);
        
        this.draw(ctx, time);

    }
}