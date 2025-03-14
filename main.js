import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { shininess } from 'three/tsl';

const scene = new THREE.Scene();
const sky_texture = new THREE.TextureLoader().load("textures/background.png");
scene.background = sky_texture;
scene.backgroundIntensity = 0.2;


let currentLevel = 1;
let maxLevels = 10;
let gameState = "playing"; 
let transitionTimer = 0;
let transitionDuration = 3; 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

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


//grass texture
const grassTexture = new THREE.TextureLoader().load('textures/grass.png');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(16,16); 

//red brick texture
const redBrickTexture = new THREE.TextureLoader().load('textures/redbrick.png');
redBrickTexture.wrapS = THREE.RepeatWrapping;
redBrickTexture.wrapT = THREE.RepeatWrapping;
redBrickTexture.repeat.set(0.5,0.5);

//yellow brick texture
const yellowBrickTexture = new THREE.TextureLoader().load('textures/redbrick.png');
yellowBrickTexture.wrapS = THREE.RepeatWrapping;
yellowBrickTexture.wrapT = THREE.RepeatWrapping;
yellowBrickTexture.repeat.set(0.5,0.5);

//blue brick texture
const blueBrickTexture = new THREE.TextureLoader().load('textures/whitebrick.png');
blueBrickTexture.wrapS = THREE.RepeatWrapping;
blueBrickTexture.wrapT = THREE.RepeatWrapping;
blueBrickTexture.repeat.set(0.5,0.5);

//sun shard texture
const sunTexture = new THREE.TextureLoader().load('textures/sun.png');
sunTexture.wrapS = THREE.RepeatWrapping;
sunTexture.wrapT = THREE.RepeatWrapping;
sunTexture.repeat.set(0.5,0.5);

// Setting up the lights

/*const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);
*/ 
const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light

scene.add(ambientLight);

const red_material = new THREE.MeshPhongMaterial({
    color: 0x9f0000, // Red color
    shininess: 50,   // Shininess of the material
	map: redBrickTexture
});
const blue_material = new THREE.MeshPhongMaterial({
    color: 0x0082ff, // Blue color
    shininess: 50,
	map: blueBrickTexture   
});
const yellow_material = new THREE.MeshPhongMaterial({
    color: 0xffff00, // Yellow color
    shininess: 50,
	map: yellowBrickTexture   
});
const grass_material = new THREE.MeshPhongMaterial({
    color: 0x00f200, // Green color
    shininess: 100,  
	map: grassTexture 
});
const sun_material = new THREE.MeshBasicMaterial({
    color: 0xff8800, // orange-ish color
	map: sunTexture
});

const l = 0.6;
const cube_geometry = new THREE.BoxGeometry(2 * l, 2 * l, 2 * l);

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

const wirecube_geometry = new THREE.BufferGeometry();
wirecube_geometry.setAttribute('position', new THREE.BufferAttribute(wirecube_vertices, 3));

const level_plane_geometry = new THREE.PlaneGeometry(100, 100);

const sun_shard_geometry = new THREE.OctahedronGeometry();
const sun_wire_geometry = new THREE.TetrahedronGeometry(1);

//Define Hakkun model geometry (NOT DONE)
const hakkunHeadTexture = new THREE.TextureLoader().load('textures/hakkunfaceALT.png');
hakkunHeadTexture.wrapS = THREE.RepeatWrapping;
hakkunHeadTexture.wrapT = THREE.RepeatWrapping;
//hakkunHeadTexture.repeat.set(0.5,0.5);

const hakkun_head_geometry = new THREE.SphereGeometry(0.5, 6, 6);
const hakkun_head_material = new THREE.MeshPhongMaterial({
	transparent: true,
	opacity: 0.8,
	shininess: 100, 
	color: 0xffffff,
	map: hakkunHeadTexture
})
//const hakkun_body_geometry = new THREE.CapsuleGeometry(0.35, 0.5, 2, 8);
const hakkun_body_geometry = new THREE.SphereGeometry(0.55, 6.5, 6.5);
const hakkun_body_material = new THREE.MeshPhongMaterial({
	transparent: true,
	opacity: 0.8,
	shininess: 100,
	color: 0xffffff,
	
})

//hakkun nose
const hakkunNoseGeometry = new THREE.ConeGeometry(0.1, 0.8);
const hakkunNoseMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000,
})
const hakkunNose = new THREE.Mesh(hakkunNoseGeometry, hakkunNoseMaterial);
hakkunNose.rotateZ(Math.PI * 1.5);
hakkunNose.translateY(0.8);

