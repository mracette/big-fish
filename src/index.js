import { pl, en, canvas, ctx, height, width, colorPalette } from './globals/globals';
import { drawPlayer, repositionPlayer } from './player/player';
import { Jumper } from './enemies/Jumper';
import { Simple } from './enemies/Simple';

import Stats from 'stats.js';
const stats = new Stats();

init();

function init() {

    stats.showPanel(0);
    document.body.append( stats.dom );

    // for(let i = 0; i < 50; i++) {
    //     const y = Math.random() * height;
    //     const direction = Math.random() >= .5 ? 'left' : 'right';
    //     const size = 10 + Math.random() * 150;
    //     const x = direction === 'left' ? width + size : -size;

    //     console.log(y, x, size, direction);

    //     en.push(new Jumper(size, x, y, direction));
    // }

    //en.push(new Jumper(80, 50, height / 2, 'right'));
    en.push(new Simple(50, 100, 1, width , height / 2, 'left'));

    addListeners();
    render(0);
}

function render(time) {

    stats.begin();

    // console.log(p);
    // console.log(pl.vx, pl.vy);

    // clear last render
    ctx.clearRect(0, 0, width, height);

    // set background
    ctx.fillStyle = colorPalette.blueOne;
    ctx.fillRect(0, 0, width, height);

    // player movement
    repositionPlayer();
    drawPlayer();

    // enemy movement
    en.map((enemy) => {
        enemy.render(ctx, time);
    })
    
    stats.end();

    requestAnimationFrame(render);
}

function addListeners() {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener('resize', () => {
        height = canvas.clientHeight;
        width = canvas.clientWidth;
        canvas.width = width;
        canvas.height = height;
    }, false)
}

function keyDownHandler(e) {
    const key = e.which || e.keyCode;

    switch(key) {
        case 37:
            pl.leftPressed = true;
            break;
        case 38:
            pl.upPressed = true;
            break;
        case 39:
            pl.rightPressed = true;
            break;
        case 40:
            pl.downPressed = true;
            break;
    }

}

function keyUpHandler(e) {
    const key = e.which || e.keyCode;

    switch(key) {
        case 37:
            pl.leftPressed = false;
            break;
        case 38:
            pl.upPressed = false;
            break;
        case 39:
            pl.rightPressed = false;
            break;
        case 40:
            pl.downPressed = false;
            break;
    }

}