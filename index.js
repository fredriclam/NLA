// Stage initial size
var defaultSize = [192, 108];
// Compute initial aspect ratio
var aspectRatio = defaultSize[0] / defaultSize[1];
// Static paths to background assets
var bgImagePathLarge = "static/images/yul.jpg";
var bgImagePathMobile = "static/images/yul_small.jpg"; // Smaller texture

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
var uiFocus =  false;
var animSpeed = 0.1;
// Global declarations
var bgTexture;
var bgSprite;

// Load initial state
init();

// Initial state
function init() {
  // Resize app
  resizePixi();

  // Create loading screen
  loadingText = new PIXI.Text("Loading...\n" +
    "Optimizing for your window width: " + window.innerWidth,
    {fontFamily :"Arial",
    fontSize: 36,
    fill: "white",
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

  bgImagePath = bgImagePathLarge;
  // Check for small screens
  if (window.innerWidth < 1200){
    bgImagePath = bgImagePathMobile;
  }
  // Load background image
  PIXI.loader.add(bgImagePath).load((loader, resources) => {
    state = doneLoading;
    console.log("Resources loaded.");
    console.log("Loaded " + bgImagePath);
  })

  state = loading;
}

// Loading state
function loading() {

};

// Done loading state
function doneLoading() {
  // Make background
  bgTexture = new PIXI.Texture.fromImage(bgImagePath);
  bgTexture.textureAspectRatio = bgTexture.width / bgTexture.height;
  bgSprite = new PIXI.Sprite(bgTexture);
  stage.addChild(bgSprite);
  bgSprite.x = window.innerWidth/2;
  bgSprite.y = 0;
  bgSprite.anchor.x = 0.5;
  bgSprite.anchor.y = 0;

  // Control blur state
  bgSprite.maxBlurStrength = 0.7;
  bgSprite.animProgress = 0;
  bgSprite.animSpeed = animSpeed;
  bgSprite.filters = [new PIXI.filters.BlurFilter(1, 1, 1)];
  bgSprite.filters[0].blur = bgSprite.maxBlurStrength * bgSprite.animProgress;

  // Re-size background to fit
  stretchToFit();

  // Make simple title
  titleText = new PIXI.Text("YOU ARE HERE.", {
    fontSize: 64,
    fontFamily: "Arial",
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


  // Add UI buttons
  galleryButton = new Button(0.33*window.innerWidth,
    0.67*window.innerHeight, "GALLERY", '#');
  bioButton = new Button(0.67*window.innerWidth,
    0.67*window.innerHeight, "BIO", 'resume');

  // Add background blur monitor
  app.ticker.add((delta) => {
    if (uiFocus) {
      bgSprite.animProgress += bgSprite.animSpeed * delta;
    }
    else {
      bgSprite.animProgress -= bgSprite.animSpeed * delta;
    }
    bgSprite.animProgress = Math.min(Math.max(bgSprite.animProgress, 0.0), 1.0);
    bgSprite.filters[0].blur = bgSprite.maxBlurStrength * bgSprite.animProgress;
  })
  // Switch state to main
  state = mainState;
};

// Stretches bgSprite to fit inner screen
function stretchToFit(){
  bgSprite.width = window.innerWidth+1;
  bgSprite.height = bgSprite.width / bgTexture.textureAspectRatio;
  if (bgSprite.height < window.innerHeight){
    bgSprite.height = window.innerHeight;
    bgSprite.width = bgSprite.height * bgTexture.textureAspectRatio;
  }
  bgSprite.x = window.innerWidth/2;
};

// Main (animation) state
function mainState() {
  uiFocus = galleryButton.inFocus | bioButton.inFocus;
  // Render once every time state is processed
  window.requestAnimationFrame(() => {
    renderer.render(stage);
  });
};

// Resize callback
function resizePixi() {
  // Resize Pixi app
  let w = window.innerWidth+1; // Magic pixel...
  let h = window.innerHeight+1;
  renderer.resize(w,h);
}

// Add state to ticker
app.ticker.add((delta) => state(delta));
