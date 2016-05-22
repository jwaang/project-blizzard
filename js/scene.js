// GLOBAL VARIABLES
var scene, refreshIntervalId, totalSeconds;
var EARTH_ARRAY = [];
var ALL_BOLIDES = [];
var ALL_ARKLETS = [];
var IZZY_ARRAY = [];
var IZZY_SHIELD = 30;
var EARTH_SIZE = 100;
var BOLIDE_SIZE = 3;
var NUM_ARKLETS = 10;
var BOLIDE_SPEED = 1;
var BOLIDE_SPAWN_RATE = 500;
var ARKLET_UPPER_BOUND = 40;
var ARKLET_LOWER_BOUND = 20;
var ARKLET_SIZE = 1;

// Update global variables from nav bar
function updateGlobals() {
   EARTH_SIZE  = parseFloat($('input[name=earth_size]').val());
   NUM_ARKLETS = parseFloat($('input[name=num_arklets]').val());
   BOLIDE_SIZE = parseFloat($('input[name=bolide_size]').val());
   BOLIDE_SPEED = parseFloat($('input[name=bolide_speed]').val());
   BOLIDE_SPAWN_RATE = parseFloat($('input[name=bolide_spawn_rate]').val());
   IZZY_SHIELD = parseFloat($('input[name=izzy_shield_size]').val());
   ARKLET_UPPER_BOUND = parseFloat($('input[name=arklet_upper_bound]').val());
   ARKLET_LOWER_BOUND = parseFloat($('input[name=arklet_lower_bound]').val());
   ARKLET_SIZE = parseFloat($('input[name=arklet_size]').val());
}

//------------------------------------------------------------------------------

// Create Earth
function createEarth(EARTH_SIZE, scene){
   var Earth = BABYLON.Mesh.CreateSphere("Earth", 10, EARTH_SIZE, scene);
   var earthMat = new BABYLON.StandardMaterial("earthMat", scene);
   earthMat.diffuseTexture = new BABYLON.Texture("images/Earth.jpg", scene);
   earthMat.specularColor = new BABYLON.Color3(0,0,0);
   Earth.material = earthMat;
   Earth.checkCollisions = true;
   
   EARTH_ARRAY[0] = Earth;
   return Earth;
}

// Delete Earth
function deleteEarth(){
   EARTH_ARRAY[0].dispose();
   EARTH_ARRAY = [];
}

//------------------------------------------------------------------------------

// Create Bolides
var createBolide = function(){
   function pairBolide(scene, par){
      BABYLON.SceneLoader.ImportMesh("", "models/rock/", "roca.babylon", scene, function (newMeshes) {
         for(var i in newMeshes){
            newMeshes[i].parent = par;
         }
      });
   }

   var bb = new BABYLON.StandardMaterial("bb", scene);
   //bb.emissiveColor = new BABYLON.Color3(1, 1, 1);
   //bb.wireframe = true;
   
   var wire = BABYLON.Mesh.CreateSphere("wire", 1, 10, scene);
   wire.checkCollisions = true;
   wire.material = bb;
   wire.isVisible = false;
   wire.position.x = (Math.random() * 2000) - 1000 + (EARTH_SIZE*3);
   wire.position.y = (Math.random() * 2000) - 1000 + (EARTH_SIZE*3);
   wire.position.z = (Math.random() * 2000) - 1000 + (EARTH_SIZE*3);
   
   wire.velocity = new BABYLON.Vector3(Math.random() * BOLIDE_SPEED + .01, Math.random() * BOLIDE_SPEED + .01, Math.random() * BOLIDE_SPEED + .01);
   wire.acceleration = BABYLON.Vector3.Zero();
   var size = (Math.random() * BOLIDE_SIZE) + 1;
   wire.scaling = new BABYLON.Vector3(size, size, size);

   ALL_BOLIDES.push(wire);
   pairBolide(scene, wire);
};

// Delete bolides
function deleteBolides(){
   for(var i in ALL_BOLIDES){
      ALL_BOLIDES[i].dispose();
   }
   ALL_BOLIDES = [];
}

//------------------------------------------------------------------------------

// Create Izzy
function spawnIzzy(Earth, EARTH_SIZE, scene){
   function createIzzy(scene, par){
      BABYLON.SceneLoader.ImportMesh("", "models/Izzy/", "Shipyard-Desolator1.babylon", scene, function (newMeshes) {
         for(var i in newMeshes){
            newMeshes[i].parent = par;
         }
      });
   }
   
   var bbizzym = new BABYLON.StandardMaterial("bbizzym", scene);
   bbizzym.diffuseColor = new BABYLON.Color3(.25, 1, .25);
   bbizzym.specularColor = new BABYLON.Color3(0, 0, 0);
   bbizzym.alpha = 0.1;
   //bbizzym.wireframe = true;
    
   var sphereIzzy = BABYLON.Mesh.CreateSphere("izzy", 10, IZZY_SHIELD, scene);
   sphereIzzy.checkCollisions = true;
   sphereIzzy.material = bbizzym;
   sphereIzzy.position.x = EARTH_SIZE/2 + 15;
   sphereIzzy.parent = Earth;
   sphereIzzy.scaling = new BABYLON.Vector3(EARTH_SIZE/100, EARTH_SIZE/100, EARTH_SIZE/100);
   //sphereIzzy.isVisible = false;
   
   IZZY_ARRAY[0] = sphereIzzy;
   createIzzy(scene, sphereIzzy)
   
   return IZZY_ARRAY[0];
}

