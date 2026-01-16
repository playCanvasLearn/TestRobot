var FirstPersonCamera = pc.createScript("firstPersonCamera");
FirstPersonCamera.prototype.initialize = function () {
    var t = this.app, i = this.entity.forward.clone();
    i.y = 0, i.normalize(), this.azimuth = Math.atan2(-i.x, -i.z) * (180 / Math.PI), (new pc.Mat4).setFromAxisAngle(pc.Vec3.UP, -this.azimuth).transformVector(this.entity.forward, i), this.elevation = Math.atan(i.y, i.z) * (180 / Math.PI), t.mouse.disableContextMenu(), t.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this), t.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.virtualSticks = t.root.findByName("Virtual Sticks")
}, FirstPersonCamera.prototype.update = function (t) {
    var i = this.virtualSticks.script.virtualSticks.rightX, e = this.virtualSticks.script.virtualSticks.rightY;
    0 !== i && (this.azimuth += i / 2), 0 !== e && (this.elevation += e / 2, this.elevation = pc.math.clamp(this.elevation, -90, 90)), this.entity.setEulerAngles(this.elevation, this.azimuth, 0)
}, FirstPersonCamera.prototype.onMouseMove = function (t) {
    pc.Mouse.isPointerLocked() && (this.elevation -= t.dy / 5, this.elevation = pc.math.clamp(this.elevation, -90, 90), this.azimuth -= t.dx / 5)
}, FirstPersonCamera.prototype.onMouseDown = function (t) {
    pc.Mouse.isPointerLocked() || this.app.mouse.enablePointerLock()
}, FirstPersonCamera.prototype.swap = function (t) {
};
var MouseOrbit = pc.createScript("mouseOrbit");
MouseOrbit.attributes.add("target", {
    type: "entity",
    title: "Target Entity",
    description: "围绕旋转的目标"
}), MouseOrbit.attributes.add("distance", {
    type: "number",
    default: 5,
    title: "Distance"
}), MouseOrbit.attributes.add("sensitivity", {
    type: "number",
    default: .3,
    title: "Mouse Sensitivity"
}), MouseOrbit.attributes.add("minPitch", {
    type: "number",
    default: -80,
    title: "Min Pitch"
}), MouseOrbit.attributes.add("maxPitch", {
    type: "number",
    default: 80,
    title: "Max Pitch"
}), MouseOrbit.prototype.initialize = function () {
    this.yaw = 0, this.pitch = 0, this.dragging = !1, this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this), this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)
}, MouseOrbit.prototype.onMouseDown = function (t) {
    t.button === pc.MOUSEBUTTON_LEFT && (this.dragging = !0)
}, MouseOrbit.prototype.onMouseUp = function (t) {
    t.button === pc.MOUSEBUTTON_LEFT && (this.dragging = !1)
}, MouseOrbit.prototype.onMouseMove = function (t) {
    this.dragging && (this.yaw -= t.dx * this.sensitivity, this.pitch -= t.dy * this.sensitivity, this.pitch = pc.math.clamp(this.pitch, this.minPitch, this.maxPitch))
}, MouseOrbit.prototype.update = function (t) {
    if (this.target) {
        var i = pc.math.DEG_TO_RAD * this.yaw, s = pc.math.DEG_TO_RAD * this.pitch,
            e = this.distance * Math.cos(s) * Math.sin(i), o = this.distance * Math.sin(s),
            n = this.distance * Math.cos(s) * Math.cos(i);
        this.entity.setPosition(this.target.getPosition().x + e, this.target.getPosition().y + o, this.target.getPosition().z + n), this.entity.lookAt(this.target.getPosition())
    }
};
var RotateScene = pc.createScript("rotateScene");
RotateScene.attributes.add("sensitivity", {
    type: "number",
    default: .2,
    title: "Mouse Sensitivity"
}), RotateScene.attributes.add("limitX", {
    type: "number",
    default: 80,
    title: "Max X Angle"
}), RotateScene.prototype.initialize = function () {
    this.dragging = !1, this.rotX = 0, this.rotY = 0, this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this), this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this)
}, RotateScene.prototype.onMouseDown = function (t) {
    t.button === pc.MOUSEBUTTON_LEFT && (this.dragging = !0)
}, RotateScene.prototype.onMouseUp = function () {
    this.dragging = !1
}, RotateScene.prototype.onMouseMove = function (t) {
    this.dragging && (this.rotY -= t.dx * this.sensitivity, this.rotX -= t.dy * this.sensitivity, this.rotX = pc.math.clamp(this.rotX, -this.limitX, this.limitX))
}, RotateScene.prototype.update = function () {
    this.entity.setLocalEulerAngles(this.rotX, this.rotY, 0)
};
var RotateSceneWithZoom = pc.createScript("rotateSceneWithZoom");
RotateSceneWithZoom.attributes.add("rotateSensitivity", {
    type: "number",
    default: .2
}), RotateSceneWithZoom.attributes.add("zoomSensitivity", {
    type: "number",
    default: .1
}), RotateSceneWithZoom.attributes.add("minScale", {
    type: "number",
    default: .3
}), RotateSceneWithZoom.attributes.add("maxScale", {
    type: "number",
    default: 3
}), RotateSceneWithZoom.attributes.add("limitX", {
    type: "number",
    default: 80
}), RotateSceneWithZoom.prototype.initialize = function () {
    var t = this.entity.getLocalEulerAngles(), e = this.entity.getLocalScale();
    this.rotX = t.x, this.rotY = t.y, this.scale = e.x, this.dragging = !1, this.hasInput = !1, this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this), this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this), this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this)
}, RotateSceneWithZoom.prototype.onMouseDown = function (t) {
    t.button === pc.MOUSEBUTTON_LEFT && (this.dragging = !0, this.hasInput = !0)
}, RotateSceneWithZoom.prototype.onMouseUp = function () {
    this.dragging = !1
}, RotateSceneWithZoom.prototype.onMouseMove = function (t) {
    this.dragging && (this.hasInput = !0, this.rotY -= t.dx * this.rotateSensitivity, this.rotX -= t.dy * this.rotateSensitivity, this.rotX = pc.math.clamp(this.rotX, -this.limitX, this.limitX))
}, RotateSceneWithZoom.prototype.onMouseWheel = function (t) {
    this.hasInput = !0, this.scale += t.wheel * this.zoomSensitivity, this.scale = pc.math.clamp(this.scale, this.minScale, this.maxScale), this.entity.setLocalScale(this.scale, this.scale, this.scale)
}, RotateSceneWithZoom.prototype.update = function () {
    this.hasInput && this.entity.setLocalEulerAngles(this.rotX, this.rotY, 0)
};

