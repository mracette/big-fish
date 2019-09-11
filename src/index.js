import { ny, pl, en, enpr, se, canvas, ctx, height, width, colorPalette } from './globals/globals';
import { drawPlayer, repositionPlayer } from './player/player';
import { Jumper, generateJumperParams } from './enemies/Jumper';
import { Simple, generateSimpleParams } from './enemies/Simple';

import Stats from 'stats.js';
const stats = new Stats();

init();

function init() {

    canvas.height = height;
    canvas.width = width;

    en.push(new Jumper(ny(6), 2500, .1, 0, ny(50), 'right', colorPalette.jumperFish[1]))

    stats.showPanel(0);
    document.body.append( stats.dom );

    addListeners();

    render(0);

}

function render(time) {

    stats.begin();

    // clear last render
    ctx.clearRect(0, 0, width, height);

    // set background
    ctx.fillStyle = colorPalette.blueOne;
    ctx.fillRect(0, 0, width, height);

    // player movement
    repositionPlayer();
    drawPlayer();

    // add an enemy if needed
    if(en.length < se.enemyCount && Math.random() > .6) {
        const newEnemyType = enpr[Math.floor(Math.random() * enpr.length)];
        switch(newEnemyType) {
            case 'simple': {
                const { size, cycleTime, speed, x, y, direction, color } = generateSimpleParams();
                en.push(new Simple(size, cycleTime, speed, x, y, direction, color));
                break;
            }
            case 'jumper': {
                const { size, cycleTime, speed, x, y, direction, color } = generateJumperParams();
                en.push(new Jumper(size, cycleTime, speed, x, y, direction, color));
                break;
            }
        }
    }

    const enemyRemovalArray = []

    // enemy movement
    en.map((enemy, i) => {
        enemy.render(ctx, time, pl.x, pl.y, pl.radius);
        if(enemy.collision) {
            console.log(enemy.diameter, pl.diameter);
            if(enemy.diameter < pl.diameter) {
                pl.radius += enemy.diameter / 10;
                pl.diameter = pl.radius * 2;
                enemyRemovalArray.push(i);
                console.log('mmmmm');
            } else {
                console.log('owwww');
            }
        }
        if(enemy.dispose === true) {
            enemyRemovalArray.push(i);
        }
    })

    for(let i = 0; i < enemyRemovalArray.length; i++) {
        en.splice(enemyRemovalArray[i], 1);
    }
    
    console.log(enemyRemovalArray, en.length);
    
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