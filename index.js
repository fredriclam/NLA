/*jslint es6 */
'use strict';

//
// PIXI setup
//

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
// Append PIXI renderer view to DOM

//
// Three.js setup
//

// Three js boilerplate
var width = window.innerWidth;
var height = window.innerHeight;
var threeScene = new THREE.Scene();
var focus = 75;
var near = 1;
var far = 10000;
var threeWidth = 4/9*width;
var threeHeight = 2/3*height;
var threeAspect = threeWidth/threeHeight;
var camera = new THREE.PerspectiveCamera(focus, threeAspect, near, far);
// Set camera position and angle
camera.position.set( 700, 700, 700);
camera.lookAt( new THREE.Vector3(0,0,0) );
// Setup camera controls
var controls = new THREE.EditorControls(camera);
// Setup canvas
var threeCanvas = new THREE.WebGLRenderer({antialias: true, alpha: true});
threeCanvas.setSize(threeWidth, threeHeight);

//
// Append Three as child of PIXI
//

document.body.appendChild(renderer.view);
// Generate and map three.js canvas to PIXI via texturing
var threeTexture = new PIXI.Texture.fromCanvas(threeCanvas.domElement);
var threeSprite = new PIXI.Sprite(threeTexture);
stage.addChild(threeSprite);
threeSprite.x = 4/9*window.innerWidth;
threeSprite.y = 7/18*window.innerHeight;
threeSprite.anchor.set(0.5);

//
// Init
//

// Set state to initial state
var state = init;
// Early resize for smoothness
resizePixi();
// Add state to ticker
app.ticker.add((delta) => state(delta));

console.log("Initialized!");

//
// App states
//

// Initial state
function init() {
  // Resize app to window
  resizePixi();
  // Initial PIXI stage render
  renderer.render(stage);
  // Attach resize callback to onresize event listener
  window.onresize = function(event) {
    // Resize app
    resizePixi();
    // Resize background
    stretchToFit();
  };

  // Add menu
  let menu = new PIXI.Container();
  menu.name = 'menu';
  // TODO: displace menu items
  menu.x = 0.1*window.innerWidth;
  menu.y = 0.5*window.innerHeight;
  menu.width = 1/9*window.innerWidth;
  menu.height = 0.65*window.innerHeight;
  menu.addChild(new navbarClickable('Hello',0,0));
  menu.addChild(new navbarClickable('Goodbye',0,40));  
  stage.addChild(menu)

  // Add axes to three scene
  let origin = new THREE.Vector3(0, 0, 0);
  let axisLength = 300;
  for (let i in [0, 1, 2]){
    var arrowHelper = new THREE.ArrowHelper(
                        new THREE.Vector3(i==0, i==1, i==2),
                        origin, axisLength, 0x888888, 2/3*0.2*axisLength);
    threeScene.add(arrowHelper);
  }
  // Add test vector to three scene
  threeScene.add(new geomVector(5,2,1,1));

  // Make scene header
  let titleText = new PIXI.Text("Woop doop", {
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
  titleText.x = window.innerWidth/2;
  titleText.y = window.innerHeight/10;
  stage.addChild(titleText);

  // Finish loading state
  state = mainState;
}

/** Main animation state.
 * Called by the ticker after adding this callback.
  */
function mainState(delta) {
  // Call menu animations
  for (let childIndex in stage.getChildByName('menu').children) {
    let child = stage.getChildByName('menu').children[childIndex];
    child.animate(delta);
  }
  // Render once every time state is processed
  window.requestAnimationFrame(() => {
    renderer.render(stage);
  });
  // Update embedded three JS texture
  threeSprite.texture.update();
  threeCanvas.render(threeScene, camera)
}

//
// Window re-size functions
//

/** Callback that resizes PIXI renderer. */
function resizePixi() {
  // Resize Pixi app
  let w = window.innerWidth+1; // Magic pixel...
  let h = window.innerHeight+1;
  renderer.resize(w,h);
}

