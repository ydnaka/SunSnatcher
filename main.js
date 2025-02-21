import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const sky_texture = new THREE.TextureLoader().load( "textures/background.png" );
scene.background = sky_texture;
scene.backgroundIntensity = 0.2;

//THREE.PerspectiveCamera( fov angle, aspect ratio, near depth, far depth );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

// Rendering 3D axis
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);

// Setting up the lights

/*const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);
*/ 
const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

//defined colored phong materials for blocks and Hakkun
const red_material = new THREE.MeshPhongMaterial({
    color: 0xff0000, // Red color
    shininess: 100   // Shininess of the material
});
const blue_material = new THREE.MeshPhongMaterial({
    color: 0x0000ff, // Blue color
    shininess: 100   
});
const yellow_material = new THREE.MeshPhongMaterial({
    color: 0xffff00, // Yellow color
    shininess: 100   
});
const grass_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   
});
const sun_material = new THREE.MeshBasicMaterial({
    color: 0xff8800, // orange-ish color
});

//Blocks have a size of 1.2x1.2x1.2
const l = 0.6;
const cube_geometry = new THREE.BoxGeometry(2*l, 2*l, 2*l);

// Wireframe cube geometry
const wirecube_vertices = new Float32Array([
	// Front face
    -l, -l,  l,
     l, -l,  l,
     l, -l,  l,
     l,  l,  l,
     l,  l,  l,
    -l,  l,  l,
    -l,  l,  l,
	-l, -l,  l,
    // Left face
    -l, -l, -l,
    -l, -l,  l,
	-l, -l,  l,
    -l,  l,  l,
    -l,  l,  l,
	-l,  l, -l,
	-l,  l, -l,
	-l, -l, -l,
    // Top face
	-l,  l,  l,
	 l,  l,  l,
	 l,  l,  l,
	 l,  l, -l,
	 l,  l, -l,
	-l,  l, -l,
	-l,  l, -l,
	-l,  l,  l,
    // Bottom face
	-l, -l, -l,
	 l, -l, -l,
	 l, -l, -l,	
	 l, -l,  l,
	 l, -l,  l,
	-l, -l,  l,
	-l, -l,  l,
	-l, -l, -l,
    // Right face
	 l, -l,  l,
	 l, -l, -l,
	 l, -l, -l,
	 l,  l, -l,
	 l,  l, -l,
	 l,  l,  l,
	 l,  l,  l,
	 l, -l,  l,
     // Back face
	 l, -l, -l,
	-l, -l, -l,
	-l, -l, -l,
	-l,  l, -l,
	-l,  l, -l,
	 l,  l, -l,
	 l,  l, -l,
	 l, -l, -l
]);

const wirecube_geometry = new THREE.BufferGeometry();
wirecube_geometry.setAttribute( 'position', new THREE.BufferAttribute( wirecube_vertices, 3 ) );

const level_plane_geometry = new THREE.PlaneGeometry(100,100);

const sun_shard_geometry = new THREE.OctahedronGeometry();
const sun_wire_geometry = new THREE.TetrahedronGeometry(1);

//Define Hakkun model geometry (NOT DONE)
const hakkun_head_geometry = new THREE.SphereGeometry(0.5, 6, 6);
const hakkun_body_geometry = new THREE.CapsuleGeometry(0.35, 0.5, 2, 8);
 
//Hakkun slightly lights up his surroundings
const HakkunLight = new THREE.PointLight(0xffffff, 0.5, 100);
scene.add(HakkunLight);

//let hakkun_head_fill = new THREE.Mesh( hakkun_head_geometry, red_material );
let hakkun_head_wire = new THREE.LineSegments( hakkun_head_geometry );
//scene.add(hakkun_head_fill);
scene.add(hakkun_head_wire);

//let hakkun_body_fill = new THREE.Mesh( hakkun_body_geometry, red_material );
let hakkun_body_wire = new THREE.LineSegments( hakkun_body_geometry );
//scene.add(hakkun_body_fill);
scene.add(hakkun_body_wire);

