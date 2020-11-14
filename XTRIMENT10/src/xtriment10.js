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
let tl;
function preload() {
	library = new AudioLibrary(VOICE_DEFS);
}

function setup() {
	createCanvas(windowWidth/2, windowHeight);
	tl = new TimelineWidget(new BeatScheduler(11), width*0.9);
}

function mouseClicked() {
	tl.mouseClicked(mouseX-(TIMELINE_SIZE+TIMELINE_GUTTER), mouseY);
}

function draw() {
	clear();
	background(255);
	translate(TIMELINE_SIZE+TIMELINE_GUTTER, TIMELINE_SIZE+TIMELINE_GUTTER);
	tl.draw();
}