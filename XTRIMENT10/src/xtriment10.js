function basicScheduleTest() {
	bs = new BeatScheduler(4, {play: () => console.log("Tick")});
	c = new Clock(1, () => {
		console.log("Looped");
		bs.loop();
	});
	bs.toggle(0); bs.toggle(2);
	let mainLoop = () => {
		let t = c.tick();
		bs.tick(t);
	}
	setInterval(mainLoop, 30);
}

let library;
function preload() {
	library = new AudioLibrary(VOICE_DEFS);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
}