/*jslint es6 */
'use strict';

// PIXI.settings.RESOLUTION = 2

// Stage initial size
var defaultSize = [192, 108];
// Compute initial aspect ratio
var aspectRatio = defaultSize[0] / defaultSize[1];

//
// Three.js setup
//
// Three js boilerplate
var width = window.innerWidth;
var height = window.innerHeight;

var scene_3D = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width/height, 1, 10000);

camera.position.set( 700, 700, 700);

// camera.rotation.setFromVector3(new THREE.Vector3(1, 1, 1))
camera.lookAt( new THREE.Vector3(0,0,0) );

var controls = new THREE.EditorControls(camera);
// controls.update();


var canvas_3D = new THREE.WebGLRenderer({antialias: true, alpha: true});
canvas_3D.setSize(width, height);

// // Test cube
// var geometry = new THREE.BoxGeometry( 500, 500, 500 );
// var material = new THREE.MeshNormalMaterial();
// // var material = new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0.5});
// var cube = new THREE.Mesh(geometry, material);
// cube.position.x = 0;
// cube.position.z = 0;
// cube.rotation.x = 0;
// cube.rotation.y = 0;
// cube.rotation.z = 0;
// scene_3D.add(cube);

// Render once for test
canvas_3D.render(scene_3D, camera)

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
renderer.roundPixels = true;

document.body.appendChild(renderer.view);
// document.body.appendChild(canvas_3D.domElement);

var texture_3D = new PIXI.Texture.fromCanvas(canvas_3D.domElement);
var sprite_3D = new PIXI.Sprite(texture_3D);
app.stage.addChild(sprite_3D);

// Set state to initial state
var state = init;
// state = () => {};

// Load initial state
init();

// Initial state
function init() {
  // Resize app
  resizePixi();

  // Create loading screen text
  // var loadingText = new PIXI.Text("Loading...\n" +
  //   "Optimizing for window width: " + window.innerWidth,
  //   {fontFamily :"Garamond",
  //   fontSize: 36,
  //   fill: "black",
  //   align:"center"});
  // loadingText.x = window.innerWidth/2;
  // loadingText.y = window.innerHeight/2;
  // loadingText.anchor.x = 0.5;
  // loadingText.anchor.y = 0.5;
  // app.stage.addChild(loadingText);

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

  var select1 = new selectText('yeyeye',{fontFamily: 'Garamond', fill: 0xFFFFFF, fontSize: 24, align: 'center'});
  
  menu.addChild(select1);
  app.stage.addChild(menu)

  // Build axes
  var origin = new THREE.Vector3(0, 0, 0);
  var axisLength = 300;
  for (let i in [0, 1, 2]){
    var arrowHelper = new THREE.ArrowHelper(
                        new THREE.Vector3(i==0, i==1, i==2),
                        origin, axisLength, 0x888888, 2/3*0.2*axisLength);
    scene_3D.add(arrowHelper);
  }
  // Add test vector
  scene_3D.add(new geomVector(5,2,1,1));

  // Finish loading
  state = doneLoading;
}

/** Geometric 3-D vector. */
class geomVector extends THREE.ArrowHelper {
  constructor(x,y,z, normalizedLength=1){
    let dir = new THREE.Vector3(x,y,z);
    dir.normalize();
    let origin = new THREE.Vector3(0,0,0);
    super(dir, origin, 200*normalizedLength, 0x00ffff);
  }  
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
  var titleText = new PIXI.Text("Arrows", {
    fontSize: 64,
    fontFamily: "Garamond",
    letterSpacing: 0,
    fill: 0xFFFFFF,
    // dropShadow: true,
    // dropShadowColor: 0x000000,
    // dropShadowBlur: 3,
    // dropShadowDistance: 1
  });
  titleText.anchor.set(0.5);
  titleText.x = window.innerWidth / 2;
  titleText.y = window.innerHeight / 10;
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
  // Animate global cube
  // cube.rotation.x += 0.05*delta;
  // cube.rotation.y += 0.072*delta;
  // cube.rotation.z += 0.015*delta;
  sprite_3D.texture.update();
  canvas_3D.render(scene_3D, camera)
  // controls.update();

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
