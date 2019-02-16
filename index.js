/*jslint es6 */
'use strict';

// Stage initial size
var defaultSize = [192, 108];
// Compute initial aspect ratio
var aspectRatio = defaultSize[0] / defaultSize[1];
// Static paths to background assets

// Set up stage and renderer with placeholder size
const app = new PIXI.Application({
  width: 800,
  height: 600,
  antialias: true,
  transparent: false,
  resolution: 1
});
// Aliases
const stage = app.stage;
const renderer = app.renderer; // PIXI.autoDetectRenderer(defaultSize[0], defaultSize[1]);
// const sprites = {};

document.body.appendChild(renderer.view);

// Set state to initial state
var state = init;

// Load initial state
init();

// Initial state
function init() {
  // Resize app
  resizePixi();

  // Create loading screen
  var loadingText = new PIXI.Text("Loading...\n" +
    "Optimizing for window width: " + window.innerWidth,
    {fontFamily :"Garamond",
    fontSize: 36,
    fill: "black",
    align:"center"});
  loadingText.x = window.innerWidth/2;
  loadingText.y = window.innerHeight/2;
  loadingText.anchor.x = 0.5;
  loadingText.anchor.y = 0.5;
  app.stage.addChild(loadingText);
  // Render once
  renderer.render(stage);

  // Attach resize callback to onresize event listener
  window.onresize = function(event) {
    // Resize app
    resizePixi();
    // Resize background
    stretchToFit();
  };

  // Load background image
  // PIXI.loader.add(bgImagePath).load((loader, resources) => {
  //   state = doneLoading;
  //   console.log("Resources loaded.");
  //   console.log("Loaded " + bgImagePath);
  // })

  state = loading;
}

// Loading state
function loading() {
  // Add elements
  let menu = new PIXI.Container();
  menu.name = 'menu';
  // TODO: refactor to scale with screen container
  menu.x = 20;
  menu.y = 50;

  var select1 = new selectText('sadhia',{fontFamily: 'Garamond', fill: 0xFFFFFF, fontSize: 24, align: 'center'});
  
  menu.addChild(select1);
  app.stage.addChild(menu)

  // Finish loading
  state = doneLoading;
}

/** Text wrapper that integrates animations. */
class selectText extends PIXI.Text {
  constructor(text, params){
    super(text, params);
    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(this.x,
                                      this.y,
                                      this.width,
                                      this.height);
    this.growing = false;
    // Mouse event callbacks
    this.mouseover = function(mouseData) {
      console.log('yeet');
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
      if (this.scale.x < 2){
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

// Done loading state
function doneLoading() {
  // // Make background
  // bgTexture = new PIXI.Texture.fromImage(bgImagePath);
  // bgTexture.textureAspectRatio = bgTexture.width / bgTexture.height;
  // bgSprite = new PIXI.Sprite(bgTexture);
  // stage.addChild(bgSprite);
  // bgSprite.x = window.innerWidth/2;
  // bgSprite.y = 0;
  // bgSprite.anchor.x = 0.5;
  // bgSprite.anchor.y = 0;

  // Re-size background to fit
  stretchToFit();

  // Make simple title
  var titleText = new PIXI.Text("wtf", {
    fontSize: 64,
    fontFamily: "Helvetica",
    letterSpacing: -3,
    fill: 0xFFFFFF,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowBlur: 3,
    dropShadowDistance: 1
  });
  titleText.anchor.set(0.5);
  titleText.x = window.innerWidth / 2;
  titleText.y = window.innerHeight / 3;
  app.stage.addChild(titleText);

  // Add background blur monitor
  // app.ticker.add((delta) => { })
  // Switch state to main
  state = mainState;
}

// Stretches bgSprite to fit inner screen
function stretchToFit(){ }

// Main (animation) state
// Requests pixi render
function mainState(delta) {
  // Call animations for all menu children
  for (let childIndex in app.stage.getChildByName('menu').children) {
    let child = app.stage.getChildByName('menu').children[childIndex];
    child.animate(delta);
  }
  // Render once every time state is processed
  window.requestAnimationFrame(() => {
    renderer.render(stage);
  });
}

// Resize callback
function resizePixi() {
  // Resize Pixi app
  let w = window.innerWidth+1; // Magic pixel...
  let h = window.innerHeight+1;
  renderer.resize(w,h);
}

// Add state to ticker
app.ticker.add((delta) => state(delta));
