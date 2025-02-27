import { Mesh, ShaderMaterial, TextureLoader, Vector2 } from 'three';

export default class Media {
  constructor({ element, scene, geometry, screen, viewport }) {
    this.element = element;
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;

    const textureLoader = new TextureLoader();

    textureLoader.load(element.dataset.src, (texture) => {
      this.texture = texture;

      this.createMaterial();
      this.createMesh();

      this.onResize({ viewport, screen });
    });
  }

  createMaterial() {
    this.material = new ShaderMaterial({
      vertexShader: /*glsl*/ `
        varying vec2 vUv;

        void main(){
          vUv = uv;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }
      `,
      fragmentShader: /*glsl*/ `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec2 uImageResolution;

        varying vec2 vUv;

        vec2 getCorrectUv (vec2 resolution, vec2 textureResolution){
          vec2 ratio = vec2(
            min((resolution.x / resolution.y) / (textureResolution.x / textureResolution.y), 1.0),
            min((resolution.y / resolution.x) / (textureResolution.y / textureResolution.x), 1.0)
          );

          return vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
        }

        void main(){
          vec2 uv = getCorrectUv(uResolution, uImageResolution);

          vec4 texture = texture2D(uTexture, uv);

          gl_FragColor = vec4(texture.rgb, 1.);
        }
      `,
      uniforms: {
        uTexture: { value: this.texture },
        uResolution: {
          value: new Vector2(),
        },
        uImageResolution: {
          value: new Vector2(
            this.texture.image.width,
            this.texture.image.height
          ),
        },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  createBounds() {
    const rect = this.element.getBoundingClientRect();

    this.bounds = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  updateScale() {
    this.mesh.scale.x =
      (this.viewport.width * this.bounds.width) / this.screen.width;
    this.mesh.scale.y =
      (this.viewport.height * this.bounds.height) / this.screen.height;

    this.material.uniforms.uResolution.value.set(
      this.mesh.scale.x,
      this.mesh.scale.y
    );
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -this.viewport.width / 2 +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.viewport.height / 2 -
      this.mesh.scale.y / 2 -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height;
  }

  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    this.createBounds();
  }
}
