function addEvent(obj, name) {
	let obvs = `${name}Observers`;
	let onEvt = `on${name}`;
	let emitEvt = `emit${name}`;
	let stopListening = `unsub${name}`;
	obj[obvs] = new Map();
	obj[onEvt] = (observer, callback) => {
		obj[obvs].set(observer, callback);
	};
	obj[emitEvt] = (data) => {
		for (const [obs, cb] of obj[obvs].entries()) {
			try {
				cb(data);
			} catch (err) {
				console.log(err);
			}
		}
	}
	obj[stopListening] = (obs) => {
		obj[obvs].delete(obs);
	}
}

class TimeRangeScheduler {
	constructor(beats) {
		this.beats = beats;
		addEvent(this, "Tick");
		this.lastProgress = -1;
	}

	tick(progress) {
		let lastBeat = floor(this.beats * this.lastProgress);
		let thisBeat = floor(this.beats * progress);
		if (thisBeat != lastBeat) this.emitTick(thisBeat);
		this.lastProgress = progress;
	}
}

//Tracks the beats and what has triggered during this loop
//trigger is the voice we want to have play
class BeatScheduler {
	constructor(numBeats) {
		this.beats = [];
		for (let i = 0; i < numBeats; i++) {
			this.beats.push(false);
		}
		this.scheduler = new TimeRangeScheduler(numBeats);
		addEvent(this, "Beat");
		this.scheduler.onTick(this, (beat) => {
			if (this.beats[beat]) {
				 this.emitBeat(beat);
				 console.log(beat);
			}
		});
	}

	length() {
		return this.beats.length;
	}

	//toggle whether we trigger (or not) on a beat
	toggle(n) {
		this.beats[n] = !this.beats[n];
	}

	tick(progress) {
		this.scheduler.tick(progress);
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
