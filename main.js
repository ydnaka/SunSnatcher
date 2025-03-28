//Sun Snatcher - Final Demo Version
//Project by Andy Kasbarian, Dean Ali, Htet Min Khant, and Jack Criminger
//For CS 174A - Winter 2025

//NOTE: Please run the project with a refresh rate of 60 Hz.
//Other configurations will cause unwanted effects

/* To be done:
 - Implement levels!
*/

/* Scene & camera setup */

//Imports three.js for 3D graphics & animation
import * as THREE from 'three';
//Imports Orbit Controls for camera control
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//Imports shininess for materials
import { shininess } from 'three/tsl';

//Creates the scene for our project
const scene = new THREE.Scene();

//The camera and renderer are necessary to render our scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
//Append the renderer to the DOM so that it is displayed on the webpage
document.body.appendChild(renderer.domElement);

//Declare OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
//Declare camera position
camera.position.set(0, 5, 10);
//Declare camera target
controls.target.set(0, 5, 0);

/* Level selector initialization */

//Sets our current level to 1
let currentLevel = 1;
//We have 10 levels, so the maximum level is 10
let maxLevels = 5;
//The game state starts as "playing"
//other gamestates are "transition" and "complete"
let gameState = "playing";

//The transition timer is used to count down 3 seconds before the next level begins
let transitionTimer = 0;
//This defines the duration of the transition timer.
let transitionDuration = 3; 

//The following code creates visible X, Y, and Z axes. We do not need it in the final project
/*
const createAxisLine = (color, start, end) => {
	const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
	const material = new THREE.LineBasicMaterial({ color: color });
	return new THREE.Line(geometry, material);
};
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0));
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0));
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3));
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);
*/

/* Texture & material declarations */

//Grass texture - for the ground
//Load grass texture
const grassTexture = new THREE.TextureLoader().load('textures/grass.png');
//Allow texture to wrap
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
//Set texture repeat range - fills in more texture units in the same area
grassTexture.repeat.set(16,16); 

//Red Brick texture
const redBrickTexture = new THREE.TextureLoader().load('textures/redbrick.png');
redBrickTexture.wrapS = THREE.RepeatWrapping;
redBrickTexture.wrapT = THREE.RepeatWrapping;
redBrickTexture.repeat.set(0.5,0.5);

//Yellow Brick texture
const yellowBrickTexture = new THREE.TextureLoader().load('textures/redbrick.png');
yellowBrickTexture.wrapS = THREE.RepeatWrapping;
yellowBrickTexture.wrapT = THREE.RepeatWrapping;
yellowBrickTexture.repeat.set(0.5,0.5);

//Blue Brick texture
const blueBrickTexture = new THREE.TextureLoader().load('textures/whitebrick.png');
blueBrickTexture.wrapS = THREE.RepeatWrapping;
blueBrickTexture.wrapT = THREE.RepeatWrapping;
blueBrickTexture.repeat.set(0.5,0.5);

//Sun Shard texture
const sunTexture = new THREE.TextureLoader().load('textures/sun.png');
sunTexture.wrapS = THREE.RepeatWrapping;
sunTexture.wrapT = THREE.RepeatWrapping;
sunTexture.repeat.set(0.5,0.5);

//Create Red Brick material
const red_material = new THREE.MeshPhongMaterial({
    color: 0x9f0000, // Red color
    shininess: 50,   // Shininess of the material
	map: redBrickTexture //Mapped texture
});
//Blue Brick material
const blue_material = new THREE.MeshPhongMaterial({
    color: 0x0082ff, // Blue color
    shininess: 50,
	map: blueBrickTexture   
});
//Yellow Brick Material
const yellow_material = new THREE.MeshPhongMaterial({
    color: 0xffff00, // Yellow color
    shininess: 50,
	map: yellowBrickTexture   
});
//Grass Material
const grass_material = new THREE.MeshPhongMaterial({
    color: 0x00f200, // Green color
    shininess: 100,  
	map: grassTexture 
});
//Sun Material
const sun_material = new THREE.MeshBasicMaterial({
    color: 0xff8800, // orange-ish color
	map: sunTexture
});

/* Create scene objects */

//Ambient light - lights up everything even when there are no other light sources
//This is so we can see in the dark
const ambientLight = new THREE.AmbientLight(0x404040);  // Soft white light
//Add the ambient light to the scene
scene.add(ambientLight);

//Length/size of bricks from the center of each face
const l = 0.6;
//Each block will be 2l x 2l x 2l
const cube_geometry = new THREE.BoxGeometry(2 * l, 2 * l, 2 * l);

//This just defines the wireframe cube's lines for each face.
const wirecube_vertices = new Float32Array([
	-l, -l, l,
	l, -l, l,
	l, -l, l,
	l, l, l,
	l, l, l,
	-l, l, l,
	-l, l, l,
	-l, -l, l,

	-l, -l, -l,
	-l, -l, l,
	-l, -l, l,
	-l, l, l,
	-l, l, l,
	-l, l, -l,
	-l, l, -l,
	-l, -l, -l,

	-l, l, l,
	l, l, l,
	l, l, l,
	l, l, -l,
	l, l, -l,
	-l, l, -l,
	-l, l, -l,
	-l, l, l,

	-l, -l, -l,
	l, -l, -l,
	l, -l, -l,
	l, -l, l,
	l, -l, l,
	-l, -l, l,
	-l, -l, l,
	-l, -l, -l,

	l, -l, l,
	l, -l, -l,
	l, -l, -l,
	l, l, -l,
	l, l, -l,
	l, l, l,
	l, l, l,
	l, -l, l,

	l, -l, -l,
	-l, -l, -l,
	-l, -l, -l,
	-l, l, -l,
	-l, l, -l,
	l, l, -l,
	l, l, -l,
	l, -l, -l
]);

//Create wireframe cube geometry based on the defined lines/vertices
const wirecube_geometry = new THREE.BufferGeometry();
wirecube_geometry.setAttribute('position', new THREE.BufferAttribute(wirecube_vertices, 3));

// Create sun shard geometry
const sun_shard_geometry = new THREE.OctahedronGeometry();
const sun_wire_geometry = new THREE.TetrahedronGeometry(1);

