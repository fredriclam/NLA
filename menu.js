/*jslint es6 */
'use strict';

class Menu {
    constructor(x, y, text, url) {
      this.inFocus = false;
      this.initialAlpha = 0.2;
      this.maxAlpha = 0.6;
      this.animSpeed = 0.1;
      this.animProgress = 0.0;
      this.url = url;
  
      this.text = new PIXI.Text(text.toUpperCase(), {
        fontFamily: 'Arial',
        fill: 0xFFFFFF,
        letterSpacing: -2,
        dropShadow: true,
        dropShadowBlur: 2,
        dropShadowColor: 0x000000,
        dropShadowDistance: 1
      });
      this.text.style.fontSize = 32;
      this.text.x = x;
      this.text.y = y;
      this.text.anchor.x = 0.5;
      this.text.anchor.y = 0.5;
  
  
      // Button frame (border)
      this.frameGraphics = new PIXI.Graphics();
      this.frameGraphics.lineStyle(Math.floor(this.text.style.fontSize/6), 0xFFFFFF);
      this.frameGraphics.drawRect(0, 0, 200, this.text.height * 1.5);
      // this.frameGraphics.drawRect(0, 0, this.text.width * 1.5, this.text.height * 1.5);
  
      this.frameSprite = new PIXI.Sprite(app.renderer.generateTexture(this.frameGraphics));
      this.frameSprite.x = x;
      this.frameSprite.y = y;
      this.frameSprite.anchor.x = 0.5;
      this.frameSprite.anchor.y = 0.5;
  
      this.boxGraphics = new PIXI.Graphics();
      this.boxGraphics.beginFill(0xFFFFFF);
      this.boxGraphics.fillAlpha = 1.0;
      this.boxGraphics.lineStyle(0, 0xFFFFFF);
      this.boxGraphics.lineAlpha = 0.0;
      this.boxGraphics.drawRect(0, 0, this.frameGraphics.width, this.frameGraphics.height);
  
      this.boxSprite = new PIXI.Sprite(app.renderer.generateTexture(this.boxGraphics));
      this.boxSprite.x = x;
      this.boxSprite.y = y;
      this.boxSprite.anchor.x = 0.5;
      this.boxSprite.anchor.y = 0.5;
      this.boxSprite.alpha = 0.2;
  
      // Add sprite and then text
      app.stage.addChild(this.boxSprite);
      app.stage.addChild(this.frameSprite);
      app.stage.addChild(this.text);
  
      // Button
      this.boxSprite.buttonMode = true;
      this.boxSprite.interactive = true;
  
      this.boxSprite.on('pointerover', this.onButtonOver.bind(this))
        .on('pointerout', this.onButtonOut.bind(this))
        .on('pointertap', this.onButtonTap.bind(this));
  
      // Attach to ticker
      app.ticker.add((delta) => this.updateCallback(delta));
    }
  
    onButtonOver(){
      this.inFocus = true;
      uiFocus = true;
    }
  
    onButtonOut(){
      this.inFocus = false;
      uiFocus = false;
    }
  
    onButtonTap(){
      window.open(this.url, "_self");
    }
  
    updateCallback(delta) {
      // Tick animation progress
      if (this.inFocus){
        this.animProgress += this.animSpeed * delta;
      }
      else{
        this.animProgress -= this.animSpeed * delta;
      }
      // Clamp animation progress
      if (this.animProgress > 1){
        this.animProgress = 1;
      }
      else if (this.animProgress < 0){
        this.animProgress = 0;
      }
      // Map animation progress to button box alpha
      this.boxSprite.alpha = this.initialAlpha +
        (this.maxAlpha - this.initialAlpha) * this.animProgress;
      // Map animation progress to text colour
      this.text.style.fill = '#' + this.scalarToHex(0.8*this.animProgress)
        + this.scalarToHex(0.8*this.animProgress)
        + this.scalarToHex(0.8*this.animProgress);
    }
  }
