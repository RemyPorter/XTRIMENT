//Map audio files to "convenient" names, and group them
//This allows a single "voice" to play multiple samples (randomly)
const VOICE_DEFS = { //exploit the naming conventions
	"bass": 2, //load 1 and 2
	"snarec0": [5, 8], //load everything between 5-8 (inclusive)
	"tom10-": [1, 5],
	"snared0": [5, 8],
	"splash": 2,
	"crash": 4,
	"hihat-closed": 4,
	"hihat-open": 4
};

//wrap 1+ sounds into a single play operation
class Sound {
	constructor(sounds) {
		if (sounds.length) {
			this.sounds = sounds;
		} else {
			this.sounds = [sounds];
		}
		//force 'em all to sustain for multiple playback
		this.sounds.forEach((s) => s.playMode("sustain"));
	}

	play() {
		random(this.sounds).play();
	}
}

//Helper function to load a set of 
//audio files within a numbered range
function loadSet(stem, a, b) {
	res = [];
	for (let i = a; i <= b; i++) {
		let fname = `samples/${stem}${i}.wav`;
		res.push(loadSound(fname));
	}
	return new Sound(res);
}

//Turn the voice definitions into a lookup table
class AudioLibrary {
	constructor(defs) {
		let ks = Object.keys(defs);
		ks.forEach((k) => {
			let v = defs[k];
			if (typeof v == "number") {
				this[k] = loadSet(k, 1, v);
			} else if (v.length) {
				this[k] = loadSet(k, v[0], v[1]);
			}
		});
	}
}