//Define Hakkun model geometry
//Load Hakkun's head (face) texture
const hakkunHeadTexture = new THREE.TextureLoader().load('textures/hakkunfaceALT.png');
hakkunHeadTexture.wrapS = THREE.RepeatWrapping;
hakkunHeadTexture.wrapT = THREE.RepeatWrapping;
//hakkunHeadTexture.repeat.set(0.5,0.5);

//Define Hakkun's head geometry
const hakkun_head_geometry = new THREE.SphereGeometry(0.5, 6, 6);
//Define Hakkun's head material
const hakkun_head_material = new THREE.MeshPhongMaterial({
	transparent: true,
	opacity: 0.8, //Shoudn't be fully opaque
	shininess: 100, //Shininess
	color: 0xffffff, //Color = white initially
	map: hakkunHeadTexture // Map as HakkunHeadTexture
});
//Define Hakkun's body geometry
const hakkun_body_geometry = new THREE.SphereGeometry(0.55, 6.5, 6.5);
//Define Hakkun's body material
const hakkun_body_material = new THREE.MeshPhongMaterial({
	transparent: true,
	opacity: 0.8,
	shininess: 100,
	color: 0xffffff
});

//Define Hakkun's nose geometry
const hakkunNoseGeometry = new THREE.ConeGeometry(0.1, 0.8);
//Same material is used for nose and arms
const hakkunNoseArmsMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000 //Black
});
//Create & position Hakkun's nose
const hakkunNose = new THREE.Mesh(hakkunNoseGeometry, hakkunNoseArmsMaterial);
hakkunNose.rotateZ(Math.PI * 1.5);
hakkunNose.translateY(0.8);

//Define Hakkun's arm geometry
const armGeometry = new THREE.CapsuleGeometry(0.15, 0.2, 3, 3);

//Create & position Hakkun's arms
const rightArm = new THREE.Mesh(armGeometry, hakkunNoseArmsMaterial);
rightArm.translateZ(0.5);
rightArm.rotateX(-0.4);
const leftArm = new THREE.Mesh(armGeometry, hakkunNoseArmsMaterial);
leftArm.translateZ(-0.55);
leftArm.rotateX(0.4);

//Define a point light at Hakkun's position
//Hakkun slightly lights up his surroundings
const HakkunLight = new THREE.PointLight(0xffffff, 0.5, 100);
HakkunLight.translateY(-0.1);

// Create Hakkun's head
const hakkun_head = new THREE.Mesh(hakkun_head_geometry, hakkun_head_material);
hakkun_head.translateY(1.0);

//Create Hakkun's body
const hakkun_body = new THREE.Mesh(hakkun_body_geometry, hakkun_body_material);
//Add Hakkun's body to the scene
scene.add(hakkun_body);
//Attach Hakkun's arms & point light to his body
hakkun_body.add(leftArm);
hakkun_body.add(rightArm);
hakkun_body.add(HakkunLight);
//Attach Hakkun's head to his body
hakkun_body.add(hakkun_head);
//Attach Hakkun's nose to his head
hakkun_head.add(hakkunNose);

//Define the level plane geometry
const level_plane_geometry = new THREE.PlaneGeometry(100, 100);
//Create the level plane
let level = new THREE.Mesh(level_plane_geometry, grass_material);
//Position the level plane to make it flat on the ground
level.matrixAutoUpdate = false;
level.matrix.copy(rotationMatrixX(3 * Math.PI / 2));
//Add level to the scene
scene.add(level);
level.material.color.setRGB(0, 1, 0);