//The level plane
let level = new THREE.Mesh(level_plane_geometry, grass_material);
level.matrixAutoUpdate = false;
level.matrix.copy(rotationMatrixX(3*Math.PI/2));
scene.add(level);
level.material.color.setRGB(0,1,0);

//Sun shards: (at most 3 in one level)
let sunShard = new THREE.Mesh(sun_shard_geometry, sun_material);
let sunWire = new THREE.LineSegments(sun_wire_geometry);
let sunLight = new THREE.PointLight(0xffffaa, 50, 200);
sunShard.matrixAutoUpdate = false;
sunWire.matrixAutoUpdate = false;
scene.add(sunShard);
scene.add(sunWire);
scene.add(sunLight);

//const line = new THREE.LineSegments( wireframe_geometry );

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

//Transformation matrices:
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
		1, 0,                0,               0,
		0, Math.cos(theta), -Math.sin(theta), 0,
		0, Math.sin(theta),  Math.cos(theta), 0,
		0, 0,                0,               1
	);
}

function rotationMatrixY(theta) {
	return new THREE.Matrix4().set(
		Math.cos(theta), 0, Math.sin(theta), 0,
		0,               1, 0,               0,
	   -Math.sin(theta), 0, Math.cos(theta), 0,
		0,               0, 0,               1
	);
}

function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
		Math.cos(theta), -Math.sin(theta), 0, 0,
		Math.sin(theta),  Math.cos(theta), 0, 0,
		0,                0,               1, 0,
		0,                0,               0, 1
	);
}

function scalingMatrix(sx, sy, sz) {
	return new THREE.Matrix4().set(
		sx, 0,  0,  0,
		0,  sy, 0,  0,
		0,  0,  sz, 0,
		0,  0,  0,  1
	);
}

// Transform cubes:
/*
const S = scalingMatrix(1, 1.5, 1);
const h = 1.5*l //height of "cubes" after scaling
const T1 = translationMatrix(l, h, 0);
const R = rotationMatrixZ(10*Math.PI/180); //10 degrees = 10pi/180 radians
const T2 = translationMatrix(-l, h, 0)
let model_transformation = new THREE.Matrix4();
model_transformation.premultiply(S)
for (let i = 0; i < cubes.length; i++) {
	cubes[i].matrix.copy(model_transformation);
	model_transformation.multiplyMatrices(T1, model_transformation);
	model_transformation.premultiply(R);
	model_transformation.premultiply(T2);
}
*/

let animation_time = 0;
let delta_animation_time;
const clock = new THREE.Clock();

let hakkunX = 2;
let hakkunY = 4;
let hakkunZ = 12;
let hakkunAngle = 0;
let hakkunXV = 0; //horizontal velocity
let hakkunZV = 0;
let hakkunYV = 0; //vertical velocity
let isJumping = false;
let onGround = false;
const gravity = 0.02;
const gravity1 = 0.004;
const jumpVelocity = 0.5;
//0=W, 1=A, 2=S, 3=D, 4=Q, 5=E
let pressedKeys = [false, false, false, false, false, false];
const hakkunA = 0.003; //vertical acceleration

const shardPos = [1, 4, 3]; //sun shard position

function createBlock(material, x, y, z){
       const cube = new THREE.Mesh(cube_geometry, material);
       cube.position.set(x, y, z)
       scene.add(cube);
       return cube;
}

const yellowblock = createBlock(yellow_material, 0, 0.6, 0);
const redblock = createBlock(red_material, 5, 0.6, 3);
const blueblock = createBlock(blue_material, -2, 0.6, 4);
const block_wire = new THREE.LineSegments( wirecube_geometry );
block_wire.position.set(-4 , 0.61, -1);
scene.add(block_wire);

let musicStarted = false;

let block_wire_mesh = new THREE.Mesh(wirecube_geometry, potMaterial.color.getHex());

