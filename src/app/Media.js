import { Mesh, ShaderMaterial } from 'three';

export default class Media {
  constructor({ element, scene, geometry, screen, viewport }) {
    this.element = element;
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;

    this.createMaterial();
    this.createMesh();

    this.onResize({ viewport, screen });
  }

  createMaterial() {
    this.material = new ShaderMaterial();
  }

  createMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;
  }
}
