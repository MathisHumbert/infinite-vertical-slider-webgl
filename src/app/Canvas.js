import { PerspectiveCamera, Scene, WebGLRenderer, PlaneGeometry } from 'three';

import Media from './Media';

export default class Canvas {
  constructor() {
    this.screen = { width: window.innerWidth, height: window.innerHeight };

    this.createScene();
    this.createCamera();
    this.createRender();

    this.onResize();

    this.createGeometry();
    this.createMedias();

    this.update();
    this.addEventListeners();
  }

  createScene() {
    this.scene = new Scene();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 5;
  }

  createRender() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(this.renderer.domElement);
  }

  createGeometry() {
    this.geometry = new PlaneGeometry(1, 1, 16, 16);
  }

  createMedias() {
    const elements = document.querySelectorAll('.gallery__item__img');

    this.medias = [...elements].map(
      (element) =>
        new Media({
          element,
          scene: this.scene,
          geometry: this.geometry,
          screen: this.screen,
          viewport: this.viewport,
        })
    );
  }

  onResize() {
    this.screen = { width: window.innerWidth, height: window.innerHeight };

    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  update() {
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
  }
}
