import processing.sound.*;
import java.util.Arrays;
import java.util.List;

Sound s;
float[] MAJOR = {0, 1, 3, 5, 7, 8, 10, 12};
float[] MINOR = {0, 2, 4, 5, 7, 9, 11, 12};
float[] AUG = {0, 3, 5, 6, 8, 10, 12};
float[] DIM = {0, 2, 4, 6, 7, 9, 12};
float[] ALG = {0, 2, 3, 6, 7, 8, 11, 12};
float[] BOP = {0, 2, 4, 5, 7, 9, 10, 11, 12};
float[] BLU = {0, 3, 5, 6, 7, 10, 12};



String[] notes = {
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
};

String labelForNote(int n) {
  return notes[(n%60)%12];
}

float[][] scales = {MAJOR, MINOR, AUG, DIM, ALG, BLU};

float[] scaleFromNote(float note, int position, float[] intervals) {
  position %= intervals.length;
  if (position < 0) position = intervals.length - 1;
  float root = note - intervals[position];
  float[] res = new float[intervals.length];
  for (int i = 0; i < intervals.length; i++) {
    res[i] = intervals[i] + root;
  }
  return res;
}

float[] nextScale() {
  int p = 0;
  for (int i = 0; i < lastScale.length; i++) {
    if (lastScale[i] == (float)lastNote) {
      p = i;
      float r = random(1.0);
      if (r < 0.125) {
        p++;
      } else if (r < 0.25 && p <= 1) {
        p--;
      }
      break;
    }
  }
  int t = (int)random(scales.length);
  return scaleFromNote(lastNote, p, scales[t]);
}


int lastNote = 60;
float[] lastScale;

SawOsc inst;
int noteStartFrame = -1;
int attackFrames = 15;
int sustainFrames = 15;
int releaseFrames = 15;

float freqForNote(float n) {
  println(pow(2, (n-69)/12.0) * 440.0);
  return pow(2, (n-69)/12.0) * 440.0;
}


void setup() {
  size(1920, 1080);
  lastScale = scaleFromNote(lastNote, 0, MAJOR);
  frameRate(30);
  s = new Sound(this);
  s.sampleRate(22050);
  inst = new SawOsc(this);
  inst.amp(0);
  inst.play();
}

void drawKey(int note) {
  fill(255);
  rect(0, 0, width/(lastScale.length*1.1), height);
  fill(0);
  String l = labelForNote(note);
  text(l, width/(lastScale.length*1.1)/2-textWidth(l)/2, height/2);
}

void draw() {
  clear();
  for (Float f : lastScale) {
    float n = f;
    drawKey((int)(n));
    translate(width/(lastScale.length), 0);
  }
  if (noteStartFrame > 0) {
    float a = (frameCount - noteStartFrame) / (float)attackFrames;
    float s = (frameCount - noteStartFrame - attackFrames) / (float)sustainFrames;
    float r = (frameCount - noteStartFrame - attackFrames - sustainFrames) / (float)releaseFrames;
    if (a < 1) {
      inst.amp(a);
    } else if (s < 1) {
      inst.amp(1);
    } else if (r <= 1) {
      inst.amp(1.0 - r);
    }
  }
}

void mousePressed() {
  float n = ((float)mouseX) / width * lastScale.length;
  println(n);
  lastNote = (int)lastScale[(int)n];
  lastScale = nextScale();
  noteStartFrame = frameCount;
  inst.amp(0);
  inst.freq(freqForNote(lastNote));
}
