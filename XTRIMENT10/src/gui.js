const TIMELINE_SIZE = 30;
const TIMELINE_GUTTER = 10;

class BeatWidget {
	constructor(offset, index) {
		this.offset = offset;
		this.index = index;
		addEvent(this, "Click");
	}

	draw(hot) {
		push();
		ellipseMode(CENTER);
		translate(this.offset, 0);
		strokeWeight(3);
		stroke(0);
		noFill();
		ellipse(0, 0, TIMELINE_SIZE, TIMELINE_SIZE);
		if (hot) {
			stroke(255);
			strokeWeight(1);
			ellipse(0, 0, TIMELINE_SIZE-1, TIMELINE_SIZE-1);
			fill(0);
			ellipse(0, 0, TIMELINE_SIZE-TIMELINE_GUTTER, TIMELINE_SIZE-TIMELINE_GUTTER);
		}
		pop();
	}

	mouseClicked(x, y) {
		console.log(this.offset, x, this.offset+TIMELINE_SIZE);
		if (x >= this.offset-TIMELINE_SIZE/2 && x < this.offset+TIMELINE_SIZE/2) {
			console.log(this.index);
			this.emitClick(this.index);
		}
	}
}

class TimelineWidget {
	constructor(beatSched, width) {
		this.beatSched = beatSched;
		addEvent(this, "Toggle");
		this.onToggle(beatSched, beatSched.toggle);
		let steps = width / this.beatSched.length();
		this.beats = [];
		for (let i = 0; i < this.beatSched.length(); i++) {
			let nb = new BeatWidget(i*steps, i);
			nb.onClick(this, (idx) => beatSched.toggle(idx));
			this.beats.push(nb);
		}
	}

	//a mouse was clicked in the X/Y coordinates relative to our origin
	mouseClicked(adjX, adjY) {
		this.beats.forEach((b) => b.mouseClicked(adjX, adjY));
	}

	draw() {
		for (let i = 0; i < this.beatSched.length(); i++) {
			this.beats[i].draw(this.beatSched.beats[i]);
		}
	}
}