/* Level configurations */
const levelConfigurations = [
  // Level 1
  {
    hakkunStartPosition: { x: -2, y: 1, z: 14 },
	hakkunStartAngle: 0,
    blockPositions: [ {x: -3, y: 0.61, z: 1, color: "white"} ],
    potPosition: { x: 0, y: 0, z: 9 }, 
    potColor: 0xff0000, 
    sunPosition: { x: -3, y: 10, z: -2 },
	levelLighting: 0x303030,
	levelBackground: "textures/background.png",

    goalCondition: function() {
        // Check distance between Hakkun and the sun shard
        const distance = Math.sqrt(
            Math.pow(hakkunX - shardPos[0], 2) +
            Math.pow(hakkunY - shardPos[1], 2) +
            Math.pow(hakkunZ - shardPos[2], 2)
        );

        return distance < 1.5; // Complete level when close enough to the sun shard
    },

    message: "Level 1 complete! You have found the Sun Shard!"
  },
  
  // Level 2
  {
    hakkunStartPosition: { x: -2, y: 1, z: 13 },
	hakkunStartAngle: 0,
    blockPositions: [ {x: 0, y: 0.61, z: 0, color: "red"},
	                  {x: 0, y: 6.61, z: -2, color: "white"}],
    potPosition: { x: -5, y: 0, z: 4 }, 
    potColor: 0x0000ff, 
    sunPosition: { x: 10 , y: 8, z: -2 },
	levelLighting: 0x505050,
	levelBackground: "textures/background2.png",

    goalCondition: function() {
        // Check distance between Hakkun and the sun shard
        const distance = Math.sqrt(
            Math.pow(hakkunX - shardPos[0], 2) +
            Math.pow(hakkunY - shardPos[1], 2) +
            Math.pow(hakkunZ - shardPos[2], 2)
        );

        return distance < 1.5; // Complete level when close enough to the sun shard
    },

    message: "Level 2 complete! You have found the Sun Shard!"
     
  },
  
  // Level 3
  {
	hakkunStartPosition: { x: -11.25, y: 17, z: 0 },
	hakkunStartAngle: 1.56,
    blockPositions: [{x: -8, y: 15.61, z: 0, color: "white"},
	                 {x: 0, y: 15.61, z: 1.25, color: "white"},
					 {x: 8, y: 15.61, z: 0, color: "white"},
					 //Platform
					 {x: -12.5, y: 15.61, z: -1.25, color: "white"},
					 {x: -11.25, y: 15.61, z: -1.25, color: "white"},
					 {x: -10, y: 15.61, z: -1.25, color: "white"},
					 {x: -12.5, y: 15.61, z: 0, color: "white"},
					 {x: -11.25, y: 15.61, z: 0, color: "white"},
					 {x: -10, y: 15.61, z: 0, color: "white"},
					 {x: -12.5, y: 15.61, z: 1.25, color: "white"},
					 {x: -11.25, y: 15.61, z: 1.25, color: "white"},
					 {x: -10, y: 15.61, z: 1.25, color: "white"},],
    potPosition: { x: -10, y: 16.25, z: -1.25 }, 
    potColor: 0x0000ff, 
    sunPosition: { x: 17, y: 18, z: 0 }, 
	levelLighting: 0x808080,
	levelBackground: "textures/background3.png",

    goalCondition: function() {
        // Check distance between Hakkun and the sun shard
        const distance = Math.sqrt(
            Math.pow(hakkunX - shardPos[0], 2) +
            Math.pow(hakkunY - shardPos[1], 2) +
            Math.pow(hakkunZ - shardPos[2], 2)
        );
        return distance < 1.5; // Complete level when close enough to the sun shard
    },

    message: "Level 3 complete! You have found the Sun Shard!"
    
  },

  // Level 4
  {
	hakkunStartPosition: { x: 27, y: 1, z: 12 },
	hakkunStartAngle: -1.35,
    blockPositions: [{x: 7, y: 0.61, z: 0, color: "white"},
					 {x: -1, y: 6.61, z: 0, color: "white"},
					 {x: -9, y: 12.61, z: 0, color: "white"}],
    potPosition: { x: 15, y: 0, z: 3 }, 
    potColor: 0xffff00, 
    sunPosition: { x: -17, y: 21, z: 0 }, 
	levelLighting: 0xB0B0B0,
	levelBackground: "textures/background4.png",

    goalCondition: function() {
        // Check distance between Hakkun and the sun shard
        const distance = Math.sqrt(
            Math.pow(hakkunX - shardPos[0], 2) +
            Math.pow(hakkunY - shardPos[1], 2) +
            Math.pow(hakkunZ - shardPos[2], 2)
        );
        return distance < 1.5; // Complete level when close enough to the sun shard
    },

    message: "Level 4 complete! You have found the Sun Shard!"
     
  },
  
  // Level 5
  {
	hakkunStartPosition: { x: -10, y: 17, z: 17.25 },
	hakkunStartAngle: 0,
    blockPositions: [{x: -10, y: 15.61, z: 17.25, color: "white"},
					 {x: -10, y: 15.61, z: 16, color: "white"},
					 {x: -10, y: 15.61, z: 14.75, color: "white"},
					 {x: -10, y: 15.61, z: 13.5, color: "white"},
					 {x: -10, y: 15.61, z: 12.25, color: "white"},
					 {x: -10, y: 15.61, z: 11, color: "white"},
					 //left path
					 {x: -11.25, y: 15.61, z: 11, color: "white"},
					 {x: -12.5, y: 15.61, z: 11, color: "white"},
					 {x: -13.75, y: 15.61, z: 11, color: "white"},
					 {x: -13.75, y: 15.61, z: 9.75, color: "white"},
					 {x: -13.75, y: 15.61, z: 8.5, color: "white"},
					 {x: -13.75, y: 15.61, z: 7.25, color: "white"},
					 //platform with pot
					 {x: -15, y: 15.61, z: 6, color: "white"},
					 {x: -13.75, y: 15.61, z: 6, color: "white"},
					 {x: -12.5, y: 15.61, z: 6, color: "white"},
					 {x: -15, y: 15.61, z: 4.75, color: "white"},
					 {x: -13.75, y: 15.61, z: 4.75, color: "white"},
					 {x: -12.5, y: 15.61, z: 4.75, color: "white"},
					 {x: -15, y: 15.61, z: 3.5, color: "white"},
					 {x: -13.75, y: 15.61, z: 3.5, color: "white"},
					 {x: -12.5, y: 15.61, z: 3.5, color: "white"},
					 //Right path
					 {x: -8.75, y: 15.61, z: 11, color: "white"},
					 {x: -7.5, y: 15.61, z: 11, color: "white"},
					 {x: -6.25, y: 15.61, z: 11, color: "white"},
					 {x: -6.25, y: 15.61, z: 9.75, color: "white"},
					 {x: -6.25, y: 15.61, z: 8.5, color: "white"},
					 {x: -6.25, y: 15.61, z: 7.25, color: "white"},
					 {x: -6.25, y: 15.61, z: 6, color: "white"},
					 //Moving block
					 {x: -6.25, y: 15.61, z: 4, color: "red"},
					 {x: -6.25, y: 21.61, z: 2, color: "white"}],
    potPosition: { x: -13.75, y: 16.25, z: 4.75 }, 
    potColor: 0xffff00, 
    sunPosition: { x: -13.5, y: 27, z: 1 }, 
	levelLighting: 0xFFFFFF,
	levelBackground: "textures/background5.png",

    goalCondition: function() {
        // Check distance between Hakkun and the sun shard
        const distance = Math.sqrt(
            Math.pow(hakkunX - shardPos[0], 2) +
            Math.pow(hakkunY - shardPos[1], 2) +
            Math.pow(hakkunZ - shardPos[2], 2)
        );
        return distance < 1.5; // Complete level when close enough to the sun shard
    },

    message: "Level 5 complete! You have found the Sun Shard!"
    
  },

];

//Declare SunShard
let sunShard = new THREE.Mesh(sun_shard_geometry, sun_material);
let sunWire = new THREE.LineSegments(sun_wire_geometry);
//SunShard has a light as well
let sunLight = new THREE.PointLight(0xffffaa, 50, 200);
sunShard.matrixAutoUpdate = false;
sunWire.matrixAutoUpdate = false;
//Add sunshard to scene; its position is updated later
scene.add(sunShard);
scene.add(sunWire);
scene.add(sunLight);

//Create Pot geometry
const potBodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
const potRimGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32);
//Create Pot material with specified color
const potMaterial = new THREE.MeshBasicMaterial();
potMaterial.color.set(levelConfigurations[currentLevel-1].potColor);
const potBody = new THREE.Mesh(potBodyGeometry, potMaterial);
const potRim = new THREE.Mesh(potRimGeometry, potMaterial);

