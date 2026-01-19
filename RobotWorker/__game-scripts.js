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










// 创建 PlayCanvas 脚本：机器人沿路径移动
var RobotPathMove = pc.createScript('robotPathMove');

/* =========================================================
 * 可调参数（在 Editor 面板中可配置）
 * ========================================================= */

// 用于控制动画朝向的实体（通常是模型节点）
// 如果不填，则默认使用当前 entity 本身旋转
RobotPathMove.attributes.add('animEntity', { type: 'entity' });

// 到达路径点的判定距离（小于该值认为“到点”）
RobotPathMove.attributes.add('arriveDistance', { type: 'number', default: 0.15 });

// 最大移动速度限制（防止物理速度失控）
RobotPathMove.attributes.add('moveSpeed', { type: 'number', default: 0.8});

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
        { showMessage: '去拿料', turn: '', position: { x: 1.5, y: 0.061, z: 1.336 }, lookAt: { x: 1.5, y: 0.061, z: 1.5 } },
        { showMessage: '拿料中', turn: 'pause', position: { x: 1.5, y: 0.061, z: 2.5 }, lookAt: { x: 1.5, y: 0.061, z: 2.6 } },
        /* { showMessage: '去加工', turn: '', position: { x: 1.8, y: 0, z: 4.5 }, lookAt: { x: 1.8, y: 0, z: -6 } },
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
        this._index = 0;
    };

    var node = this.path[this._index];
    var target = node.position;

    var pos = this.entity.getPosition();

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
    // XZ 平面方向
    this._moveDir.set(
        target.x - pos.x,
        0,
        target.z - pos.z
    );

    // 更新可视化 Marker
    if (this._targetMarker) {
        this._targetMarker.setPosition(target.x, target.y, target.z);
    }

    var dist = this._moveDir.length();

    /* ===== 到点 ===== */
    if (dist <= this.arriveDistance) {

        // 精确贴点
        this.entity.setPosition(
            target.x,
            target.y,
            target.z
        );

        // 切换到另一个点（0 ↔ 1）
        this._index = this._index + 1;
        return;
    }

    /* ===== 位移移动（无物理） ===== */
    this._moveDir.normalize();

    var step = this.moveSpeed * dt;

    // 防止跨过目标
    if (step > dist) step = dist;

    pos.x += this._moveDir.x * step;
    pos.z += this._moveDir.z * step;

    this.entity.setPosition(pos);

    // 朝向同步
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
        Math.atan2(dir.x, dir.z) * pc.math.RAD_TO_DEG;

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
    var dir = this._moveDir;
    if (dir.lengthSq() === 0) return;
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

    this._targetAngle =  Math.atan2(dir.x, dir.z) * pc.math.RAD_TO_DEG;

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
