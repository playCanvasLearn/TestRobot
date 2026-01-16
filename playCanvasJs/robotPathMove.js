var RobotPathMove = pc.createScript('robotPathMove');

// ===== 可调参数 =====
RobotPathMove.attributes.add('animEntity', { type: 'entity' });
RobotPathMove.attributes.add('power', { type: 'number', default: 400000 });
RobotPathMove.attributes.add('arriveDistance', { type: 'number', default: 0.15 });
RobotPathMove.attributes.add('maxSpeed', { type: 'number', default: 3 });
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
    this._angle = this.animEntity
        ? this.animEntity.getEulerAngles().y
        : this.entity.getEulerAngles().y;

    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
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

    var dist = this._moveDir.length();

    // 到达当前点
    if (dist < this.arriveDistance) {
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

    this._targetAngle =
        90 - Math.atan2(dir.z, dir.x) * pc.math.RAD_TO_DEG;

    this._angle = pc.math.lerpAngle(this._angle, this._targetAngle, 0.15);

    if (this.animEntity) {
        this.animEntity.setEulerAngles(0, this._angle, 0);
    } else {
        this.entity.setEulerAngles(0, this._angle, 0);
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

    this._targetAngle =
        90 - Math.atan2(this._lookDir.z, this._lookDir.x) * pc.math.RAD_TO_DEG;

    this._angle = pc.math.lerpAngle(this._angle, this._targetAngle, 0.15);

    if (this.animEntity) {
        this.animEntity.setEulerAngles(0, this._angle, 0);
    } else {
        this.entity.setEulerAngles(0, this._angle, 0);
    }
};

RobotPathMove.prototype.onMouseDown = function(event) {
    // 获取屏幕坐标，转换到世界坐标（y=0平面）
    var camera = this.app.root.findByName('Camera').camera; // 替换为你的相机名字
    var mouseX = this.app.mouse.x / this.app.graphicsDevice.width;
    var mouseY = this.app.mouse.y / this.app.graphicsDevice.height;

    var ray = camera.screenPointToRay(mouseX, mouseY);

    // 计算与 y=0 平面的交点
    var t = -ray.origin.y / ray.direction.y;
    var point = ray.origin.clone().add(ray.direction.clone().scale(t));

    console.log('点击坐标:', point);
};