//------------------------------------------------------------------------------

// Create Arklets
function spawnArklets(sphereIzzy, ALL_ARKLETS, NUM_ARKLETS, scene, ARKLET_SIZE){
   function createArklets(scene, par){
      BABYLON.SceneLoader.ImportMesh("", "models/Arklet/", "sperm ship.babylon", scene, function (newMeshes) {
         for(var i in newMeshes){
            newMeshes[i].parent = par;
         }
      });
   }

   for(i=0; i<NUM_ARKLETS; ++i){
      var bbarklet = new BABYLON.StandardMaterial("bbarklet", scene);
      //bbarklet.emissiveColor = new BABYLON.Color3(1, 1, 1);
      //bbarklet.wireframe = true;
      
      var sphereArklet = BABYLON.Mesh.CreateSphere("arklet", 1, 3, scene);
      sphereArklet.checkCollisions = true;
      sphereArklet.isVisible = false;
      sphereArklet.material = bbarklet;
      sphereArklet.scaling = new BABYLON.Vector3(ARKLET_SIZE, ARKLET_SIZE, ARKLET_SIZE);
      sphereArklet.rotation.y = Math.PI;
      sphereArklet.position.x = (Math.random() * 10) - 5;
      sphereArklet.position.y = (Math.random() * 10) - 5;
      sphereArklet.position.z = Math.random()      - 25;
      sphereArklet.velocity = new BABYLON.Vector3(Math.random() * 0.1 + .01, Math.random() * 0.1 + .01, Math.random() * 0.1 + .01);
      sphereArklet.acceleration = BABYLON.Vector3.Zero();
      sphereArklet.parent = sphereIzzy;
      //sphereArklet.isVisible = false;
      
      ALL_ARKLETS[i] = sphereArklet;
      createArklets(scene, sphereArklet);
   }
}

// Update Arklets movement
function updateFlight(aa, sphereIzzy){
   // bounds of box where arklets can travel
   if(aa.position.z > sphereIzzy.position.z-ARKLET_LOWER_BOUND || aa.position.z < sphereIzzy.position.z-ARKLET_UPPER_BOUND){
      aa.velocity.z *= -1
   }
   if(aa.position.y > (sphereIzzy.position.y + 5) || aa.position.y < (sphereIzzy.position.y - 5)) {
      aa.velocity.y *= -1 
   }
   aa.position.y += aa.velocity.y;
   aa.position.z += aa.velocity.z;
}

// Delete Arklets
function deleteArklets(){
   for(var i in ALL_ARKLETS){
      ALL_ARKLETS[i].dispose();
   }
   ALL_ARKLETS = [];
}

// number of arklets left
function arklet_label(){
   var label1 = BABYLON.Mesh.CreatePlane("Plane", 10.0, scene);
   label1.material = new BABYLON.StandardMaterial("label1", scene);
   label1.scaling.y = 0.5;
   label1.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
   label1.position.y = IZZY_ARRAY[0].position.y+15;
   label1.parent = IZZY_ARRAY[0];
   var label1Texture = new BABYLON.DynamicTexture("dt1", 512, scene, true);
   label1.material.diffuseTexture = label1Texture;
   label1.material.specularColor = new BABYLON.Color3(0, 0, 0);
   label1.material.backFaceCulling = true;
   
   window.lt = label1Texture;
   window.lt.drawText(NUM_ARKLETS, null, 350, "bold 250px verdana", "red", "teal");
}


//------------------------------------------------------------------------------