potRim.position.y = 0.35;
//The pot is always the same pot on scene. We just change its color and position
const pot = new THREE.Group();
pot.add(potBody);
pot.add(potRim);

pot.position.set(levelConfigurations[currentLevel-1].potPosition.x,
				 levelConfigurations[currentLevel-1].potPosition.y,
				 levelConfigurations[currentLevel-1].potPosition.z);

scene.add(pot);

//Transformation Matrices
function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}
function rotationMatrixX(theta) {
	return new THREE.Matrix4().set(
		1, 0, 0, 0,
		0, Math.cos(theta), -Math.sin(theta), 0,
		0, Math.sin(theta), Math.cos(theta), 0,
		0, 0, 0, 1
	);
}
function rotationMatrixY(theta) {
	return new THREE.Matrix4().set(
		Math.cos(theta), 0, Math.sin(theta), 0,
		0, 1, 0, 0,
		-Math.sin(theta), 0, Math.cos(theta), 0,
		0, 0, 0, 1
	);
}
function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
		Math.cos(theta), -Math.sin(theta), 0, 0,
		Math.sin(theta), Math.cos(theta), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	);
}
function scalingMatrix(sx, sy, sz) {
	return new THREE.Matrix4().set(
		sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, sz, 0,
		0, 0, 0, 1
	);
}

//Declare animation time
//Animation time counts the real seconds passed
let animation_time = 0;
let delta_animation_time;
//Define clock
const clock = new THREE.Clock();

//Set Hakkun's initial positions
let hakkunX = levelConfigurations[currentLevel - 1].hakkunStartPosition.x;
let hakkunY = levelConfigurations[currentLevel - 1].hakkunStartPosition.y;
let hakkunZ = levelConfigurations[currentLevel - 1].hakkunStartPosition.z;
//Hakkun's angle initially faces forward
let hakkunAngle = 0;
//Hakkun's X, Y, and Z velocity
let hakkunXV = 0;
let hakkunZV = 0;
let hakkunYV = 0;
//Is Hakkun jumping?
let isJumping = false;
//Is Hakkun on (a) ground?
let onGround = false;
//Is Hakkun on a block?
let onBlock = false;
//Gravity that applies to Hakkun
const gravity = 0.02;
const gravity1 = 0.004;
//Hakkun's Jump velocity
const jumpVelocity = 0.3;

// W, A, S, D, Q, E, "space", c, x
let pressedKeys = [false, false, false, false, false, false, false, false, false, false];
const hakkunA = 0.003;

//Place sun shard based on defined position in level
let shardPos = [levelConfigurations[currentLevel - 1].sunPosition.x,
			      levelConfigurations[currentLevel - 1].sunPosition.y,
				  levelConfigurations[currentLevel - 1].sunPosition.z];

/* Block motion functions */

function yellow_move(yellowblock, startTime, startX, startY, startZ) {
	let t = (animation_time - startTime);
	let Range = 3;
	yellowblock.position.x = startX - (Range) * (1 - Math.cos(Math.PI * t / 2));
	yellowblock.position.y = startY + (Range) * (1 - Math.cos(Math.PI * t / 2));
	yellowblock.position.z = startZ;
}
function red_move(redblock, startTime, startX, startY, startZ) {
	let t = (animation_time - startTime);
	let Range = 3;
	redblock.position.x = startX;
	redblock.position.y = startY + (Range) * (1 - Math.cos(Math.PI * t / 2));
	redblock.position.z = startZ;
}
function blue_move(blueblock, startTime, startX, startY, startZ) {
	let t = (animation_time - startTime);
	let Range = 4;
	blueblock.position.x = startX + (Range) * (1 - Math.cos(Math.PI * t / 3));
	blueblock.position.y = startY;
	blueblock.position.z = startZ;
}

//Defines what color block has which move function
const colorReference = {
	"yellow": yellow_move,
	"red": red_move,
	"blue": blue_move
};

// The distance threshold for blocks and pots
const blockDistanceThreshold = 1.2;
const potDistanceThreshold = 0.5;

//This is the array of blocks
let blocks = []
//This array contains all solid/colored blocks
let convertedBlocks = [];
//This is the index of the block with proximity to Hakkun
let closeBlockID = -1; //-1 means no block
//This function should be called every time a level is initialized
function blocksInitialize(levelID) {
	for (let i = 0; i < blocks.length; i++) {
		scene.remove(blocks[i].wire);
		delete blocks[i].wire;
		scene.remove(blocks[i].solid);
		delete blocks[i].solid;
	}
	blocks = [];
	convertedBlocks = [];
	closeBlockID = -1;
	for (let i = 0; i < levelConfigurations[levelID].blockPositions.length; i++){
		const color = levelConfigurations[levelID].blockPositions[i].color;
		const block_wire = new THREE.LineSegments(wirecube_geometry);
		block_wire.position.set(levelConfigurations[levelID].blockPositions[i].x,
								levelConfigurations[levelID].blockPositions[i].y,
								levelConfigurations[levelID].blockPositions[i].z);
		scene.add(block_wire);
		const block_solid = new THREE.Mesh(cube_geometry, new THREE.MeshPhongMaterial({
			color: 0xffffff,
			shininess: 100
		}));
		block_solid.position.copy(block_wire.position);
		block_solid.visible = false;
		
		blocks.push({wire: block_wire, solid: block_solid, isSolid: false, color: color });
		if (color != "white") {
			let hexColor;
			if (color == "red") { hexColor = 0xff0000; }
			else if (color == "yellow") { hexColor = 0xffff00; }
			else if (color == "blue") { hexColor = 0x0000ff; }
			blocks[i].wire.material.color.setHex(hexColor);
			closeBlockID = i;
			switchToSolid();
		}
	}
}

let musicStarted = false;