//hakkun arms
const armGeometry = new THREE.CapsuleGeometry(0.15, 0.2, 3, 3);
const armMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000,
})

const rightArm = new THREE.Mesh(armGeometry, armMaterial);
rightArm.translateZ(0.5);
rightArm.rotateX(-0.4);
const leftArm = new THREE.Mesh(armGeometry, armMaterial);
leftArm.translateZ(-0.55);
leftArm.rotateX(0.4);

 
//Hakkun slightly lights up his surroundings
const HakkunLight = new THREE.PointLight(0xffffff, 0.5, 100);
scene.add(HakkunLight);

//let hakkun_head_fill = new THREE.Mesh( hakkun_head_geometry, red_material );
//let hakkun_head_wire = new THREE.LineSegments( hakkun_head_geometry );
let hakkun_head_wire = new THREE.Mesh(hakkun_head_geometry, hakkun_head_material);
//scene.add(hakkun_head_fill);
scene.add(hakkun_head_wire);
hakkun_head_wire.add(hakkunNose);

//let hakkun_body_fill = new THREE.Mesh( hakkun_body_geometry, red_material );
//let hakkun_body_wire = new THREE.LineSegments( hakkun_body_geometry );
let hakkun_body_wire = new THREE.Mesh(hakkun_body_geometry, hakkun_body_material);
//scene.add(hakkun_body_fill);
scene.add(hakkun_body_wire);
hakkun_body_wire.add(leftArm);
hakkun_body_wire.add(rightArm);

let level = new THREE.Mesh(level_plane_geometry, grass_material);
level.matrixAutoUpdate = false;
level.matrix.copy(rotationMatrixX(3 * Math.PI / 2));
scene.add(level);
level.material.color.setRGB(0, 1, 0);

let sunShard = new THREE.Mesh(sun_shard_geometry, sun_material);
let sunWire = new THREE.LineSegments(sun_wire_geometry);
let sunLight = new THREE.PointLight(0xffffaa, 50, 200);
sunShard.matrixAutoUpdate = false;
sunWire.matrixAutoUpdate = false;
scene.add(sunShard);
scene.add(sunWire);
scene.add(sunLight);

const colors = [0xff0000, 0xffff00, 0x0000ff];
const randomColor = colors[Math.floor(Math.random() * colors.length)];

const potBodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
const potRimGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32);
const potMaterial = new THREE.MeshBasicMaterial({ color: randomColor });
const potBody = new THREE.Mesh(potBodyGeometry, potMaterial);
const potRim = new THREE.Mesh(potRimGeometry, potMaterial);

potRim.position.y = 0.35;

const pot = new THREE.Group();
pot.add(potBody);
pot.add(potRim);

pot.position.set(0, 0, 3);

scene.add(pot);

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

let animation_time = 0;
let delta_animation_time;
const clock = new THREE.Clock();

let hakkunX = 2;
let hakkunY = 4;
let hakkunZ = 12;
let hakkunAngle = 0;
let hakkunXV = 0;
let hakkunZV = 0;
let hakkunYV = 0;
let isJumping = false;
let onGround = false;
const gravity = 0.02;
const gravity1 = 0.004;
const jumpVelocity = 0.5;

let pressedKeys = [false, false, false, false, false, false, false, false, false, false];
const hakkunA = 0.003;

const shardPos = [1, 4, 3];

let carriedBlockOriginalY = 0;

function createBlock(material, x, y, z) {
	const cube = new THREE.Mesh(cube_geometry, material);
	cube.position.set(x, y, z)
	scene.add(cube);
	return cube;
}

const yellowblock = createBlock(yellow_material, 0, 0.6, 0);
const redblock = createBlock(red_material, 5, 0.6, 3);
//redblock.material.map = redBrickTexture;
//redblock.material.needsUpdate = true;
const blueblock = createBlock(blue_material, -2, 0.6, 4);

const colorReferenceBlocks = {
	"yellow": yellowblock,
	"red": redblock,
	"blue": blueblock
};

const block_wire = new THREE.LineSegments(wirecube_geometry);
block_wire.position.set(-4, 0.61, -1);
scene.add(block_wire);

const block_solid = new THREE.Mesh(cube_geometry, new THREE.MeshPhongMaterial({
	color: 0xffffff,
	shininess: 100
}));
block_solid.position.copy(block_wire.position);
block_solid.visible = false;

