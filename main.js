import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();

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


// ***** Assignment 2 *****
// Setting up the lights
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5); // Position the light
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

const phong_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   // Shininess of the material
});


// Start here.

const l = 0.5
const positions = new Float32Array([
    // Front face
    -l, -l,  l, // 0
     l, -l,  l, // 1
     l,  l,  l, // 2
    -l,  l,  l, // 3

    // Left face
    -l, -l, -l, // 4
    -l, -l,  l, // 5
    -l,  l,  l, // 6 
    -l,  l, -l, // 7
  
    // Top face
	-l,  l,  l, //8
	 l,  l,  l, //9
	 l,  l, -l, //10
	-l,  l, -l, //11
  
    // Bottom face
	-l, -l, -l, //12
	 l, -l, -l, //13
	 l, -l,  l, //14
	-l, -l,  l, //15
  
    // Right face
	 l, -l,  l, //16
	 l, -l, -l, //17
	 l,  l, -l, //18
	 l,  l,  l, //19

     // Back face
	 l, -l, -l, //20
	-l, -l, -l, //21
	-l,  l, -l, //22
	 l,  l, -l  //23
  ]);
  
  const indices = [
    // Front face
    0, 1, 2,
    0, 2, 3,
  
    // Left face
    4, 5, 6,
    4, 6, 7,
  
    // Top face
	8, 9, 10,
	8, 10, 11,
  
    // Bottom face
	12, 13, 14,
	12, 14, 15,
  
    // Right face
	16, 17, 18,
	16, 18, 19,

    // Back face
	20, 21, 22,
	20, 22, 23
  ];
  
  // Compute normals
  const normals = new Float32Array([
    // Front face
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  
    // Left face
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
  
    // Top face
	0, 1, 0,
	0, 1, 0,
	0, 1, 0,
	0, 1, 0,
  
    // Bottom face
	0, -1, 0,
	0, -1, 0,
	0, -1, 0,
	0, -1, 0,
  
    // Right face
	1, 0, 0,
	1, 0, 0,
	1, 0, 0,
	1, 0, 0,

    // Back face
	0, 0, -1,
	0, 0, -1,
	0, 0, -1,
	0, 0, -1
  ]);

const custom_cube_geometry = new THREE.BufferGeometry();
custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

//let cube = new THREE.Mesh( custom_cube_geometry, phong_material );
//scene.add(cube);

// Implement wireframe geometry
const wireframe_vertices = new Float32Array([
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

const wireframe_geometry = new THREE.BufferGeometry();
wireframe_geometry.setAttribute( 'position', new THREE.BufferAttribute( wireframe_vertices, 3 ) );

//const line = new THREE.LineSegments( wireframe_geometry );

function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}
// Other transformation functions:
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

//making 2 different arrays for mesh and wireframe cubes:
let meshCubes = [];
for (let i = 0; i < 7; i++) {
	let cube = new THREE.Mesh(custom_cube_geometry, phong_material);
	cube.matrixAutoUpdate = false;
	meshCubes.push(cube);
	scene.add(cube);
}

let wireCubes = [];
for (let i = 0; i < 7; i++) {
	let cube = new THREE.LineSegments( wireframe_geometry );
	cube.matrixAutoUpdate = false;
	wireCubes.push(cube);
	scene.add(cube);
	//wireframe cubes are not visible by default
	cube.visible = false;
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
let rotation_angle;
const clock = new THREE.Clock();

const MAX_ANGLE = 10 * Math.PI/180
const T = 2

function animate() {
    
	renderer.render( scene, camera );
    controls.update();

    // Animate the cube
	delta_animation_time = clock.getDelta();
	// The animation time only advances when still is false
	if (!still) {
		animation_time += delta_animation_time;
	}
	rotation_angle = MAX_ANGLE * (Math.sin(animation_time * 2 * Math.PI / T) + 1) / 2;
	//(sin(x) + 1) / 2 makes a sin function that oscillates between 0 and 1
	//sin(x * 2pi/T) makes a sin function that oscillates with a period of T
	//A * (sin(x * 2pi/T) + 1) / 2 has period T and oscillates between 0 and A
	//x = animation_time and A = MAX_ANGLE
	
	const S = scalingMatrix(1, 1.5, 1);
	const h = 1.5*l //height of "cubes" after scaling
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

}
renderer.setAnimationLoop( animate );

// TODO: Add event listener
let still = false;
window.addEventListener('keydown', onKeyPress);

function onKeyPress(event) {
	switch (event.key) {
		case 's':
			still = !still;
			break;
		case 'w':
			for (let i = 0; i < meshCubes.length; i++) {
				//toggle visibility
				meshCubes[i].visible = !meshCubes[i].visible
				wireCubes[i].visible = !wireCubes[i].visible
			}
		default:
	console.log(`Key ${event.key} pressed`);
	}
}