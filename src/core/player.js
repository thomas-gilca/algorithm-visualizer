// Playerul mută un index prin lista de pași. Nu știe nimic despre algoritmi sau desen.
export const SPEEDS = [1, 2, 3, 5, 8, 13, 25, 50, 100]; // pași pe secundă

export class Player {
  constructor(onChange) {
    this.onChange = onChange; // apelată după fiecare schimbare: onChange(step, player)
    this.steps = [];
    this.index = 0;
    this.playing = false;
    this.speed = 3; // index în SPEEDS
    this.timer = null;
  }

  get last() {
    return this.steps.length - 1;
  }

  load(steps) {
    this.stop();
    this.steps = steps;
    this.index = 0;
    this.emit();
  }

  goTo(k) {
    this.index = Math.max(0, Math.min(k, this.last));
    this.emit();
  }

  play() {
    if (this.steps.length < 2) return;
    if (this.index >= this.last) this.index = 0; // de la capăt, o luăm de la început
    this.playing = true;
    this.emit();
    this.tick();
  }

  pause() {
    this.stop();
    this.emit();
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  // oprește timerul fără să redeseneze
  stop() {
    clearTimeout(this.timer);
    this.playing = false;
  }

  // setTimeout în lanț (nu setInterval): o schimbare de viteză contează de la pasul următor
  tick() {
    this.timer = setTimeout(() => {
      this.index += 1;
      if (this.index >= this.last) this.playing = false;
      this.emit();
      if (this.playing) this.tick();
    }, 1000 / SPEEDS[this.speed]);
  }

  emit() {
    if (this.steps.length > 0) this.onChange(this.steps[this.index], this);
  }
}