const convertedBlocks = [];

let blockIsSolid = false;

let carryingBlock = false;
let carriedBlock = null;
let carriedBlockColor = null;

let musicStarted = false;

function switchToSolid() {
	if (!blockIsSolid) {

		block_solid.position.copy(block_wire.position);

		block_solid.material.color.copy(block_wire.material.color);

		scene.add(block_solid);

		block_wire.visible = false;
		block_solid.visible = true;

		blockIsSolid = true;

		const colorHex = block_solid.material.color.getHex();
		if (colorHex === 0xff0000) {
			carriedBlockColor = "red";
		} else if (colorHex === 0xffff00) {
			carriedBlockColor = "yellow";
		} else if (colorHex === 0x0000ff) {
			carriedBlockColor = "blue";
		}

		convertedBlocks.push({
			block: block_solid,
			color: carriedBlockColor,
			mimicking: true,
			originalPosition: block_solid.position.clone(),
			fixedY: block_solid.position.y
		});
	}
}

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

function checkProximityAndAbsorbColor() {
	const distanceThreshold = 0.5;
	const potPosition = pot.position;
	const distance = Math.sqrt(
		Math.pow(hakkunX - potPosition.x, 2) +
		Math.pow(hakkunY - potPosition.y, 2) +
		Math.pow(hakkunZ - potPosition.z, 2)
	);

	if (distance < distanceThreshold) {
		const potTopY = pot.position.y + 0.4;
		if (hakkunY <= potTopY) {
			hakkunY = potTopY;
			hakkunYV = 0;
			onGround = true;
			isJumping = false;
		}
		if (pressedKeys[7]) {
			const absorbedColor = potMaterial.color.getHex();
			hakkun_head_wire.material.color.setHex(absorbedColor);
			hakkun_body_wire.material.color.setHex(absorbedColor);
		}
	}
	else {
		if (!carryingBlock) {
			hakkunYV -= gravity;
			hakkunY += hakkunYV;
		}
		else {
			hakkunY = Math.max(0, hakkunY);
			hakkunYV = 0;
			onGround = true;
			isJumping = false;
		}
	}
}

function checkProximityAndInjectColor() {
	const distanceThreshold = 1.5;
	const blockPosition = blockIsSolid ? block_solid.position : block_wire.position;
	const distance = Math.sqrt(
		Math.pow(hakkunX - blockPosition.x, 2) +
		Math.pow(hakkunY - blockPosition.y, 2) +
		Math.pow(hakkunZ - blockPosition.z, 2)
	);

	if (distance < distanceThreshold) {
		const blockTopY = blockPosition.y + 0.6;
		if (hakkunY <= blockTopY && hakkunYV <= 0) {
			hakkunY = blockTopY;
			hakkunYV = 0;
			onGround = true;
			isJumping = false;
		}

		if (pressedKeys[8]) {
			const injectedColor = hakkun_head_wire.material.color.getHex();

			if (blockIsSolid) {

				block_solid.material.color.setHex(injectedColor);
			} else {

				block_wire.material.color.setHex(injectedColor);


				switchToSolid();
			}

			const colorHex = injectedColor;
			if (colorHex === 0xff0000) {
				carriedBlockColor = "red";
			} else if (colorHex === 0xffff00) {
				carriedBlockColor = "yellow";
			} else if (colorHex === 0x0000ff) {
				carriedBlockColor = "blue";
			}
		}

		if (pressedKeys[9] && !carryingBlock) {
			carryingBlock = true;
			if (blockIsSolid) {
				carriedBlock = block_solid;
			} else {
				carriedBlock = block_wire;
			}

			carriedBlockOriginalY = blockIsSolid ? block_solid.position.y : block_wire.position.y;

			console.log("Block picked up");
		}
	}
}


