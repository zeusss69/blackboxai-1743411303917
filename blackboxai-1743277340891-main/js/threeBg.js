// Three.js Tech Grid Background
class ThreeBackground {
  constructor() {
    this.init();
    this.animate();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.querySelector('.three-bg-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
      this.renderer.domElement.style.position = 'fixed';
      this.renderer.domElement.style.top = '0';
      this.renderer.domElement.style.left = '0';
      this.renderer.domElement.style.zIndex = '-1';
    }

    // Tech grid geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00f7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });

    this.cubes = [];
    const gridSize = 8;
    const spacing = 4;
    const depthRange = 15;

    // Create a larger grid with more depth variation
    for(let x = -gridSize; x <= gridSize; x+=spacing) {
      for(let z = -gridSize; z <= gridSize; z+=spacing) {
        const cube = new THREE.Mesh(geometry, material.clone());
        // Spread cubes across wider area with random depth
        cube.position.set(
          x * 1.5,
          (Math.random() - 0.5) * 10,
          z * 1.5 + (Math.random() - 0.5) * depthRange
        );
        cube.userData = {
          originalX: x,
          originalZ: z,
          speed: Math.random() * 0.02 + 0.01,
          offset: Math.random() * Math.PI * 2
        };
        this.scene.add(cube);
        this.cubes.push(cube);
      }
    }

    this.camera.position.z = 20; // Adjusted for better view
    this.setupEvents();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const time = Date.now() * 0.001;
    
    this.cubes.forEach(cube => {
      // Independent rotation for each cube
      cube.rotation.x = time * cube.userData.speed;
      cube.rotation.y = time * cube.userData.speed * 0.7;
      cube.rotation.z = time * cube.userData.speed * 0.5;
      
      // More expansive movement patterns
      cube.position.x = cube.userData.originalX * 1.5 + 
        Math.sin(time * 0.3 + cube.userData.offset) * 4;
      cube.position.y = Math.sin(time * 0.5 + cube.userData.originalX) * 3;
      cube.position.z = cube.userData.originalZ * 1.5 + 
        Math.cos(time * 0.4 + cube.userData.offset) * 4;
      
      // Gentle pulsing effect
      const scale = 0.7 + Math.sin(time * 1.5 + cube.userData.originalZ) * 0.3;
      cube.scale.set(scale, scale, scale);
    });

    // Wider camera view
    this.camera.position.z = 25;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

    setupEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Enhanced mouse interaction
    document.addEventListener('mousemove', (e) => {
      if(this.cubes.length > 0) {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        this.cubes.forEach(cube => {
          // Push cubes away from mouse position
          const distX = cube.position.x - mouseX * 15;
          const distY = cube.position.z - mouseY * 15;
          const force = 0.2;
          
          cube.position.x += distX * force * 0.01;
          cube.position.z += distY * force * 0.01;
          
          // Highlight effect
          const dist = Math.sqrt(distX*distX + distY*distY);
          const highlight = Math.max(0, 1 - dist/20);
          cube.material.color.setHSL(
            0.5 + highlight * 0.2, 
            0.8, 
            0.5 + highlight * 0.3
          );
        });
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if(document.querySelector('.three-bg-container')) {
    new ThreeBackground();
  }
});