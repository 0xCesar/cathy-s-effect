import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import imagesLoaded from 'imagesloaded'
import gsap from "gsap";
import fragment from "./shaders/ketty/fragment.glsl";
import vertex from "./shaders/ketty/vertex.glsl";

/**
 * Base
 */
// Debug
//const gui = new GUI()
//const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()


let current = 0; // Initialiser la valeur actuelle
let target = 0; // Initialiser la valeur cible

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
let scroll;
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/**
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 100, 2000)
camera.position.z = 600
const fov = 2 * Math.atan( ((sizes.height/2)/600) * ( 100/Math.PI));
camera.fov = fov

scene.add(camera)



camera.position.x = 0;
camera.position.y = 0;



// Preload 

const preloadImages = new Promise((resolve, reject) => {
    imagesLoaded(document.querySelectorAll('img'), {background: true}, resolve);
})

let allDone = [preloadImages];
const group = new THREE.Group();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/*
* Material 
*/

const planeMaterial = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      uTexture: {
        //texture data
        value: null
      },
      uOffset: {
        //distortion strength
        value: new THREE.Vector2(0.0, 0.0)
      },
      uAlpha: {
        value: 1.
      }
    },
    // wireframe: true,
    // transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment,
 
  });




/*
* Image 
*/

const images = [...document.querySelectorAll('img')]
const figures = [...document.querySelectorAll('figure')]
let figureStore = Array;
let imagesStore = Array;
let materials = [];
const loader = new THREE.TextureLoader();



function addImages(){
   // console.log(figures);
    figureStore = figures.map(img => {
      let boundings = img.getBoundingClientRect()
   //   console.log(boundings);
    })

    imagesStore = images.map(img => {
        let bounds = img.getBoundingClientRect()
      //  console.log(bounds)
        let planneGeometry = new THREE.PlaneGeometry(bounds.width, bounds.height, 1, 1)
        let m = planeMaterial.clone();
        materials.push(m);
        let texture = loader.load(img.src);
        m.uniforms.uTexture.value = texture;
        let planneMesh = new THREE.Mesh(planneGeometry, m);
        scene.add(planneMesh)

        return {
            img : img,
            mesh : planneMesh,
            top : bounds.top,
            left : bounds.left,
            width : bounds.width,
            height : bounds.height
        }
    })
}

function setPosition(){
  
 imagesStore.forEach(o => {
 
    o.mesh.position.y = window.scrollY -o.top + sizes.height/2 - o.height/2;
    o.mesh.position.x = window.scrollX + o.left - sizes.width/2 + o.width/2;
    group.add(o.mesh);
 
 })


}




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    // Update controls
   // controls.update()

    const elapsedTime = clock.getElapsedTime()
    // Render
    renderer.render(scene, camera)
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

Promise.all(allDone).then( () => {
  //  scroll = new Scroll();

    window.scrollTo(0, 0);
    addImages();
    
    setPosition();
    tick()
 
    
    let initialX, initialY;
    let finalX, finalY;
    document.addEventListener('mousemove', function(e) {
      var customCursor = document.querySelector('.custom-cursor');
      customCursor.style.left = e.pageX + 'px';
      customCursor.style.top = e.pageY + 'px';

      var customCursorFollower = document.querySelector('.custom-cursor-follower');
     
 

      gsap.to(customCursorFollower, { duration: 0.5, left: e.clientX , top: e.clientY , ease: 'power2.out' });

  });

    document.addEventListener('mousedown', handleMouseDown);
    // Detection début du clic maintenu
    function handleMouseDown(event) {
      initialX = event.clientX;
      initialY = event.clientY;
     
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    // Fonction pour détecter le déplacement du clic maintenu
    function handleMouseMove(event) {
  

      const deplacementX = initialX - event.clientX;
      const deplacementY = initialY - event.clientY;

      var customCursorFollower = document.querySelector('.custom-cursor-follower');
     
 

      gsap.to(customCursorFollower, { duration: 0.5, left: event.clientX - (initialX*0.03) , top: event.clientY - (initialY*0.03) , ease: 'power2.out' });
      gsap.to(camera.position, {duration: 0.5, z: 700, ease: 'power2.out'})
      gsap.to(camera, {duration: 0.5, fov: 80, ease: 'power2.out'})
      camera.updateProjectionMatrix()
      //camera.position.z = 600
      camera.position.x = Math.min(Math.max(camera.position.x + (deplacementX * 0.05), -100), 2500);
      camera.position.y = Math.min(Math.max(camera.position.y - (deplacementY * 0.05), -2500), -100);

      target = initialY
      current = event.clientY * 2;
      const offsetStrength = 1000.0; // Déformation de l'offset
      const offsetX = camera.position.x * offsetStrength; // Déformation horizontale
      const offsetY = -(target - current) * offsetStrength; // Déformation verticale
      planeMaterial.uniforms.uOffset.value.set(offsetX, offsetY);
    //e.log( planeMaterial.uniforms.uOffset.value)

    }
    
    // Fin detection du clic maintenu
    function handleMouseUp(event) {
      finalX = event.clientX;
      finalY = event.clientY;

      // Custom Cursor Follower End Postion
      var customCursorFollower = document.querySelector('.custom-cursor-follower');
      gsap.to(customCursorFollower, { duration: 1, left: finalX, top: finalY, ease: 'power2.out' });
      gsap.to(camera.position, {duration: 0.5, z: 600, ease: 'power2.out'})
      gsap.to(camera, {duration: 0.5, fov: 70, ease: 'power2.out'})
      camera.updateProjectionMatrix()
      const deplacementX = initialX - finalX;
      const deplacementY = initialY - finalY;
 
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Glissement De La Camera
      gsap.to(camera.position,  {
        x: camera.position.x + deplacementX * 0.8 , 
        y:camera.position.y - deplacementY * 0.8,
        ease:"power2.out",
        duration: 1,});

    }
    const boundingPlaneGeometry = new THREE.PlaneGeometry(6000, 6000, 100,100);
    const boundingPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true}); //wireframe:true});

    scene.add(group);
    console.log(camera.projectionMatrix);
 
 })