//This function switches a block from wireframe to solid when a color is injected
function switchToSolid() {
	if (closeBlockID != -1 && !blocks[closeBlockID].isSolid) {
		blocks[closeBlockID].solid.position.copy(blocks[closeBlockID].wire.position);
		blocks[closeBlockID].solid.material.color.copy(blocks[closeBlockID].wire.material.color);

		scene.add(blocks[closeBlockID].solid);

		blocks[closeBlockID].wire.visible = false;
		blocks[closeBlockID].solid.visible = true;

		blocks[closeBlockID].isSolid = true;

		const colorHex = blocks[closeBlockID].solid.material.color.getHex();
		if (colorHex === 0xff0000) {
			blocks[closeBlockID].solid.material = red_material;
			blocks[closeBlockID].color = "red";
		} else if (colorHex === 0xffff00) {
			blocks[closeBlockID].solid.material = yellow_material;
			blocks[closeBlockID].color = "yellow";
		} else if (colorHex === 0x0000ff) {
			blocks[closeBlockID].solid.material = blue_material;
			blocks[closeBlockID].color = "blue";
		}

		convertedBlocks.push({
			blockId: closeBlockID,
			mimicking: true,
			originalPosition: blocks[closeBlockID].solid.position.clone(),
			startTime: animation_time,
			fixedY: blocks[closeBlockID].solid.position.y
		});
	}
}

//We won't be switching any blocks to wireframe, so this isn't needed
/*
function switchToWireframe() {
	if (blockIsSolid) {

		block_wire.position.copy(block_solid.position);

		block_solid.visible = false;

		block_wire.visible = true;

		blockIsSolid = false;

		for (let i = 0; i < convertedBlocks.length; i++) {
			if (convertedBlocks[i].block === block_solid) {
				convertedBlocks.splice(i, 1);
				break;
			}
		}
	}
}
*/


//Function used to absorb colors from the pot
function checkProximityAndAbsorbColor() {
	//Get pot's position
	const potPosition = pot.position;
	//Calculate distance
	const distance = Math.sqrt(
		Math.pow(hakkunX - potPosition.x, 2) +
		Math.pow(hakkunY - potPosition.y, 2) +
		Math.pow(hakkunZ - potPosition.z, 2)
	);
	
	//If the distance is within the threshold
	if (distance < potDistanceThreshold) {
		const potTopY = pot.position.y + 0.4;
		//Make Hakkun stand on top of the pot
		if (hakkunY <= potTopY) {
			hakkunY = potTopY;
			hakkunYV = 0;
			onGround = true;
			isJumping = false;
		}
		//If the C key is pressed, absorb the color
		if (pressedKeys[7]) {
			const absorbedColor = potMaterial.color.getHex();
			hakkun_head.material.color.setHex(absorbedColor);
			hakkun_body.material.color.setHex(absorbedColor);
		}
	}
	else {
		//Affect Hakkun with gravity if he's not on top of the pot
		hakkunYV -= gravity;
		hakkunY += hakkunYV;
	}
}

//Function used to inject colors into blocks
function checkProximityAndInjectColor() {
	for (let i = 0; i < blocks.length; i++){
		const blockPosition = blocks[i].isSolid ? blocks[i].solid.position : blocks[i].wire.position;
		const distance = Math.sqrt(
			Math.pow(hakkunX - blockPosition.x, 2) +
			Math.pow(hakkunY - blockPosition.y, 2) +
			Math.pow(hakkunZ - blockPosition.z, 2)
		);
		if (distance < blockDistanceThreshold) {
			closeBlockID = i;
			const blockTopY = blockPosition.y + 0.6;
			if (hakkunY <= blockTopY && hakkunYV <= 0) {
				hakkunY = blockTopY;
				hakkunYV = 0;
				onGround = true;
				isJumping = false;
			}

			if (pressedKeys[8]) {
				const injectedColor = hakkun_head.material.color.getHex();
				if (injectedColor != 0xFFFFFF) {
					if (blocks[i].isSolid) {
						blocks[i].solid.material.color.setHex(injectedColor);
					} else {
						blocks[i].wire.material.color.setHex(injectedColor);
						switchToSolid();
					}

					const colorHex = injectedColor;
					if (colorHex === 0xff0000) {
						blocks[i].color = "red";
					} else if (colorHex === 0xffff00) {
						blocks[i].color = "yellow";
					} else if (colorHex === 0x0000ff) {
						blocks[i].color = "blue";
					}
				}
			}
		}
		else {
			onBlock = false;
		}
	}
}

function updateConvertedBlocksPositions() {
	for (let i = 0; i < convertedBlocks.length; i++) {
		const blockData = convertedBlocks[i];
		const block = blocks[blockData.blockId];
		const distance = Math.sqrt(
			Math.pow(hakkunX - block.solid.position.x, 2) +
			Math.pow(hakkunY - block.solid.position.y, 2) +
			Math.pow(hakkunZ - block.solid.position.z, 2)
		);
		//If Hakkun isn't trying to get off the block, move him with the block
		if (distance < blockDistanceThreshold && !(pressedKeys[0] || pressedKeys[1] || pressedKeys[2] || pressedKeys[3])){
			onBlock = true;
			hakkunX = block.solid.position.x;
			hakkunZ = block.solid.position.z;
		}

		const colorType = block.color;
		if (colorType === 0xff0000) {
			block.color = "red";
		} else if (colorType === 0xffff00) {
			block.color = "yellow";
		} else if (colorType === 0x0000ff) {
			block.color = "blue";
		}
		if (block.color && colorReference[block.color]) {
			const referenceFunction = colorReference[block.color];

			const offsetX = blockData.originalPosition.x;
			const offsetY = blockData.originalPosition.y;
			const offsetZ = blockData.originalPosition.z;
			
			referenceFunction(block.solid, blockData.startTime, offsetX, offsetY, offsetZ);
		}
	}
}


