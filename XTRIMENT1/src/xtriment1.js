var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

let inst = new p5.Oscillator("square");
let lockedNote = null;

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
let buttons = [];

function freqForNote(n) {
    return pow(2, (n-69)/12.0) * 440.0;
}

function setup() {
    for (let i = 0; i < notes.length; i++) {
        let v = i+60;
        let btn = createButton(notes[i], v);
        btn.mousePressed(() => lockNote(v));
        buttons.push(btn);
        btn.size(windowWidth/12, windowHeight);
    }
    document.addEventListener(visibilityChange, () => {
        if (document[hidden]) {
            inst.stop();
        } else if (lockedNote) {
            inst.start();
        }
    })
}

function lockNote(note) {
    userStartAudio();
    if (lockedNote != null) return;
    lockedNote = note;
    inst.freq(freqForNote(lockedNote));
    inst.start();
    document.title = `${labelForNote(lockedNote)}:XTRIMENT1`
    buttons.forEach((btn) => {
        console.log(btn);
        if (btn.elt.value != lockedNote) {
            btn.elt.style.display = "none";
        }
    });
}