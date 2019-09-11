
// canvas and context
export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

// width / height as displayed on the page
export let height = canvas.clientHeight;
export let width = canvas.clientWidth;

// normalized in-game x and y coordinates
export const nx = n => n * width / 100;
export const ny = n => n * height / 100;

// colors!
export const colorPalette = {
    blueOne: '#69D2E7',
    blueTwo: '#A7DBD8',
    goldFishOne: '#F38630',
    goldFishTwo: '#FA6900',
    //testing: ['#f0f9e8', '#bae4bc', '#7bccc4', '#43a2ca', '#0868ac'],
    //testing: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
    testing: ['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','006837'],
    simpleFish: ["#f3beb4", "#b86454"],
    jumperFish: ["#87a8eb", "#4966a1"],
    pufferFish: ['#E0E4CC'],
    pufferFishTail: '#c9cdb7',
    pufferFishMouth: '#f0b1a5'

}

console.log(d3.interpolatePlasma);

// player state
export const pl = {
    x: nx(50),
    y: ny(50),
    radius: ny(1.5),
    diameter: ny(1.5) * 2,
    vx: 0,
    vy: 0,
    theta: 0,
    speedDelta: ny(0.0135),
    thetaDelta: ny(0.0145)
}

// enemy probability table
export const enpr = []
enpr.push(...new Array(1).fill('puffer'));
enpr.push(...new Array(4).fill('jumper'));
enpr.push(...new Array(12).fill('simple'));

// enemy array
export let en = [];

// session state
export const se = {
    fishEaten: 0,
    score: 0,
    progress: 0,
    elapsed: 0,
    enemyCount: 25,
    stage: 1
}