function createUIElements() {
  // Create a container for UI elements

  const uiContainer = document.createElement('div');
  uiContainer.id = 'uiContainer';
  uiContainer.style.position = 'absolute';
  uiContainer.style.top = '0';
  uiContainer.style.left = '0';
  uiContainer.style.width = '100%';
  uiContainer.style.height = '100%';
  uiContainer.style.display = 'flex';
  uiContainer.style.justifyContent = 'center';
  uiContainer.style.alignItems = 'center';
  uiContainer.style.pointerEvents = 'none';
  document.body.appendChild(uiContainer);
  
  // Create level info display
  const levelDisplay = document.createElement('div');
  levelDisplay.id = 'levelDisplay';
  levelDisplay.style.position = 'absolute';
  levelDisplay.style.top = '10px';
  levelDisplay.style.right = '10px';
  levelDisplay.style.padding = '10px';
  levelDisplay.style.backgroundColor = 'rgba(10, 9, 9, 0.5)';
  levelDisplay.style.color = 'white';
  levelDisplay.style.fontFamily = 'Arial, sans-serif';
  levelDisplay.style.borderRadius = '5px';
  levelDisplay.innerHTML = `Level: ${currentLevel}/${maxLevels}`;
  uiContainer.appendChild(levelDisplay);
  
  // Create goals display
  const goalsDisplay = document.createElement('div');
  goalsDisplay.id = 'goalsDisplay';
  goalsDisplay.style.position = 'absolute';
  goalsDisplay.style.bottom = '10px';
  goalsDisplay.style.left = '10px';
  goalsDisplay.style.padding = '10px';
  goalsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  goalsDisplay.style.color = 'white';
  goalsDisplay.style.fontFamily = 'Arial, sans-serif';
  goalsDisplay.style.borderRadius = '5px';
  goalsDisplay.style.maxWidth = '300px';
  updateGoalsDisplay();
  uiContainer.appendChild(goalsDisplay);
  
  // Create start screen
  const startScreen = document.createElement('div');
  startScreen.id = 'startScreen';
  startScreen.style.width = '100%';
  startScreen.style.height = '100%';
  startScreen.style.backgroundColor = 'rgba(50, 20, 90, 0.57)';
  startScreen.style.color = 'white';
  startScreen.style.display = 'none';
  startScreen.style.flexDirection = 'column';
  startScreen.style.justifyContent = 'center';
  startScreen.style.alignItems = 'center';
  startScreen.style.fontFamily = 'Arial, sans-serif';
  startScreen.style.fontSize = '32px';
  startScreen.style.textAlign = 'center';
  startScreen.innerHTML = '<div>Sun Snatcher</div> \
  <div style="margin-top: 20px; font-size: 24px;">Collect Sun Shards to restore \
  the Sun and light up the world.<br><br>Controls:<br>WASD - move Hakkun<br>\
  Q/E - rotate camera left/right<br>C - absorb color<br>X - inject color<br>\
  Mouse (orbit controls) - look around level<br>R - reset level<br><br>\
  Press any key to start the game</div>';
  uiContainer.appendChild(startScreen);
  
  // Create transition screen
  const transitionScreen = document.createElement('div');
  transitionScreen.id = 'transitionScreen';
  transitionScreen.style.width = '100%';
  transitionScreen.style.height = '100%';
  transitionScreen.style.backgroundColor = 'rgba(7, 7, 7, 0.87)';
  transitionScreen.style.color = 'white';
  transitionScreen.style.display = 'none';
  transitionScreen.style.flexDirection = 'column';
  transitionScreen.style.justifyContent = 'center';
  transitionScreen.style.alignItems = 'center';
  transitionScreen.style.fontFamily = 'Arial, sans-serif';
  transitionScreen.style.fontSize = '32px';
  transitionScreen.style.textAlign = 'center';
  transitionScreen.innerHTML = '<div>Level Complete!</div><div id="levelMessage" style="margin-top: 20px; font-size: 24px;"></div><div id="nextLevelCountdown" style="margin-top: 30px; font-size: 20px;"></div>';
  uiContainer.appendChild(transitionScreen);
  
  // Create game over screen
  const gameOverScreen = document.createElement('div');
  gameOverScreen.id = 'gameOverScreen';
  gameOverScreen.style.width = '100%';
  gameOverScreen.style.height = '100%';
  gameOverScreen.style.backgroundColor = 'rgba(25, 196, 25, 0.8)';
  gameOverScreen.style.color = 'white';
  gameOverScreen.style.display = 'none';
  gameOverScreen.style.flexDirection = 'column';
  gameOverScreen.style.justifyContent = 'center';
  gameOverScreen.style.alignItems = 'center';
  gameOverScreen.style.fontFamily = 'Arial, sans-serif';
  gameOverScreen.style.fontSize = '32px';
  gameOverScreen.innerHTML = '<div>Game Complete!</div><div style="margin-top: 30px; font-size: 24px;">You have finished all levels.</div><div style="margin-top: 30px; font-size: 20px;">Press R to restart the game</div>';
  uiContainer.appendChild(gameOverScreen);
}

createUIElements();
updateGoalsDisplay();

// 4. Add these level management functions
function updateGoalsDisplay() {
  const goalsDisplay = document.getElementById('goalsDisplay');
  if (!goalsDisplay) return;

  let goalText = "Goal: Unknown"; // Default in case of an issue

  if (currentLevel === 1) {
    goalText = "Hint: Red blocks move upward";
  } else if (currentLevel === 2) {
    goalText = "Hint: Blue blocks move sideways";
  } else if (currentLevel === 3) {
    goalText = "Hint: Don't fall!";
  } else if (currentLevel === 4) {
    goalText = "Hint: 'R' is your friend";
  } else if (currentLevel === 5) {
    goalText = "Hint: Tread carefully!";
  }

  goalsDisplay.innerHTML = goalText;
}

