import './style.css'
import * as THREE from 'three'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { translations } from './translations.js'

gsap.registerPlugin(ScrollTrigger)

// --- Language Switcher Setup ---
const langSwitcher = document.getElementById('lang-switcher')
let currentLang = 'tr'

function setLanguage(lang) {
  currentLang = lang
  const dict = translations[lang]
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (dict[key]) {
      el.innerHTML = dict[key]
    }
  })
  
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph')
    if (dict[key]) {
      el.placeholder = dict[key]
    }
  })

  document.documentElement.lang = lang
}

if(langSwitcher) {
  langSwitcher.addEventListener('change', (e) => {
    setLanguage(e.target.value)
  })
}

// Initialize Language
setLanguage(currentLang)

// --- Lenis Smooth Scroll Setup ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// --- Three.js Background Setup ---
const canvas = document.querySelector('#webgl-canvas')
const scene = new THREE.Scene()

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 30

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Particle System (Cyberpunk Data Stream / Network)
const particlesGeometry = new THREE.BufferGeometry()
const particlesCount = 1500
const posArray = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 100
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: 0xff003c, // Cyberpunk red
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
})

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particlesMesh)

// Mouse interaction for particles
let mouseX = 0
let mouseY = 0

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) - 0.5
  mouseY = (event.clientY / window.innerHeight) - 0.5
})

// Animation Loop for Three.js
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Rotate particles slowly
  particlesMesh.rotation.y = elapsedTime * 0.05
  particlesMesh.rotation.x = elapsedTime * 0.02

  // Parallax effect based on mouse
  particlesMesh.position.x += (mouseX * 10 - particlesMesh.position.x) * 0.05
  particlesMesh.position.y += (-mouseY * 10 - particlesMesh.position.y) * 0.05

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// --- GSAP ScrollTrigger Animations ---

// Section Reveal Animations
const revealUpElements = document.querySelectorAll('.reveal-up')
revealUpElements.forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out"
  })
})

const revealLeftElements = document.querySelectorAll('.reveal-left')
revealLeftElements.forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    opacity: 1,
    x: 0,
    duration: 0.8,
    ease: "power3.out"
  })
})

const revealRightElements = document.querySelectorAll('.reveal-right')
revealRightElements.forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    opacity: 1,
    x: 0,
    duration: 0.8,
    ease: "power3.out"
  })
})

// Parallax for floating elements
gsap.to('.hero-content', {
  scrollTrigger: {
    trigger: '#hero',
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  y: 100,
  opacity: 0
})

// Update Coordinate System randomly
const coordEl = document.querySelector('.sys-coord')
setInterval(() => {
  const lat = (34.0522 + (Math.random() - 0.5) * 0.001).toFixed(4)
  const lon = (118.2437 + (Math.random() - 0.5) * 0.001).toFixed(4)
  if(coordEl) {
    coordEl.innerText = `COORD: ${lat}° N, ${lon}° W`
  }
}, 3000)
