const MAJOR = [0, 1, 3, 5, 7, 8, 10, 12];
const MINOR = [0, 2, 4, 5, 7, 9, 11, 12];
const AUG = [0, 3, 5, 6, 8, 10, 12];
const DIM = [0, 2, 4, 6, 7, 9, 12];
const ALG = [0, 2, 3, 6, 7, 8, 11, 12];
const BOP = [0, 2, 4, 5, 7, 9, 10, 11, 12];
const BLU = [0, 3, 5, 6, 7, 10, 12];
const notes = [
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

function freqForNote(n) {
    return pow(2, (n-69)/12.0) * 440.0;
  }