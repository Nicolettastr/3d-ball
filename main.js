import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css'
import gsap from 'gsap'

const scene = new THREE.Scene();
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color:'#00ff83',
    roughness: 1,
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh)

//sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//light

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10)
light.intensity = 1.50
scene.add(light)

//camera

const camera = new THREE.PerspectiveCamera(45, sizes.width /sizes.height)
camera.position.z = 20;
scene.add(mesh)

//renderer

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//constrols

const constrols = new OrbitControls(camera, canvas)
constrols.enableDamping = true;
constrols.enableZoom = false;
constrols.enablePan = false;
constrols.autoRotate = true;
constrols.autoRotateSpeed = 5

//resize

window.addEventListener('resize', () => {

    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    //this 2 we have to always update then so they resize
    camera.aspect = sizes.width / sizes.heightcamera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
});

const loop = () => {
    constrols.update()
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop)
};

loop();


//timeline magic
const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo('nav', {y: '-100%'}, {y: '0%'})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

//mouse animation color

let mouseDown = false;
let rgb = [];

window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
    if(mouseDown){
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.width) * 255), 150
        ]
        // animation
        let newColor = new THREE.Color(`rgba(${rgb.join(',')})`)
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        })
    }
});