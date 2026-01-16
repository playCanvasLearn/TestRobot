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
