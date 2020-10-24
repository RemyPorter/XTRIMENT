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
let vp;
function preload() {
	library = new AudioLibrary(VOICE_DEFS);
	//vp = new VoicePicker(library, "snarec0");
}

function setup() {
	createCanvas(windowWidth/2, windowHeight);
	//basicScheduleTest();
}

function draw() {
	clear();
	background(128);
	//vp.draw();
}