function checkProximityToConvertedBlocks() {
	const distanceThreshold = 1.5;

	for (let i = 0; i < convertedBlocks.length; i++) {
		const blockData = convertedBlocks[i];
		const block = blockData.block;

		if (carriedBlock === block) continue;

		const distance = Math.sqrt(
			Math.pow(hakkunX - block.position.x, 2) +
			Math.pow(hakkunY - block.position.y, 2) +
			Math.pow(hakkunZ - block.position.z, 2)
		);

		if (distance < distanceThreshold) {
			const blockTopY = block.position.y + 0.6;
			if (hakkunY <= blockTopY && hakkunYV <= 0) {
				hakkunY = blockTopY;
				hakkunYV = 0;
				onGround = true;
				isJumping = false;
			}

			if (pressedKeys[8]) {
				const injectedColor = hakkun_head_wire.material.color.getHex();

				block.material.color.setHex(injectedColor);

				const colorHex = injectedColor;
				if (colorHex === 0xff0000) {
					blockData.color = "red";
				} else if (colorHex === 0xffff00) {
					blockData.color = "yellow";
				} else if (colorHex === 0x0000ff) {
					blockData.color = "blue";
				}
			}

			if (pressedKeys[9] && !carryingBlock) {
				carryingBlock = true;
				carriedBlock = block;
				carriedBlockOriginalY = block.position.y;

				carriedBlockColor = blockData.color;

				convertedBlocks.splice(i, 1);
				i--;
				console.log("Converted block picked up");
			}
		}
	}
}

function updateCarriedBlockPosition() {
	if (carryingBlock && carriedBlock) {
		const offsetDistance = 1.2;
		const offsetX = Math.sin(hakkunAngle) * offsetDistance;
		const offsetZ = Math.cos(hakkunAngle) * offsetDistance;

		carriedBlock.position.set(
			hakkunX + offsetX,
			carriedBlockOriginalY,
			hakkunZ + offsetZ
		);
	}
}

function placeCarriedBlock() {
	if (carryingBlock && carriedBlock) {
		if (carriedBlock.type === "Mesh") {

			const exactPosition = carriedBlock.position.clone();

			convertedBlocks.push({
				block: carriedBlock,
				color: carriedBlockColor,
				mimicking: true,
				originalPosition: exactPosition,
				fixedY: exactPosition.y
			});
		}

		carryingBlock = false;
		carriedBlock = null;
	}
}

function updateConvertedBlocksPositions() {
	for (let i = 0; i < convertedBlocks.length; i++) {
		const blockData = convertedBlocks[i];

		if (blockData.block === carriedBlock || !blockData.mimicking) continue;

		const colorType = blockData.color;
		if (colorType && colorReferenceBlocks[colorType]) {
			const referenceBlock = colorReferenceBlocks[colorType];

			const baseX = colorType === "yellow" ? 0 : (colorType === "red" ? 5 : -2);
			const baseZ = colorType === "yellow" ? 0 : (colorType === "red" ? 3 : 4);

			const offsetX = referenceBlock.position.x - baseX;
			const offsetZ = referenceBlock.position.z - baseZ;
			const offsetY = referenceBlock.position.y - 0.6;

			blockData.block.position.set(
				blockData.originalPosition.x + offsetX,
				blockData.originalPosition.y + offsetY,
				blockData.originalPosition.z + offsetZ
			);
		}
	}
}
const levelConfigurations = [
  // Level 1
  {
    hakkunStartPosition: { x: 0, y: 4, z: 0 }, // Start near the shard
    blockPositions: [],
    potPosition: { x: 0, y: 0, z: 3 }, 
    potColor: 0xff0000, 
    sunPosition: { x: 1, y: 4, z: 3 }, 

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
    
     
  },
  
  // Level 3
  {
    
  },

  // Level 2
  {
    
     
  },
  
  // Level 3
  {
    
  },

  // Level 2
  {
    
     
  },
  
  // Level 3
  {
    
  },

  // Level 2
  {
    
     
  },
  
  // Level 3
  {
    
  },

  // Level 10
  {
    
     
  },
  
];


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
  gameOverScreen.style.backgroundColor = 'rgba(196, 25, 25, 0.8)';
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
    goalText = "Goal: Touch the sunshard";
  } else if (currentLevel === 2) {
    goalText = "Goal: Level2";
  } else if (currentLevel === 3) {
    goalText = "Goal:Level3";
  } else if (currentLevel === 4) {
    goalText = "Goal:Level3";
  } else if (currentLevel === 5) {
    goalText = "Goal:Level3";
  }else if (currentLevel === 6) {
    goalText = "Goal:Level3";
  }else if (currentLevel === 7) {
    goalText = "Goal:Level3";
  }else if (currentLevel === 8) {
    goalText = "Goal:Level3";
  }else if (currentLevel === 9) {
    goalText = "Goal:Level3";
  }else if (currentLevel === 10) {
    goalText = "Goal:Level3";
  }

  goalsDisplay.innerHTML = goalText;
}

