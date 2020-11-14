function basicScheduleTest() {
	bs = new BeatScheduler(4);
	c = new Clock(1, () => {
		console.log("Looped");
	});
	bs.toggle(0); bs.toggle(2);
	bs.onBeat(window, (b) => console.log("Beat: ", b));
	let mainLoop = () => {
		let t = c.tick();
		bs.tick(t);
	}
	setInterval(mainLoop, 30);
}

let library;
let cl;
let clock;
let beat_config = {
	"bass": 7,
	"snarec0": 13,
	"tom10-": 11,
	"snared0": 17,
	"splash": 5,
	"crash": 3,
	"hihat-closed": 23,
	"hihat-open": 19
}
let beats = [];
let timelines = [];
function preload() {
	library = new AudioLibrary(VOICE_DEFS);
}

function setup() {
	createCanvas(windowWidth/2, windowHeight);
	Object.keys(beat_config).forEach((k) => {
		let bs = new BeatScheduler(beat_config[k]);
		bs.onBeat(k, () => library[k].play());
		beats.push(bs);
		timelines.push(new TimelineWidget(bs, width*0.9));
	});
	clock = new Clock(4, ()=>0);
	cl = new ClockArc(width*0.9);
}

function mouseClicked() {
	timelines.forEach((tl) => {
		tl.mouseClicked(mouseX-(TIMELINE_SIZE+TIMELINE_GUTTER), mouseY);
	});
}

function draw() {
	clear();
	background(255);
	let p = clock.tick();
	beats.forEach((bs) => bs.tick(p));
	push();
	translate(TIMELINE_SIZE+TIMELINE_GUTTER, TIMELINE_SIZE+TIMELINE_GUTTER);
	timelines.forEach((tl) => {
		translate(0, TIMELINE_SIZE+TIMELINE_GUTTER);
		tl.tick(p);
		tl.draw();
	});
	pop();
	cl.tick(p);
	cl.draw();
}