var RobotPathMove = pc.createScript('robotPathMove');

// ===== 可调参数 =====
RobotPathMove.attributes.add('animEntity', { type: 'entity' });
RobotPathMove.attributes.add('power', { type: 'number', default: 180000 });
RobotPathMove.attributes.add('arriveDistance', { type: 'number', default: 0.15 });
RobotPathMove.attributes.add('maxSpeed', { type: 'number', default: 1.2 });
RobotPathMove.attributes.add('pauseTime', { type: 'number', default: 2 });

// ===== initialize =====
RobotPathMove.prototype.initialize = function () {
    this.path = [
        { showMessage: '去拿料', turn: '', position: { x: 1.5, y: 0.061, z: 0 }, lookAt: { x: 1.5, y: 0.061, z: 0.336 } },
        { showMessage: '去拿料', turn: '', position: { x: 1.5, y: 0.061, z: 0.336 }, lookAt: { x: 1.5, y: 0.061, z: 0.5 } },
        /* { showMessage: '拿料中', turn: 'pause', position: { x: 1.8, y: 0, z: 4.5 }, lookAt: { x: -3.8, y: 0, z: 6 } },
         { showMessage: '去加工', turn: '', position: { x: 1.8, y: 0, z: 4.5 }, lookAt: { x: 1.8, y: 0, z: -6 } },
         { showMessage: '去加工', turn: '', position: { x: 1.7, y: 0, z: 4.5 }, lookAt: { x: 1.7, y: 0, z: 2.5 } },
         { showMessage: '去加工', turn: '', position: { x: 1.7, y: 0, z: 2.5 }, lookAt: { x: 1.7, y: 0, z: 0.5 } },
         { showMessage: '去加工', turn: '', position: { x: 1.7, y: 0, z: 0.5 }, lookAt: { x: 1.7, y: 0, z: -1.1 } },
         { showMessage: '去加工', turn: '', position: { x: 1.7, y: 0, z: -1.1 }, lookAt: { x: 1.7, y: 0, z: -1.1 } },
         { showMessage: '去加工', turn: '', position: { x: 1.7, y: 0, z: -1.1 }, lookAt: { x: 0.4, y: 0, z: -0.9 } },
         { showMessage: '加工中', turn: 'pause', position: { x: 0.4, y: 0, z: -0.9 }, lookAt: { x: 0.4, y: 0, z: -0.9 } },
         { showMessage: '去检测', turn: '', position: { x: 0.4, y: 0, z: -0.9 }, lookAt: { x: 0.4, y: 0, z: -1.9 } },
         { showMessage: '去检测', turn: '', position: { x: 0.4, y: 0, z: -1.2 }, lookAt: { x: 0.4, y: 0, z: -2.9 } },
         { showMessage: '去检测', turn: '', position: { x: 0.4, y: 0, z: -2.9 }, lookAt: { x: 0.4, y: 0, z: -3.9 } },
         { showMessage: '去检测', turn: '', position: { x: 0.4, y: 0, z: -3.9 }, lookAt: { x: 0.4, y: 0, z: -6.4 } },
         { showMessage: '去检测', turn: '', position: { x: 0.4, y: 0, z: -6.4 }, lookAt: { x: 0.4, y: 0, z: -7.5 } },
         { showMessage: '检测中', turn: 'pause', position: { x: 0.3, y: 0, z: -6.5 }, lookAt: { x: -2, y: 0, z: -7.5 } },
         { showMessage: '不合格', turn: '', position: { x: 0.31, y: 0, z: -6.5 }, lookAt: { x: -2, y: 0, z: -7.5 } },
         { showMessage: '去加工', turn: '', position: { x: 0.3, y: 0, z: -6.5 }, lookAt: { x: 0.3, y: 0, z: -3.5 } },
         { showMessage: '去加工', turn: '', position: { x: 0.3, y: 0, z: -3.5 }, lookAt: { x: 0.31, y: 0, z: -0.9 } },
         { showMessage: '去加工', turn: '', position: { x: 0.31, y: 0, z: -0.9 }, lookAt: { x: 0.31, y: 0, z: -0.9 } },
         { showMessage: '加工中', turn: 'pause', position: { x: 0.31, y: 0, z: -0.9 }, lookAt: { x: -2, y: 0, z: -0.9 } },
         { showMessage: '去检测', turn: '', position: { x: 0.3, y: 0, z: -0.9 }, lookAt: { x: 0.3, y: 0, z: -0.9 } },
         { showMessage: '去检测', turn: '', position: { x: 0.3, y: 0, z: -0.9 }, lookAt: { x: 0.3, y: 0, z: -1.9 } },
         { showMessage: '去检测', turn: '', position: { x: 0.3, y: 0, z: -1.9 }, lookAt: { x: 0.3, y: 0, z: -3.9 } },
         { showMessage: '去检测', turn: '', position: { x: 0.3, y: 0, z: -3.9 }, lookAt: { x: 0.3, y: 0, z: -6.4 } },
         { showMessage: '去检测', turn: '', position: { x: 0.3, y: 0, z: -6.4 }, lookAt: { x: 0.31, y: 0, z: -6.5 } },
         { showMessage: '检测中', turn: 'pause', position: { x: 0.31, y: 0, z: -6.5 }, lookAt: { x: -2, y: 0, z: -6.5 } },
         { showMessage: '合格', turn: '', position: { x: 0.3, y: 0, z: -6.5 }, lookAt: { x: 0.29, y: 0, z: -6.5 } },
         { showMessage: '去放料', turn: '', position: { x: 0.29, y: 0, z: -6.5 }, lookAt: { x: 0.29, y: 0, z: -3.7 } },
         { showMessage: '去放料', turn: '', position: { x: 0.29, y: 0, z: -3.7 }, lookAt: { x: 0.3, y: 0, z: 0 } },
         { showMessage: '去放料', turn: '', position: { x: 0.3, y: 0, z: 0 }, lookAt: { x: 0.3, y: 0, z: 2 } },
         { showMessage: '去放料', turn: '', position: { x: 0.3, y: 0, z: 2 }, lookAt: { x: 0.3, y: 0, z: 2.7 } },
         { showMessage: '去放料', turn: '', position: { x: 0.3, y: 0, z: 2.7 }, lookAt: { x: 0.3, y: 0, z: 2.7 } },
         { showMessage: '去放料', turn: '', position: { x: 0.3, y: 0, z: 2.7 }, lookAt: { x: -1, y: 0, z: 2.7 } },
         { showMessage: '去放料', turn: '', position: { x: -1, y: 0, z: 2.7 }, lookAt: { x: -1, y: 0, z: 2.7 } },
         { showMessage: '去放料', turn: '', position: { x: -1, y: 0, z: 2.7 }, lookAt: { x: -1, y: 0, z: 2.7 } },
         { showMessage: '去放料', turn: '', position: { x: -1, y: 0, z: 2.7 }, lookAt: { x: -1.2, y: 0, z: 4.5 } },
         { showMessage: '放料中', turn: 'pause', position: { x: -1.2, y: 0, z: 4.5 }, lookAt: { x: -1.3, y: 0, z: 4.5 } },
         { showMessage: '去拿料', turn: '', position: { x: -1.3, y: 0, z: 4.5 }, lookAt: { x: -1.3, y: 0, z: 2.7 } },
         { showMessage: '去拿料', turn: '', position: { x: -1.3, y: 0, z: 2.7 }, lookAt: { x: 1.8, y: 0, z: 2.5 } },
         { showMessage: '去拿料', turn: '', position: { x: 1.8, y: 0, z: 2.5 }, lookAt: { x: 1.8, y: 0, z: 4.5 } } */
    ];

    this._index = 0;
    this._pauseTimer = 0;

    this._moveDir = new pc.Vec3();
    this._lookDir = new pc.Vec3();
    this._targetAngle = 0;

    var initEuler = this.animEntity
        ? this.animEntity.getEulerAngles().clone()
        : this.entity.getEulerAngles().clone();

    this._baseEuler = initEuler;
    this._angle = initEuler.y;

    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

    this._targetMarker = new pc.Entity('TargetMarker');
    this._targetMarker.addComponent('model', { type: 'box' });
    this._targetMarker.setLocalScale(0.1, 0.1, 0.1);
    var sceneRoot = this.app.root.findByName('SceneRoot');
    if (sceneRoot) {
        sceneRoot.addChild(this._targetMarker);
    } else {
        this.app.root.addChild(this._targetMarker);
    }
};

