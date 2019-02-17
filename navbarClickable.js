/** Text wrapper that integrates animations. */
class navbarClickable extends PIXI.Text {
    constructor(text, x, y, params={fontFamily: 'Garamond', fill: 0xFFFFFF, fontSize: 24, align: 'center'}){
        
      super(text, params);
      this.interactive = true;
      this.x = x;
      this.y = y;
      this.anchor.set(0.5);
    //   this.hitArea = new PIXI.Rectangle(this.x,
    //                                     this.y,
    //                                     this.width,
    //                                     this.height);
      this.growing = false;
      this.resolution = 20;
      // Mouse event callbacks
      this.mouseover = function(mouseData) {
        this.growing = true;
      }
  
      // Mouse event callbacks
      this.mouseout = function(mouseData) {
        this.growing = false;
      }
    }
  
    animate(delta){
      // console.log(this.growing);
      if (this.growing){
        if (this.scale.x < 1.3){
          this.scale.x += delta * 0.1;
          this.scale.y += delta * 0.1;
        }
      }
      else {
        if (this.scale.x > 1){
          this.scale.x -= delta * 0.1;
          this.scale.y -= delta * 0.1;
        }
      }
    }
  }