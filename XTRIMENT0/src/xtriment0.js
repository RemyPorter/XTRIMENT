let MAJOR = [0, 1, 3, 5, 7, 8, 10, 12];
let MINOR = [0, 2, 4, 5, 7, 9, 11, 12];
let AUG = [0, 3, 5, 6, 8, 10, 12];
let DIM = [0, 2, 4, 6, 7, 9, 12];
let ALG = [0, 2, 3, 6, 7, 8, 11, 12];
let BOP = [0, 2, 4, 5, 7, 9, 10, 11, 12];
let BLU = [0, 3, 5, 6, 7, 10, 12];

let notes = [
	"C",
	"Db",
	"D",
	"Eb",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"Bb",
	"B"
];

function labelForNote(n) {
	return notes[(n%60)%12];
}

let scales = [MAJOR, MINOR, AUG, DIM, ALG, BLU];

function scaleFromNote(note, position, intervals) {
	position %= intervals.length;
	if (position < 0) position = intervals.length - 1;
	let root = note - intervals[position];
	return intervals.map((i) => i + root);
}

function nextScale() {
	let p = lastScale.indexOf(lastNote);
	let r = random(1.0);
	if (r < 0.125) {
		p++;
	} else if (r < 0.25 && p <= 1) {
		p--;
	}
	return scaleFromNote(lastNote, p, random(scales));
}

let lastNote = 60;
let lastScale = scaleFromNote(lastNote, 0, MAJOR);

let inst;
const ADSR = [0.25, 0.01, 0.25, 0.25];

function setup() {
	createCanvas(windowWidth, windowHeight);
	inst = new p5.PolySynth();
	//inst.setADSR(ADSR[0], ADSR[1], ADSR[2], ADSR[3]);
	userStartAudio();
}

function drawKey(note) {
	fill(255);
	rect(0, 0, width/(lastScale.length*1.1), height);
	fill(0);
	let l = labelForNote(note);
	text(l, width/(lastScale.length*1.1)/2-textWidth(l)/2, height/2);
}

function draw() {
	background(0);
	clear();
	lastScale.forEach((n) => {
		drawKey(round(n));
		translate(width/(lastScale.length), 0);
	});
}

function mousePressed() {
	let n = mouseX / width * lastScale.length;
	lastNote = lastScale[round(n)];
	lastScale = nextScale();
	inst.play(lastNote, 1, 0, 1);
}