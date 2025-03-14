import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const sky_texture = new THREE.TextureLoader().load("textures/background.png");
scene.background = sky_texture;
scene.backgroundIntensity = 0.2;

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

const ambientLight = new THREE.AmbientLight(0x505050);
scene.add(ambientLight);

const red_material = new THREE.MeshPhongMaterial({
	color: 0xff0000,
	shininess: 100
});
const blue_material = new THREE.MeshPhongMaterial({
	color: 0x0000ff,
	shininess: 100
});
const yellow_material = new THREE.MeshPhongMaterial({
	color: 0xffff00,
	shininess: 100
});
const grass_material = new THREE.MeshPhongMaterial({
	color: 0x00ff00,
	shininess: 100
});
const sun_material = new THREE.MeshBasicMaterial({
	color: 0xff8800,
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

const hakkun_head_geometry = new THREE.SphereGeometry(0.5, 6, 6);
const hakkun_body_geometry = new THREE.CapsuleGeometry(0.35, 0.5, 2, 8);

const HakkunLight = new THREE.PointLight(0xffffff, 0.5, 100);
scene.add(HakkunLight);

let hakkun_head_wire = new THREE.LineSegments(hakkun_head_geometry);

scene.add(hakkun_head_wire);

let hakkun_body_wire = new THREE.LineSegments(hakkun_body_geometry);

scene.add(hakkun_body_wire);

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
		if (hakkunY > 0 && !carryingBlock) {
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

function animate() {
	renderer.render(scene, camera);
	controls.update();

	delta_animation_time = clock.getDelta();
	animation_time += delta_animation_time;

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