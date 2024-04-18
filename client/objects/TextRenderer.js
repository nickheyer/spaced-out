import * as THREE from '../../lib/three.module.min.js';
import { FontLoader } from '../../lib/fontloader.js';


class TextGeometry extends THREE.ExtrudeGeometry {

	constructor( text, parameters = {} ) {

		const font = parameters.font;

		if ( font === undefined ) {
			super();
		} else {
			const shapes = font.generateShapes( text, parameters.size );
			parameters.depth = parameters.depth !== undefined ?
				parameters.depth : parameters.height !== undefined ?
					parameters.height : 50;

			if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
			if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
			if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;
			super( shapes, parameters );
		}
		this.type = 'TextGeometry';
	}
}

export default class TextManager {
  constructor(scene) {
    this.scene = scene;
    this.fontLoader = new FontLoader();
    this.textMeshes = [];
    this.setupLights();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    this.scene.add(directionalLight);
  }

  loadFontAndCreateText({
    url = 'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json',
    text = 'DEFAULT TEXT',
    size = 3,
    height = 1,
    curveSegments = 12,
    bevelEnabled = true,
    bevelThickness = 0.1,
    bevelSize = 0.1,
    bevelOffset = 0,
    bevelSegments = 5,
    color = 'green',
    position = [0, 0, -100]
  } = {}) {
    this.fontLoader.load(url, (font) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelEnabled: bevelEnabled,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelOffset: bevelOffset,
        bevelSegments: bevelSegments
      });

      textGeometry.computeBoundingBox();
      textGeometry.translate(
        -(textGeometry.boundingBox.max.x - 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x)),
        -(textGeometry.boundingBox.max.y - 0.5 * (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y)),
        -(textGeometry.boundingBox.max.z - 0.5 * (textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z))
      );

      const textMaterial = new THREE.MeshStandardMaterial({ color: color, metalness: 0.8, roughness: 0.4 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.set(...position);
      textMesh.castShadow = true;
      textMesh.receiveShadow = true;

      this.scene.add(textMesh);
      this.textMeshes.push(textMesh);
    });
  }

  update(keyboardState) {
    this.textMeshes.forEach((mesh, i) => {
      const distanceToUser = mesh.position.z;
      if (distanceToUser < 10) { // DELETE WHEN BEHIND
        mesh.position.z += 0.1;
      } else {
        this.scene.remove(mesh);
        this.textMeshes.splice(i, 1);
      }
    });
  }
}