function initializeLevel(levelIndex) {
  const levelConfig = levelConfigurations[levelIndex - 1];

  currentLevel = levelIndex; 

  // Reset Hakkun position
  hakkunX = levelConfig.hakkunStartPosition.x;
  hakkunY = levelConfig.hakkunStartPosition.y;
  hakkunZ = levelConfig.hakkunStartPosition.z;
  hakkunAngle = 0;
  hakkunXV = 0;
  hakkunZV = 0;
  hakkunYV = 0;
  isJumping = false;
  onGround = false;

  // Update the level display UI immediately
  const levelDisplay = document.getElementById('levelDisplay');
  if (levelDisplay) {
    levelDisplay.innerHTML = `Level: ${currentLevel}/${maxLevels}`;
  }

  updateGoalsDisplay(); 
  gameState = "playing";
}



function checkLevelCompletion() {
  if (gameState !== "playing") return;
  
  const levelConfig = levelConfigurations[currentLevel - 1];
  if (levelConfig.goalCondition()) {
    completeLevel();
  }
}

function completeLevel() {
  gameState = "transition";
  transitionTimer = transitionDuration
}

function animate() {
	renderer.render(scene, camera);
	controls.update();
	delta_animation_time = clock.getDelta();
	animation_time += delta_animation_time;

	// Handle different game states
	if (gameState === "playing") {
		// Existing game logic
		if (!onGround) {
			hakkunYV -= gravity1;
			hakkunY += hakkunYV;
		}

		if (hakkunY <= 0) {
			hakkunY = 0;
			hakkunYV = 0;
			onGround = true;
			isJumping = false;
		}
		if (pressedKeys[6] && onGround) {
			isJumping = true;
			onGround = false;
			hakkunYV = jumpVelocity;
		}

		const positionInfo = document.getElementById("positionInfo");
		if (positionInfo) {
			positionInfo.innerHTML = `Position: X: ${hakkunX.toFixed(2)}, Y: ${hakkunY.toFixed(2)}, Z: ${hakkunZ.toFixed(2)}`;
		}

		if (pressedKeys[4]) { hakkunAngle -= 0.02; }
		if (pressedKeys[5]) { hakkunAngle += 0.02; }
		camera.position.set(hakkunX + -7 * Math.sin(hakkunAngle), hakkunY + 2, hakkunZ + 7 * Math.cos(hakkunAngle));
		controls.target.set(hakkunX, hakkunY, hakkunZ);

		hakkunXV = 0; hakkunZV = 0;
		if (pressedKeys[0]) {
			hakkunZV += -0.1 * Math.cos(hakkunAngle);
			hakkunXV += 0.1 * Math.sin(hakkunAngle);
		}
		if (pressedKeys[1]) {
			hakkunZV += -0.1 * Math.sin(hakkunAngle);
			hakkunXV += -0.1 * Math.cos(hakkunAngle);
		}
		if (pressedKeys[2]) {
			hakkunZV += 0.1 * Math.cos(hakkunAngle);
			hakkunXV += -0.1 * Math.sin(hakkunAngle);
		}
		if (pressedKeys[3]) {
			hakkunZV += 0.1 * Math.sin(hakkunAngle);
			hakkunXV += 0.1 * Math.cos(hakkunAngle);
		}

		if (pressedKeys[0] && !musicStarted) {
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

		hakkunX += hakkunXV;
		hakkunZ += hakkunZV;

		HakkunLight.position.set(hakkunX, hakkunY + 0.7, hakkunZ);
		hakkun_head_wire.position.set(hakkunX, hakkunY + 1.6, hakkunZ);
		hakkun_body_wire.position.set(hakkunX, hakkunY + 0.6, hakkunZ);

		checkProximityAndAbsorbColor();
		checkProximityAndInjectColor();
		checkProximityToConvertedBlocks();

		updateCarriedBlockPosition();

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
		if (pressedKeys[7]) { // Assuming 'r' key is mapped to index 7
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

	yellowblock.position.x = Math.sin(-animation_time * 2) * 2;
	yellowblock.position.y = 2.6 + Math.sin(animation_time * 2) * 2;
	redblock.position.y = 2.6 + (Math.sin(-animation_time * 2)) * 2;
	blueblock.position.x = Math.sin(animation_time * 2) * 3;
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
		case 'v':
			pressedKeys[9] = true;
			break;
		case 'b':
			placeCarriedBlock();
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
		case 'v':
			pressedKeys[9] = false;
			break;
	}
}