//Not working yet.
// function switchToMesh() {
//     scene.remove(block_wire);
//     scene.add(block_wire_mesh);
// }

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
        if (hakkunY > 0) {
            hakkunYV -= gravity;
            hakkunY += hakkunYV;
        }
		else {
            hakkunY = 0;
            hakkunYV = 0;
            onGround = true;
            isJumping = false;
        }
    }

}

function checkProximityAndInjectColor() {
    const distanceThreshold = 0.5;
    const blockPosition = block_wire.position;
    const distance = Math.sqrt(
        Math.pow(hakkunX - blockPosition.x, 2) +
        Math.pow(hakkunY - blockPosition.y, 2) +
        Math.pow(hakkunZ - blockPosition.z, 2)
    );

    if (distance < distanceThreshold) {
        const blockTopY = blockPosition.y + 0.5;
        if (hakkunY <= blockTopY  && hakkunYV <= 0) {
            hakkunY = blockTopY;
            hakkunYV = 0;
            onGround = true;
            isJumping = false;
        }
		if (pressedKeys[8]) {
			const injectedColor = potMaterial.color.getHex();
			block_wire.material.color.set(injectedColor);
			//switchToMesh();
		}
    }
	else {
        if (hakkunY > 0) {
            hakkunYV -= gravity;
            hakkunY += hakkunYV;
        }
		else {
            hakkunY = 0;
            hakkunYV = 0;
            onGround = true;
            isJumping = false;
        }
    }
}

