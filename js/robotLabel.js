import * as THREE from 'three';

let currentLabelContent = '';

export function createRobotLabel(scene) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 50;
    canvas.height = 20;
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const label = new THREE.Sprite(material);
    label.scale.set(1, 0.5, 0.5);
    label.visible = false;
    scene.add(label);
    return label;
}

export function updateRobotLabel(label, text, scene) {
    if (!label || currentLabelContent === text) return;
    currentLabelContent = text;
    if (text === '') {
        label.visible = false;
        return;
    }
    label.visible = true;
    const canvas = label.material.map.image;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '12px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const words = text.split('');
    let line = '';
    const lines = [];
    const maxWidth = canvas.width;
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            lines.push(line);
            line = words[i];
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    const lineHeight = 30;
    const startY = (canvas.height - (lines.length - 1) * lineHeight) / 2;
    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], canvas.width / 2, startY + i * lineHeight);
    }
    label.material.map.needsUpdate = true;
    if (scene) {
        scene.traverse((child) => {
            if (child.isMesh && child.chartController) {
                child.chartController.setTitle(currentLabelContent);
            }
        });
    }
}
