//Adapter which lets a sound play in response to an event
class Trigger {
	constructor(sound) {
		this.sound = sound;
	}
	changeSound(sound) {
		this.sound = sound;
	}
	trigger() {
		this.sound.play();
	}
}

//Tracks the beats and what has triggered during this loop
//trigger is the voice we want to have play
class BeatScheduler {
	constructor(numBeats, trigger) {
		this.trigger = trigger;
		this.beats = [];
		this.triggers = [];
		for (let i = 0; i < numBeats; i++) {
			this.beats.push(false);
			this.triggers.push(false);
		}
		this.numBeats = numBeats;
	}

	//toggle whether we trigger (or not) on a beat
	toggle(n) {
		this.beats[n] = !this.beats[n];
	}

	//progress through our loop duration
	//play the beat if it's due to be played
	tick(progress) {
		let i = round(this.numBeats * progress);
		if (!this.triggers[i] && this.beats[i]) {
			this.triggers[i] = true;
			this.trigger.play();
		}
	}

	//we've hit the top of the loop, so reset all
	//our triggers
	loop() {
		for (let i = 0; i < this.triggers.length; i++) {
			this.triggers[i] = false;
		}
	}
}

//Manages the wall clock
class Clock {
	constructor(loopDuration, onLoop) {
		this.dur = loopDuration * 1000;
		this.onLoop = onLoop;
		this.zero = millis();
	}

	tick() {
		let elaps = millis() - this.zero;
		if (elaps > this.dur) {
			this.onLoop();
			this.zero = millis();
			elaps = 0;
		}
		return elaps / this.dur;
	}
}
