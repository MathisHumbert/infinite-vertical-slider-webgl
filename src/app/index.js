import { lerp } from 'three/src/math/MathUtils.js';

import '../style.css';

import Canvas from './Canvas';

class App {
  constructor() {
    this.scroll = {
      current: 0,
      target: 0,
      position: 0,
      last: 0,
      ease: 0.1,
      direction: 'up',
    };
    this.isDown = false;
    this.isAnimating = true;

    this.canvas = new Canvas();

    this.addEventListeners();

    this.update();
  }

  onResize() {
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }
  }

  onWheel(event) {
    this.scroll.target += event.deltaY * 0.75;
  }

  onTouchDown(event) {
    this.isDown = true;

    this.scroll.position = this.scroll.current;

    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (!this.isDown || this.isAnimating) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (this.start - y) * 2;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
  }

  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );
    this.scroll.current = Number(this.scroll.current.toFixed(2));

    if (this.scroll.current > this.scroll.last) {
      this.scroll.direction = 'down';
    } else if (this.scroll.current < this.scroll.last) {
      this.scroll.direction = 'up';
    }

    this.scroll.last = this.scroll.current;

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.scroll.current, this.scroll.direction);
    }

    window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));

    window.addEventListener('wheel', this.onWheel.bind(this));

    window.addEventListener('touchstart', this.onTouchDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchUp.bind(this));
  }
}

new App();
