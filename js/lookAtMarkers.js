import * as THREE from 'three';

export function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2, 1, 1);
    return sprite;
}

export function buildLookAtMarkers(positionsAnimation, lookAtGroup) {
    const lookAtMarkers = [];
    lookAtGroup.clear();
    for (let i = 0; i < positionsAnimation.length; i++) {
        const seg = positionsAnimation[i];
        if (!seg.lookAt) continue;
        const g = new THREE.SphereGeometry(0.12, 16, 16);
        const m = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const s = new THREE.Mesh(g, m);
        s.position.set(seg.lookAt.x, 0.1, seg.lookAt.z);
        const label = createTextSprite(`${seg.lookAt.x.toFixed(2)}, ${seg.lookAt.z.toFixed(2)}`);
        label.position.set(seg.lookAt.x, 0.6, seg.lookAt.z);
        lookAtGroup.add(s);
        lookAtGroup.add(label);
        lookAtMarkers.push(s);
    }
    return lookAtMarkers;
}