function initializeLevel(levelIndex) {
  const levelConfig = levelConfigurations[levelIndex - 1];

  currentLevel = levelIndex; 

  // Reset Hakkun position & color
  hakkun_head.material.color.setHex(0xFFFFFF);
  hakkun_body.material.color.setHex(0xFFFFFF);
  hakkunX = levelConfig.hakkunStartPosition.x;
  hakkunY = levelConfig.hakkunStartPosition.y;
  hakkunZ = levelConfig.hakkunStartPosition.z;
  hakkunAngle = levelConfig.hakkunStartAngle;
  hakkunXV = 0;
  hakkunZV = 0;
  hakkunYV = 0;
  isJumping = false;
  onGround = false;
  
  //Initialize ambient lighting
  ambientLight.color.setHex(levelConfig.levelLighting);
  
  //Loads the sky texture
  const sky_texture = new THREE.TextureLoader().load(levelConfig.levelBackground);
  //Sets the scene's background to the sky texture
  scene.background = sky_texture;
  //Sets the background intensity to 0.2 to make it more dim
  if (currentLevel == 5) {
	scene.backgroundIntensity = 1;  
  }
  else if (currentLevel == 4) {
	scene.backgroundIntensity = 0.7;  
  }
  else {
	scene.backgroundIntensity = 0.2;
  }
	
  //Place sun shard based on defined position in level
  shardPos = [levelConfig.sunPosition.x,
			  levelConfig.sunPosition.y,
		      levelConfig.sunPosition.z];
  
  //Reset the pot
  pot.position.set(levelConfig.potPosition.x,
				 levelConfig.potPosition.y,
				 levelConfig.potPosition.z);
  potMaterial.color.set(levelConfig.potColor);
  
  //Initialize blocks
  blocksInitialize(levelIndex - 1);
  
  // Update the level display UI immediately
  const levelDisplay = document.getElementById('levelDisplay');
  if (levelDisplay) {
    levelDisplay.innerHTML = `Level: ${currentLevel}/${maxLevels}`;
  }

  updateGoalsDisplay(); 
  gameState = "playing";
}

initializeLevel(currentLevel);
const startScreen = document.getElementById('startScreen');
startScreen.style.display = 'flex';

function checkLevelCompletion() {
  if (gameState !== "playing") return;
  
  const levelConfig = levelConfigurations[currentLevel - 1];
  if (levelConfig.goalCondition()) {
    completeLevel();
  }
}

function completeLevel() {
  if (currentLevel === maxLevels) { 
    gameState = "complete";

    const transitionScreen = document.getElementById('transitionScreen');
    if (transitionScreen) {
      transitionScreen.style.display = 'none';
    }

    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
      gameOverScreen.style.display = 'flex';
    }
  } else {
    gameState = "transition";
    transitionTimer = transitionDuration;
  }
}

//When this is called, the camera will center on Hakkun
function centerOnHakkun() {
	camera.position.set(hakkunX + -7 * Math.sin(hakkunAngle), hakkunY + 2, hakkunZ + 7 * Math.cos(hakkunAngle));
	controls.target.set(hakkunX, hakkunY, hakkunZ);
}
//This is the angle Hakkun is displayed facing
let hakkunDisplayAngle = (Math.PI / 2);