// ===== update =====
RobotPathMove.prototype.update = function (dt) {
    if (!this.entity.rigidbody) return;
    if (this._index >= this.path.length) return;

    var node = this.path[this._index];
    var pos = this.entity.getPosition();

    // ===== pause 点 =====
    if (node.turn === 'pause') {
        this._pauseTimer += dt;
        this.updateLookAt(node, dt);

        if (this._pauseTimer >= this.pauseTime) {
            this._pauseTimer = 0;
            this._index++;
        }
        return;
    }

    // ===== 移动 =====
    var targetPos = node.position;
    this._moveDir.set(
        targetPos.x - pos.x,
        0,
        targetPos.z - pos.z
    );

    if (this._targetMarker) {
        this._targetMarker.setPosition(targetPos.x, targetPos.y, targetPos.z);
    }

    var dist = this._moveDir.length();

    // 到达当前点
    if (dist < this.arriveDistance) {
        if (this.entity.rigidbody) {
            this.entity.rigidbody.linearVelocity.set(0, 0, 0);
            this.entity.rigidbody.angularVelocity.set(0, 0, 0);
        }
        this.entity.setPosition(targetPos.x, targetPos.y, targetPos.z);
        this._index++;
        return;
    }

    this._moveDir.normalize();

    // 限速
    var vel = this.entity.rigidbody.linearVelocity;
    if (vel.length() < this.maxSpeed) {
        this._moveDir.scale(this.power * dt);
        this.entity.rigidbody.applyForce(this._moveDir);
    }

    // 朝向移动方向
    this.updateMoveRotation(dt);
};

