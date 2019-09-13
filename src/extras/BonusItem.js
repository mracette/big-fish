import { star} from '../utils/utils';
import { nx, ny } from '../globals/globals'; 

export class BonusItem {

    constructor() {

        this.x = nx(5) + nx(90) * Math.random();
        this.y = ny(0);
        this.vy = ny(0.2);
        this.xVariation = nx(.25);
        this.cycleTime = 200;
        this.collision = false;
        this.color = '#FFD700';
        this.rotation = 0;
        this.size = ny(2);
        this.dispose = false;

    }

    reposition(time) {

        this.x = this.x + this.xVariation * Math.sin(time / this.cycleTime);
        this.y = this.y + Math.max(-this.vy * 0.1, Math.abs(Math.sin(time / this.cycleTime)) * this.vy);
        this.rotation -= Math.sin(time / this.cycleTime) * this.vy / 50;
        if(this.y >= ny(100)) {this.dispose = true;};

    }

    collisionDetection(dd, rr) {
        if(dd < rr) {this.collision = true;} else {
            this.collision = false;
        }
    }

    draw(ctx, time) {

        star(ctx, this.x, this.y, this.size, this.color, this.rotation);

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