// render everything on page load
$(document).ready(function() {
// INITIALIZE 
   var canvas = document.getElementById("canvas");
   var engine = new BABYLON.Engine(canvas, true);
   scene = new BABYLON.Scene(engine);
   scene.clearColor = new BABYLON.Color3(0, 0, .05);
   var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
   var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, EARTH_SIZE+50, BABYLON.Vector3.Zero(), scene);
   camera.attachControl(canvas, false);
   scene.collisionsEnabled = true;
   var music = new BABYLON.Sound("music", "music/interstellar.mp3", scene, null, { loop: true, autoplay: true });
 
// SKYBOX
   var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
   var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
   skyboxMaterial.backFaceCulling = false;
   skyboxMaterial.disableLighting = true;
   skybox.material = skyboxMaterial;
   skybox.infiniteDistance = true;
   skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
   skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/spaceTexture/skybox", scene);
   skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
   

// SPAWN EARTH
   var Earth = createEarth(EARTH_SIZE, scene);
   
// SPAWN BOLIDES
   refreshIntervalId = setInterval(createBolide, BOLIDE_SPAWN_RATE);

// SPAWN IZZY
   var sphereIzzy = spawnIzzy(Earth, EARTH_SIZE, scene);

// SPAWN ARKLETS
   spawnArklets(sphereIzzy, ALL_ARKLETS, NUM_ARKLETS, scene, ARKLET_SIZE);
   
// ARKLET LABEL   
   arklet_label();
   
   
//------------------------------------------------------------------------------


// start time
timecount();
function timecount(){
   var secondsLabel = document.getElementById("seconds");
   totalSeconds = 0;
   setInterval(setTime, 1000);
   
   function setTime()
   {
      ++totalSeconds;
      secondsLabel.innerHTML = pad(totalSeconds);
   }
   
   function pad(val)
   {
      var valString = val + "";
      if(valString.length < 2)
      {
          return "TIME: 0" + valString;
      }
      else
      {
          return valString;
      }
   }
}


// RESTART BUTTON
   $("#restart").click(function() {
      // restart certain variables
      timecount();
      NUM_ARKLETS = parseFloat($('input[name=num_arklets]').val());
      clearInterval(refreshIntervalId);
      
   // RECREATE EARTH
      deleteEarth();
      var Earth = createEarth(EARTH_SIZE, scene);
      Earth.rotation.y = Math.PI/2;
   
   // RECREATE IZZY
      var sphereIzzy = spawnIzzy(Earth, EARTH_SIZE, scene);
      
   // RECREATE ARKLETS
      deleteArklets();
      spawnArklets(sphereIzzy, ALL_ARKLETS, NUM_ARKLETS, scene, ARKLET_SIZE);
      
   // RECREATE BOLIDES
      deleteBolides();
      setInterval(createBolide, BOLIDE_SPAWN_RATE);

      arklet_label();
      
   // RENDER
      scene.beforeRender = function() {
         Earth.rotation.y -=0.01;
         sphereIzzy.position.x += .01;
      };
   });

//------------------------------------------------------------------------------

// POI
var pointToIntersect = new BABYLON.Vector3(5, -5, 0);

// RENDER
   engine.runRenderLoop(function() {
      
      // if no more arklets, clear all
      if(NUM_ARKLETS<=0){
         clearInterval(refreshIntervalId);
         deleteEarth();
         deleteArklets();
         deleteBolides();
         
         var l = BABYLON.Mesh.CreatePlane("Plane", 50.0, scene);
         l.material = new BABYLON.StandardMaterial("label1", scene);
         l.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
         var ltt = new BABYLON.DynamicTexture("dt1", 512, scene, true);
         l.material.diffuseTexture = ltt;
         l.material.specularColor = new BABYLON.Color3(0, 0, 0);
         l.material.backFaceCulling = true;
         window.lt = ltt;
         window.lt.drawText(totalSeconds + " seconds", null, 250, "bold 50px verdana", "red", "teal");
      }
      
      // if bolide intersects with izzy or center, dispose
      for(var qq in ALL_BOLIDES){
         if(ALL_BOLIDES[qq].intersectsMesh(IZZY_ARRAY[0], false)){
            ALL_BOLIDES[qq].dispose();
         }
         
         if (ALL_BOLIDES[qq].intersectsPoint(pointToIntersect)){
            ALL_BOLIDES[qq].dispose();
         }
      }
      
      Earth.rotation.y -=0.01;
      sphereIzzy.position.x += .01;
      
      updateGlobals();
      
      // Updates flights for every arklet in ALL_ARKLETS
      for(var i in ALL_ARKLETS){
         updateFlight(ALL_ARKLETS[i], sphereIzzy);
      }
      
      // move bolide position
      ALL_BOLIDES.forEach( function(bol) {
         if(bol.position.x >= bol.position.y && bol.position.x>=bol.position.z){
           var bolMoveX = bol.position.x / bol.position.x;
           var bolMoveY = bol.position.y / bol.position.x;
           var bolMoveZ = bol.position.z / bol.position.x;
         }
         else if(bol.position.y >= bol.position.z){
           var bolMoveX = bol.position.x / bol.position.y;
           var bolMoveY = bol.position.y / bol.position.y;
           var bolMoveZ = bol.position.z / bol.position.y;
         }
         else{
           var bolMoveX = bol.position.x / bol.position.z;
           var bolMoveY = bol.position.y / bol.position.z;
           var bolMoveZ = bol.position.z / bol.position.z;
         }
         
         if  (bol.position.x !=0)
           bol.position.x -= bolMoveX*BOLIDE_SPEED;
         
         if  (bol.position.y !=0)
           bol.position.y -= bolMoveY*BOLIDE_SPEED;
         if  (bol.position.z !=0)
           bol.position.z -= bolMoveZ*BOLIDE_SPEED;
      });
      
      // arklet collision with bolide
      for(var aa in ALL_ARKLETS){
         for(var ab in ALL_BOLIDES){
            if (ALL_ARKLETS[aa].intersectsMesh(ALL_BOLIDES[ab], true)) {
               NUM_ARKLETS -= 1;
               ALL_ARKLETS[aa].dispose();
               window.lt.drawText(NUM_ARKLETS, null, 350, "bold 250px verdana", "red", "teal");
            }
         }
      }
      
      scene.render();
   });
   
   $(window).resize(function() {
      engine.resize();
   });
   
});