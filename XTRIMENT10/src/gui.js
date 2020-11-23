const TIMELINE_SIZE = 30;
const TIMELINE_GUTTER = 10;

class Rect {
	constructor(x, y, w, h) {
		this.x =  x; this.y = y;
		this.w = w; this.h = h;
	}

	hit(x, y) {
		return x >= this.x && x <= (this.x + this.w) &&
			y >= this.y && y <= (this.y + this.h);
	}
}

class BeatWidget {
	constructor(rect, index) {
		this.rect = rect;
		this.index = index;
		addEvent(this, "Click");
	}

	draw(hot) {
		push();
		ellipseMode(CORNER);
		translate(this.rect.x, this.rect.y);
		strokeWeight(3);
		stroke(0);
		noFill();
		ellipse(0, 0, TIMELINE_SIZE, TIMELINE_SIZE);
		if (hot) {
			ellipseMode(CENTER);
			stroke(255);
			strokeWeight(1);
			ellipse(TIMELINE_SIZE/2, TIMELINE_SIZE/2, TIMELINE_SIZE-1, TIMELINE_SIZE-1);
			fill(0);
			ellipse(TIMELINE_SIZE/2, TIMELINE_SIZE/2, TIMELINE_SIZE-TIMELINE_GUTTER, TIMELINE_SIZE-TIMELINE_GUTTER);
		}
		pop();
	}

	mouseClicked(x, y) {
		console.log(x, y, this.rect.hit(x, y), this.rect);
		if (this.rect.hit(x, y)) {
			this.emitClick(this.index);
		}
	}
}

class TimelineWidget {
	constructor(beatSched, rect) {
		this.beatSched = beatSched;
		addEvent(this, "Toggle");
		this.rect = rect;
		this.onToggle(beatSched, beatSched.toggle);
		let steps = this.rect.w / this.beatSched.length();
		this.beats = [];
		for (let i = 0; i < this.beatSched.length(); i++) {
			let r = new Rect(this.rect.x+i*steps, this.rect.y, TIMELINE_SIZE, TIMELINE_SIZE);
			let nb = new BeatWidget(r, i);
			nb.onClick(this, (idx) => beatSched.toggle(idx));
			this.beats.push(nb);
		}
	}

	tick(progress) {
		this.beatSched.tick(progress);
	}
	
	mouseClicked(x, y) {
		if (this.rect.hit(x, y)) {
			this.beats.forEach((b) => b.mouseClicked(x, y));
		}
	}

	draw() {
		push();
		for (let i = 0; i < this.beatSched.length(); i++) {
			this.beats[i].draw(this.beatSched.beats[i]);
		}
		pop();
	}
}

class ClockArc {
	constructor(timelineWidth) {
		this.width = timelineWidth;
		this.x = 0;
	}

	tick(progress) {
		this.x = this.width * progress;
	}

	draw() {
		push();
		translate(TIMELINE_SIZE*2, 0);
		strokeWeight(TIMELINE_SIZE);
		strokeCap(SQUARE);
		stroke(255, 255, 255, 255);
		blendMode(DIFFERENCE);
		line(this.x, 0, this.x, height);
		pop();
	}
}