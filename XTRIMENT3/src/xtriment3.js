let noteRange = [-24, +24];
let center = 60;
let freqs = {};

function setupFreqs() {
    for (let i = noteRange[0]+center; i < noteRange[1]+center; i++) {
        freqs[i] = freqForNote(i);
    }
}

let inst = new p5.PolySynth(p5.MonoSynth, 14);
let butts = [];
function setup() {
    setupFreqs();
    let d = null;
    for (let i = noteRange[0]+center; i < noteRange[1]+center; i++) {
        if (i%12 == 0) {
            d = createDiv();
        }
        let n = i;
        let btn = createButton(labelForNote(i), i);
        btn.size(windowWidth/13, windowHeight/6);
        btn.mousePressed(() => playNote(n));
        butts.push(btn);
        btn.parent(d);
    }
}

function playNote(n) {
    let f = freqs[n];
    inst.play(f, 1, 0, 2);
    let jit = freqs[n] * jitter();
    freqs[n] += jit;
}

let JITTER_SCALE = 0.05;
function jitter() {
    let r = random(-1, 1);
    return r * JITTER_SCALE;
}