function animate() {
    
	renderer.render( scene, camera );
    controls.update();
	
	// Animation time
	delta_animation_time = clock.getDelta();
	animation_time += delta_animation_time;
	
	//Gravity: (WIP, the ground is currently hardcoded)
	// if (hakkunY - (hakkunYV + hakkunA) > 0){
	// 	hakkunYV += hakkunA;
	// 	hakkunY -= hakkunYV;
	// }
	// else {
	// 	hakkunYV = 0;
	// }
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
    positionInfo.innerHTML = `Position: X: ${hakkunX.toFixed(2)}, Y: ${hakkunY.toFixed(2)}, Z: ${hakkunZ.toFixed(2)}`;
	 
	//TODO - allow orbit controls later
	//Camera positioning
	if (pressedKeys[4]) { hakkunAngle -= 0.02; }
	if (pressedKeys[5]) { hakkunAngle += 0.02; }
	camera.position.set(hakkunX + -7*Math.sin(hakkunAngle), hakkunY + 2, hakkunZ + 7*Math.cos(hakkunAngle));
	controls.target.set(hakkunX, hakkunY, hakkunZ);
	
	//WASD press handling:
	hakkunXV = 0; hakkunZV = 0;
	if (pressedKeys[0]) {
		hakkunZV += -0.1*Math.cos(hakkunAngle);
		hakkunXV += 0.1*Math.sin(hakkunAngle);
	}
	if (pressedKeys[1]) {
		hakkunZV += -0.1*Math.sin(hakkunAngle);
		hakkunXV += -0.1*Math.cos(hakkunAngle);
	}
	if (pressedKeys[2]) {
		hakkunZV += 0.1*Math.cos(hakkunAngle);
		hakkunXV += -0.1*Math.sin(hakkunAngle);
	}
	if (pressedKeys[3]) {
		hakkunZV += 0.1*Math.sin(hakkunAngle);
		hakkunXV += 0.1*Math.cos(hakkunAngle);
	}
	
	//Start music after first W press:
	if (pressedKeys[0] && !musicStarted){
		musicStarted = true;
		//Audio playback:
		const listener = new THREE.AudioListener();
		camera.add(listener);
		const sound = new THREE.Audio(listener);
		const audioLoader = new THREE.AudioLoader();
		audioLoader.load('assets/Stage1.mp3', function(buffer) {
			sound.setBuffer(buffer);
			sound.setLoop(true);
			sound.setVolume(0.7);
			sound.play();
		});
	}
	
	//Horizontal movement:
	hakkunX += hakkunXV;
	hakkunZ += hakkunZV;
	
	//Hakkun body parts positioning:
	HakkunLight.position.set(hakkunX, hakkunY + 0.7, hakkunZ);
	hakkun_head_wire.position.set(hakkunX, hakkunY + 1.6, hakkunZ);
	hakkun_body_wire.position.set(hakkunX, hakkunY + 0.6, hakkunZ);
	
	checkProximityAndAbsorbColor();
	checkProximityAndInjectColor();

	//Sun shard animation
	sunLight.position.set(shardPos[0], shardPos[1], shardPos[2]);
	let model_transformation = new THREE.Matrix4();
	model_transformation.identity();
	model_transformation.premultiply(rotationMatrixZ(animation_time));
	model_transformation.premultiply(rotationMatrixX(animation_time));
	model_transformation.premultiply(rotationMatrixY(animation_time));
	model_transformation.premultiply(translationMatrix(shardPos[0], shardPos[1] + 0.3*Math.cos(animation_time), shardPos[2]));
	sunShard.matrix.copy(model_transformation);
	model_transformation.identity();
	model_transformation.premultiply(rotationMatrixZ(-animation_time));
	model_transformation.premultiply(rotationMatrixX(-animation_time));
	model_transformation.premultiply(rotationMatrixY(-animation_time));
	model_transformation.premultiply(translationMatrix(shardPos[0], shardPos[1] - 0.1*Math.cos(animation_time), shardPos[2]));
	sunWire.matrix.copy(model_transformation);
	
	//Oscillate blocks
	yellowblock.position.x = Math.sin(-animation_time * 2) * 2;
    yellowblock.position.y = 2.6 + Math.sin(animation_time * 2) * 2;
    redblock.position.y = 2.6 + (Math.sin(-animation_time * 2)) * 2;
    blueblock.position.x = Math.sin(animation_time * 2) * 3;
		
	/*
    
	//(sin(x) + 1) / 2 makes a sin function that oscillates between 0 and 1
	//sin(x * 2pi/T) makes a sin function that oscillates with a period of T
	//A * (sin(x * 2pi/T) + 1) / 2 has period T and oscillates between 0 and A
	//x = animation_time and A = MAX_ANGLE
	/*
	const S = scalingMatrix(1, 1, 1);
	const h = l //height of "cubes" after scaling
	const T1 = translationMatrix(l, h, 0);
	const R = rotationMatrixZ(rotation_angle);
	const T2 = translationMatrix(-l, h, 0)
	let model_transformation = new THREE.Matrix4();
	model_transformation.premultiply(S)
	//since meshCubes and wireCubes both have the same length of 7, we can
	//use meshCubes's length as the upper limit for both arrays
	for (let i = 0; i < meshCubes.length; i++) {
		//apply transformation to both mesh and wire cubes simultaneously
		meshCubes[i].matrix.copy(model_transformation);
		wireCubes[i].matrix.copy(model_transformation);
		model_transformation.multiplyMatrices(T1, model_transformation);
		model_transformation.premultiply(R);
		model_transformation.premultiply(T2);
	}
	*/
}
renderer.setAnimationLoop( animate );

// TODO: Add event listener
let still = false;
window.addEventListener('keydown', onKeyPress);
window.addEventListener('keyup', onKeyRelease);

function onKeyPress(event) {
	switch (event.key) {
		/*
		case 's':
			still = !still;
			break;
		case 'w':
			for (let i = 0; i < meshCubes.length; i++) {
				//toggle visibility
				meshCubes[i].visible = !meshCubes[i].visible
				wireCubes[i].visible = !wireCubes[i].visible
			}
			*/
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
			// if (hakkunY - (hakkunYV + hakkunA) <= 0){
			// 	hakkunYV = -0.13;
			// }
			// break;
			if (onGround) {
                isJumping = true;
                onGround = false;
                hakkunYV = jumpVelocity;
            }
			pressedKeys[6]= true;
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
	}
}
