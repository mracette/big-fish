
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
    simpleFish: ["#f3beb4", "#b86454"],
    jumperFish: ["#87a8eb", "#4966a1"]

}

console.log(d3.interpolatePlasma);

// player state
export const pl = {
    x: width / 2,
    y: height / 2,
    radius: ny(1.5),
    diameter: ny(1.5) * 2,
    vx: 0,
    vy: 0,
    theta: 0,
    maxSpeed: 10,
    speedDelta: 0.2,
    thetaDelta: 0.1
}

// enemy probability table
export const enpr = []
enpr.push(...new Array(3).fill('jumper'));
enpr.push(...new Array(10).fill('simple'));

// enemy array
export let en = [];

// session state
export const se = {
    elapsed: 0,
    enemyCount: 25,
    stage: 1
}