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

let possible_beats = [2, 3, 5, 7, 11, 13, 17, 23];

let beat_config = {
	"bass": 7,
	"snarec0": 13,
	"tom10-": 11,
	"snared0": 17,
	"splash": 2,
	"crash": 3,
	"hihat-closed": 23,
	"hihat-open": 5
};
let label_config = {
	"bass": "bd",
	"snarec0": "sn0",
	"tom10-": "tm",
	"snared0": "sn1",
	"splash": "sp",
	"crash": "cr",
	"hihat-closed": "hc",
	"hihat-open": "ho"
};
let beats = [];
let timelines = [];
let font;
function preload() {
	library = new AudioLibrary(VOICE_DEFS);
	font = loadFont("fonts/E1234.ttf");
}

function randomRetime() {
	let pos = shuffle(possible_beats);
	let i = 0;
	Object.keys(beat_config).forEach((k) => {
		beat_config[k] = pos[i];
		i++;
	});
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	let basePosition =TIMELINE_SIZE+TIMELINE_GUTTER;
	randomRetime();
	let i = 0;
	Object.keys(beat_config).forEach((k) => {
		let bs = new BeatScheduler(beat_config[k]);
		bs.onBeat(k, () => library[k].play());
		beats.push(bs);
		timelines.push(new TimelineWidget(bs, 
			new Rect(basePosition+width*0.08, basePosition + i * (TIMELINE_SIZE + TIMELINE_GUTTER),
				 width*0.9, TIMELINE_SIZE))
		);
		i++;
	});
	clock = new Clock(4, ()=>0);
	cl = new ClockArc(width*0.9);
}

function mouseClicked() {
	timelines.forEach((tl) => {
		tl.mouseClicked(mouseX, mouseY);
	});
}

function draw() {
	clear();
	background(255);
	let p = clock.tick();
	beats.forEach((bs) => bs.tick(p));
	push();
	timelines.forEach((tl) => {
		tl.tick(p);
		tl.draw();
	});
	pop();
	push();
	translate(30, 1.5*TIMELINE_SIZE+TIMELINE_GUTTER+10);
	textFont(font);
	textSize(30);
	Object.keys(label_config).forEach((k) => {
		line(0, 10, width, 10);
		let label = label_config[k];
		text(label, 20, 0);
		translate(0, TIMELINE_SIZE+TIMELINE_GUTTER);
		
	});
	pop();
	push();
	translate(width*0.08, 0);
	cl.tick(p);
	cl.draw();
	pop();

}