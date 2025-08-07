export class Stopwatch {
  constructor({ DisplayElement, CircleElements = [] }) {
    this.DisplayElement = DisplayElement;
    this.CircleElements = CircleElements; // array of circle DOM elements to update color
    this.Timer = null;
    this.StartTime = 0;
    this.ElapsedTime = 0;
    this.IsRunning = false;

    this.SpaceHoldTimeout = null;
    this.SpaceHeldLongEnough = false;

    // Bind event handlers so "this" refers to the instance
    this.KeyDownHandler = this.KeyDownHandler.bind(this);
    this.KeyUpHandler = this.KeyUpHandler.bind(this);

    // Attach listeners
    document.addEventListener("keydown", this.KeyDownHandler);
    document.addEventListener("keyup", this.KeyUpHandler);
  }

  KeyDownHandler(e) {
    if (e.code === "Space" && !e.repeat && !this.IsRunning && !this.SpaceHoldTimeout) {
      // Start timing how long space is held
      this.SpaceHoldTimeout = setTimeout(() => {
        {this.SpaceHeldLongEnough = true} {this.SetCircleColors("#ffff00")};
      }, 1000);
    }

    if (e.code === "Space" && this.IsRunning) {
      this.Stop();
    }
  }

  KeyUpHandler(e) {
    if (e.code === "Space") {
      clearTimeout(this.SpaceHoldTimeout);
      this.SpaceHoldTimeout = null;

      if (this.SpaceHeldLongEnough && !this.IsRunning) {
        this.Start();
      }

      this.SpaceHeldLongEnough = false;
    }
  }

  Start() {
    if (!this.IsRunning) {
      this.SetCircleColors("#00ff00");
      this.StartTime = Date.now() - this.ElapsedTime;
      this.Timer = setInterval(() => this.Update(), 10);
      this.IsRunning = true;
    }
  }

  Stop() {
    if (this.IsRunning) {
      this.SetCircleColors("#ff0000");
      clearInterval(this.Timer);
      this.ElapsedTime = Date.now() - this.StartTime;
      this.IsRunning = false;
      if (this.onStop) this.onStop(this.DisplayElement.textContent);
    }
  }


  Reset() {
    this.SetCircleColors("#ff0000");
    clearInterval(this.Timer);
    this.StartTime = 0;
    this.ElapsedTime = 0;
    this.IsRunning = false;
    if (this.DisplayElement) {
      this.DisplayElement.textContent = "00:00:00";
    }
  }

  Update() {
    const CurrentTime = Date.now();
    this.ElapsedTime = CurrentTime - this.StartTime;

    let Minutes = Math.floor((this.ElapsedTime / 1000 / 60) % 60);
    let Seconds = Math.floor((this.ElapsedTime / 1000) % 60);
    let Milliseconds = Math.floor((this.ElapsedTime % 1000) / 10);

    Minutes = String(Minutes).padStart(2, "0");
    Seconds = String(Seconds).padStart(2, "0");
    Milliseconds = String(Milliseconds).padStart(2, "0");

    if (this.DisplayElement) {
      this.DisplayElement.textContent = `${Minutes}:${Seconds}:${Milliseconds}`;
    }
  }

  SetCircleColors(Color) {
    this.CircleElements.forEach(circle => {
      if (circle) circle.style.backgroundColor = Color;
    });
  }

  Destroy() {
    document.removeEventListener("keydown", this.KeyDownHandler);
    document.removeEventListener("keyup", this.KeyUpHandler);
    clearInterval(this.Timer);
  }
}