//Execute every frame
function animate() {
	//Handle screen resize:
	//Resize the renderer on every frame
	renderer.setSize(window.innerWidth, window.innerHeight);
	//Set the camera's aspect ratio every frame
	camera.aspect = window.innerWidth / window.innerHeight;
	//Update the camera's projection matrix
	camera.updateProjectionMatrix();
	
	//Render the scene
	renderer.render(scene, camera);
	//Update controls
	controls.update();
	//Advance the clock
	delta_animation_time = clock.getDelta();
	animation_time += delta_animation_time;

	// Handle different game states
	if (gameState === "playing") {
		// Existing game logic
		//If Hakkun isn't on a ground:
		if (!onGround) {
			//He is affected by gravity
			hakkunYV -= gravity1;
			hakkunY += hakkunYV;
			//The camera will also stick to him
			centerOnHakkun();
		}
		//If Hakkun is on a block, the camera will also stick to him
		if (onBlock){
			centerOnHakkun();
		}

		//Reset level
		if (pressedKeys[9]) {
			initializeLevel(currentLevel);
		}
		
		//If Hakkun is below the world's ground level
		if (hakkunY <= 0) {
			//Snap him up to the ground
			hakkunY = 0;
			hakkunYV = 0;
			onGround = true;
			isJumping = false;
		}
		//Jump logic
		if (pressedKeys[6] && onGround) {
			isJumping = true;
			onGround = false;
			hakkunYV = jumpVelocity;
			centerOnHakkun();
		}

		//HTML element to display Hakkun's position
		const positionInfo = document.getElementById("positionInfo");
		if (positionInfo) {
			positionInfo.innerHTML = `Position: X: ${hakkunX.toFixed(2)}, Y: ${hakkunY.toFixed(2)}, Z: ${hakkunZ.toFixed(2)}, A:${hakkunAngle.toFixed(2)}`;
		}

		//Hakkun's rotation
		if (pressedKeys[4]) {
			hakkunAngle -= 0.03;
			centerOnHakkun();
		}
		if (pressedKeys[5]) {
			hakkunAngle += 0.03;
			centerOnHakkun();
		}
		
		//Handle Hakkun's movement when keys are pressed
		hakkunXV = 0; hakkunZV = 0;
		if (pressedKeys[0]) {
			hakkunZV += -0.1 * Math.cos(hakkunAngle);
			hakkunXV += 0.1 * Math.sin(hakkunAngle);
			hakkunDisplayAngle = (Math.PI / 2);
			centerOnHakkun();
		}
		if (pressedKeys[1]) {
			hakkunZV += -0.1 * Math.sin(hakkunAngle);
			hakkunXV += -0.1 * Math.cos(hakkunAngle);
			hakkunDisplayAngle = (Math.PI);
			centerOnHakkun();
		}
		if (pressedKeys[2]) {
			hakkunZV += 0.1 * Math.cos(hakkunAngle);
			hakkunXV += -0.1 * Math.sin(hakkunAngle);
			hakkunDisplayAngle = -(Math.PI / 2);
			centerOnHakkun();
		}
		if (pressedKeys[3]) {
			hakkunZV += 0.1 * Math.sin(hakkunAngle);
			hakkunXV += 0.1 * Math.cos(hakkunAngle);
			hakkunDisplayAngle = 0;
			centerOnHakkun();
		}
		//Display Hakkun's angle correctly
		// <^ diagonal
		if (pressedKeys[0] && pressedKeys[1]) {
			hakkunDisplayAngle = (3 * Math.PI / 4);
		}
		// <v diagonal
		if (pressedKeys[2] && pressedKeys[1]) {
			hakkunDisplayAngle = -(3 * Math.PI / 4);
		}
		// v> diagonal
		if (pressedKeys[2] && pressedKeys[3]) {
			hakkunDisplayAngle = -(Math.PI / 4);
		}
		// ^> diagonal
		if (pressedKeys[0] && pressedKeys[3]) {
			hakkunDisplayAngle = (Math.PI / 4);
		}

		//Start the game and the music
		if ((pressedKeys[0] || pressedKeys[1] || pressedKeys[2] || pressedKeys[3] ||
			 pressedKeys[4] || pressedKeys[5] || pressedKeys[6] || pressedKeys[7] ||
			 pressedKeys[8] || pressedKeys[9]) && !musicStarted) {
			startScreen.style.display = 'none';
			musicStarted = true;
			const listener = new THREE.AudioListener();
			camera.add(listener);
			const sound = new THREE.Audio(listener);
			const audioLoader = new THREE.AudioLoader();
			audioLoader.load('assets/Stage1.mp3', function (buffer) {
				sound.setBuffer(buffer);
				sound.setLoop(true);
				sound.setVolume(0.7);
				sound.play();
			});
		}
		
		//Move Hakkun's X and Z positions
		hakkunX += hakkunXV;
		hakkunZ += hakkunZV;

		//Move & rotate Hakkun's model
		hakkun_body.position.set(hakkunX, hakkunY + 0.6, hakkunZ);
		hakkun_body.rotation.y = -hakkunAngle + hakkunDisplayAngle;
		
		//Pot color absorb logic
		checkProximityAndAbsorbColor();
		//Block inject color logic
		checkProximityAndInjectColor();

		updateConvertedBlocksPositions();
		
		checkLevelCompletion();
	}
	else if (gameState === "transition") {
		// Handle level transition
		transitionTimer -= delta_animation_time;
		
		// Show transition screen
		const transitionScreen = document.getElementById('transitionScreen');
		const levelMessage = document.getElementById('levelMessage');
		const nextLevelCountdown = document.getElementById('nextLevelCountdown');
		
		if (transitionScreen) {
			transitionScreen.style.display = 'flex';
			
			if (levelMessage && currentLevel <= maxLevels) {
				levelMessage.textContent = levelConfigurations[currentLevel - 1].message;
			}
			
			if (nextLevelCountdown) {
				nextLevelCountdown.textContent = `Next level in ${Math.ceil(transitionTimer)} seconds...`;
			}
		}
		
		// Move to next level when timer completes
		if (transitionTimer <= 0) {
			if (currentLevel < maxLevels) {
				currentLevel++;
				initializeLevel(currentLevel);
				
				// Hide transition screen
				if (transitionScreen) {
					transitionScreen.style.display = 'none';
				}
			} else {
				// Game complete
				gameState = "complete";
				
				// Hide transition screen and show game over screen
				if (transitionScreen) {
					transitionScreen.style.display = 'none';
				}
				
				const gameOverScreen = document.getElementById('gameOverScreen');
				if (gameOverScreen) {
					gameOverScreen.style.display = 'flex';
				}
			}
		}
	}
	// Game complete state
	else if (gameState === "complete") {
		// Just handle restart input
		if (pressedKeys[9]) { // Assuming 'r' key is mapped to index 9
			currentLevel = 1;
			initializeLevel(1);
			
			const gameOverScreen = document.getElementById('gameOverScreen');
			if (gameOverScreen) {
				gameOverScreen.style.display = 'none';
			}
		}
	}

	// Sun animation continues in all game states
	sunLight.position.set(shardPos[0], shardPos[1], shardPos[2]);
	let model_transformation = new THREE.Matrix4();
	model_transformation.identity();
	model_transformation.premultiply(rotationMatrixZ(animation_time));
	model_transformation.premultiply(rotationMatrixX(animation_time));
	model_transformation.premultiply(rotationMatrixY(animation_time));
	model_transformation.premultiply(translationMatrix(shardPos[0], shardPos[1] + 0.3 * Math.cos(animation_time), shardPos[2]));
	sunShard.matrix.copy(model_transformation);
	model_transformation.identity();
	model_transformation.premultiply(rotationMatrixZ(-animation_time));
	model_transformation.premultiply(rotationMatrixX(-animation_time));
	model_transformation.premultiply(rotationMatrixY(-animation_time));
	model_transformation.premultiply(translationMatrix(shardPos[0], shardPos[1] - 0.1 * Math.cos(animation_time), shardPos[2]));
	sunWire.matrix.copy(model_transformation);

}
renderer.setAnimationLoop(animate);

let still = false;
window.addEventListener('keydown', onKeyPress);
window.addEventListener('keyup', onKeyRelease);

function onKeyPress(event) {
	switch (event.key) {
		case 'w':
			pressedKeys[0] = true;
			break;
		case 'a':
			pressedKeys[1] = true;
			break;
		case 's':
			pressedKeys[2] = true;
			break;
		case 'd':
			pressedKeys[3] = true;
			break;
		case ' ':
			pressedKeys[6] = true;
			break;
		case 'q':
			pressedKeys[4] = true;
			break;
		case 'e':
			pressedKeys[5] = true;
			break;
		case 'c':
			pressedKeys[7] = true;
			break;
		case 'x':
			pressedKeys[8] = true;
			break;
		case 'r':
			pressedKeys[9] = true;
			break;
		default:
			console.log(`Key ${event.key} pressed`);
	}
}

function onKeyRelease(event) {
	switch (event.key) {
		case 'w':
			pressedKeys[0] = false;
			break;
		case 'a':
			pressedKeys[1] = false;
			break;
		case 's':
			pressedKeys[2] = false;
			break;
		case 'd':
			pressedKeys[3] = false;
			break;
		case ' ':
			pressedKeys[6] = false;
			break;
		case 'q':
			pressedKeys[4] = false;
			break;
		case 'e':
			pressedKeys[5] = false;
			break;
		case 'c':
			pressedKeys[7] = false;
			break;
		case 'x':
			pressedKeys[8] = false;
			break;
		case 'r':
			pressedKeys[9] = false;
			break;
	}
}