// ===== 移动时朝向 =====
RobotPathMove.prototype.updateMoveRotation = function (dt) {
    var dir = this._moveDir;
    if (dir.lengthSq() === 0) return;

    this._targetAngle = Math.atan2(dir.x, dir.z) * pc.math.RAD_TO_DEG + 180;

    this._angle = pc.math.lerpAngle(this._angle, this._targetAngle, 0.15);

    var baseX = this._baseEuler ? this._baseEuler.x : 0;
    var baseZ = this._baseEuler ? this._baseEuler.z : 0;

    if (this.animEntity) {
        this.animEntity.setEulerAngles(baseX, this._angle, baseZ);
    } else {
        this.entity.setEulerAngles(baseX, this._angle, baseZ);
    }
};

// ===== lookAt 点朝向 =====
RobotPathMove.prototype.updateLookAt = function (node, dt) {
    var pos = this.entity.getPosition();
    var look = node.lookAt;

    this._lookDir.set(
        look.x - pos.x,
        0,
        look.z - pos.z
    );

    if (this._lookDir.lengthSq() === 0) return;

    this._lookDir.normalize();

    this._targetAngle = Math.atan2(this._lookDir.x, this._lookDir.z) * pc.math.RAD_TO_DEG + 180;

    this._angle = pc.math.lerpAngle(this._angle, this._targetAngle, 0.15);

    var baseX = this._baseEuler ? this._baseEuler.x : 0;
    var baseZ = this._baseEuler ? this._baseEuler.z : 0;

    if (this.animEntity) {
        this.animEntity.setEulerAngles(baseX, this._angle, baseZ);
    } else {
        this.entity.setEulerAngles(baseX, this._angle, baseZ);
    }
};

RobotPathMove.prototype.onMouseDown = function(event) {
    var cameraEntity = this.app.root.findByName('Camera');
    if (!cameraEntity || !cameraEntity.camera) return;
    var camera = cameraEntity.camera;

    var mouseX = event.x;
    var mouseY = event.y;

    var from = camera.screenToWorld(mouseX, mouseY, camera.nearClip);
    var to = camera.screenToWorld(mouseX, mouseY, camera.farClip);

    var dir = to.clone().sub(from).normalize();

    var t = -from.y / dir.y;
    var point = from.clone().add(dir.clone().scale(t));

    console.log('点击坐标:', point);
};
