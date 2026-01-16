// 创建 PlayCanvas 脚本：机器人沿路径移动
var RobotPathMove = pc.createScript('robotPathMove');

/* =========================================================
 * 可调参数（在 Editor 面板中可配置）
 * ========================================================= */

// 用于控制动画朝向的实体（通常是模型节点）
// 如果不填，则默认使用当前 entity 本身旋转
RobotPathMove.attributes.add('animEntity', { type: 'entity' });

// 施加给刚体的力大小（越大加速越快）
RobotPathMove.attributes.add('power', { type: 'number', default: 180000 });

// 到达路径点的判定距离（小于该值认为“到点”）
RobotPathMove.attributes.add('arriveDistance', { type: 'number', default: 0.15 });

// 最大移动速度限制（防止物理速度失控）
RobotPathMove.attributes.add('maxSpeed', { type: 'number', default: 1.2 });

// pause 节点停留时间（秒）
RobotPathMove.attributes.add('pauseTime', { type: 'number', default: 2 });

/* =========================================================
 * initialize：脚本初始化
 * ========================================================= */
RobotPathMove.prototype.initialize = function () {

    /**
     * 路径数据：
     * - position：目标位置
     * - lookAt：到点后或 pause 时朝向的位置
     * - turn === 'pause' 表示停留节点
     */
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

    // 当前路径索引
    this._index = 0;

    // pause 节点累计时间
    this._pauseTimer = 0;

    // 复用向量，避免每帧 new 对象（性能优化）
    this._moveDir = new pc.Vec3();   // 移动方向
    this._lookDir = new pc.Vec3();   // 朝向方向

    // 目标角度（Y 轴）
    this._targetAngle = 0;

    /**
     * 记录初始欧拉角
     * 用途：
     * - 保留 X / Z 轴姿态
     * - 只控制 Y 轴旋转
     */
    var initEuler = this.animEntity
        ? this.animEntity.getEulerAngles().clone()
        : this.entity.getEulerAngles().clone();

    this._baseEuler = initEuler; // 初始姿态
    this._angle = initEuler.y;   // 当前 Y 轴角度（用于插值）

    // 监听鼠标点击（用于调试坐标）
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

    /**
     * 创建一个目标点可视化 Marker
     * 方便在场景中看到当前移动目标
     */
    this._targetMarker = new pc.Entity('TargetMarker');
    this._targetMarker.addComponent('model', { type: 'box' });
    this._targetMarker.setLocalScale(0.3, 0.3, 0.3);

    var sceneRoot = this.app.root.findByName('SceneRoot');
    (sceneRoot || this.app.root).addChild(this._targetMarker);
};

/* =========================================================
 * update：每帧更新
 * ========================================================= */
RobotPathMove.prototype.update = function (dt) {

    // 必须有刚体才能移动
    if (!this.entity.rigidbody) return;

    // 路径走完直接结束
    if (this._index >= this.path.length) {
        _index = 0;
    };

    var node = this.path[this._index];
    var pos = this.entity.getPosition();

    /* ===============================
     * pause 节点逻辑
     * =============================== */
    if (node.turn === 'pause') {

        // 累计停留时间
        this._pauseTimer += dt;

        // 停留期间只转向，不移动
        this.updateLookAt(node, dt);

        // 停留结束，进入下一个路径点
        if (this._pauseTimer >= this.pauseTime) {
            this._pauseTimer = 0;
            this._index++;
        }
        return;
    }

    /* ===============================
     * 移动逻辑
     * =============================== */

    var targetPos = node.position;

    // 只在 XZ 平面移动（忽略 Y）
    this._moveDir.set(
        targetPos.x - pos.x,
        0,
        targetPos.z - pos.z
    );

    // 更新可视化 Marker
    if (this._targetMarker) {
        this._targetMarker.setPosition(targetPos.x, targetPos.y, targetPos.z);
    }

    var dist = this._moveDir.length();

    /* 到达路径点 */
    if (dist < this.arriveDistance) {

        // 强制停止刚体（防止抖动）
        this.entity.rigidbody.linearVelocity.set(0, 0, 0);
        this.entity.rigidbody.angularVelocity.set(0, 0, 0);

        // 精确贴合到目标点
        this.entity.setPosition(targetPos.x, targetPos.y, targetPos.z);

        // 切换到下一个路径点
        this._index++;
        return;
    }

    // 方向归一化
    this._moveDir.normalize();

    /* ===============================
     * 施加力 + 限速
     * =============================== */
    var vel = this.entity.rigidbody.linearVelocity;

    // 未达到最大速度才继续施加力
    if (vel.length() < this.maxSpeed) {
        this._moveDir.scale(this.power * dt);
        this.entity.rigidbody.applyForce(this._moveDir);
    }

    // 移动时同步朝向
    this.updateMoveRotation(dt);
};

/* =========================================================
 * 移动时的朝向控制（面向移动方向）
 * ========================================================= */
RobotPathMove.prototype.updateMoveRotation = function (dt) {

    var dir = this._moveDir;
    if (dir.lengthSq() === 0) return;

    /**
     * atan2(x, z)：
     * - PlayCanvas 默认前方是 +Z
     * - 返回弧度，需要转成角度
     */
    this._targetAngle =
        Math.atan2(dir.x, dir.z) * pc.math.RAD_TO_DEG + 180;

    // 角度插值（平滑转身，防抖）
    this._angle = pc.math.lerpAngle(this._angle, this._targetAngle, 0.15);

    // 只控制 Y 轴，X/Z 保持初始姿态
    var baseX = this._baseEuler.x;
    var baseZ = this._baseEuler.z;

    // 优先控制 animEntity（模型）
    (this.animEntity || this.entity)
        .setEulerAngles(baseX, this._angle, baseZ);
};

/* =========================================================
 * pause 节点的 lookAt 朝向控制
 * ========================================================= */
RobotPathMove.prototype.updateLookAt = function (node, dt) {

    var pos = this.entity.getPosition();
    var look = node.lookAt;

    // 计算朝向向量（XZ 平面）
    this._lookDir.set(
        look.x - pos.x,
        0,
        look.z - pos.z
    );

    if (this._lookDir.lengthSq() === 0) return;

    this._lookDir.normalize();

    this._targetAngle =
        Math.atan2(this._lookDir.x, this._lookDir.z) * pc.math.RAD_TO_DEG + 180;

    this._angle = pc.math.lerpAngle(this._angle, this._targetAngle, 0.15);

    var baseX = this._baseEuler.x;
    var baseZ = this._baseEuler.z;

    (this.animEntity || this.entity)
        .setEulerAngles(baseX, this._angle, baseZ);
};

/* =========================================================
 * 鼠标点击：输出点击到地面的世界坐标（调试用）
 * ========================================================= */
RobotPathMove.prototype.onMouseDown = function (event) {

    var cameraEntity = this.app.root.findByName('Camera');
    if (!cameraEntity || !cameraEntity.camera) return;

    var camera = cameraEntity.camera;

    // 屏幕坐标 → 世界射线
    var from = camera.screenToWorld(event.x, event.y, camera.nearClip);
    var to   = camera.screenToWorld(event.x, event.y, camera.farClip);

    var dir = to.clone().sub(from).normalize();

    // 与 y = 0 平面的交点
    var t = -from.y / dir.y;
    var point = from.clone().add(dir.clone().scale(t));

    console.log('点击坐标:', point);
};
