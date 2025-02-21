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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

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

//Blocks have a size of 1x1x1
const l = 0.5
const cube_geometry = new THREE.BoxGeometry(1, 1, 1);

const level_plane_geometry = new THREE.PlaneGeometry(100,100);

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

//const line = new THREE.LineSegments( wireframe_geometry );

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
/*
let animation_time = 0;
let delta_animation_time;
let rotation_angle;
const clock = new THREE.Clock();

const MAX_ANGLE = 10 * Math.PI/180
const T = 2
*/
let hakkunX = 0;
let hakkunY = 4;
let hakkunZ = 0;
let hakkunAngle = 0;
let hakkunXV = 0; 
let hakkunZV = 0;
let hakkunYV = 0; //vertical velocity
let isJumping = false;
let onGround = false;
const gravity = 0.02;
const jumpVelocity = 0.4;
//0=W, 1=A, 2=S, 3=D, 4=Q, 5=E
let pressedKeys = [false, false, false, false, false, false];
//const hakkunA = 0.003; //vertical acceleration


function createBlock(material, x, y, z){

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const cube = new THREE.Mesh(geometry, material);
	cube.position.set(x, y, z)
	scene.add(cube);
	return cube;
}

const yellowblock = createBlock(yellow_material, 0, 0.5, 0);
const redblock = createBlock(red_material, 5, 0.5, 3); 
const blueblock = createBlock(blue_material, -2, 0.5, 6); 

function animate() {
	  // Get time in seconds
    let time = Date.now() / 1000;

    // Oscillate blocks


	yellowblock.position.x = Math.sin(time * 2) * 2; 
    yellowblock.position.y = 2.6 + Math.sin(time * 2) * 2; 
    redblock.position.y = Math.abs(Math.sin(time * 2)) * 2 + 0.5;  
    blueblock.position.x = Math.sin(time * 2) * 3;  

    
	renderer.render( scene, camera );
    controls.update();

	//Gravity: (WIP, the ground is currently hardcoded)
    if (!onGround) {
        hakkunYV -= gravity;
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
	
	//Horizontal movement:
    hakkunX += hakkunXV;
    hakkunZ += hakkunZV;
	
	//Hakkun body parts positioning:
	HakkunLight.position.set(hakkunX, hakkunY + 0.7, hakkunZ);
	hakkun_head_wire.position.set(hakkunX, hakkunY + 1.6, hakkunZ);
	hakkun_body_wire.position.set(hakkunX, hakkunY + 0.6, hakkunZ);
	/*
    // Animate the cube
	delta_animation_time = clock.getDelta();
	// The animation time only advances when still is false
	if (!still) {
		animation_time += delta_animation_time;
	}
	rotation_angle = MAX_ANGLE * (Math.sin(animation_time * 2 * Math.PI / T) + 1) / 2;
	*/
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

//FIX later: make WASD keypress recognition and movement smoother
//Possibly implement XZ velocity?
//Also make Hakkun face a certain direction
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




