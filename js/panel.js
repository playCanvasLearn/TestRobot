export function createPanel({
    GUI,
    robot,
    skeleton,
    axesHelper,
    lookAtGroup,
    actions,
    crossTo,
    setWeight,
    walkAction,
    takeAction,
    trunLeftAction,
    trunRightAction,
    stopAction
}) {
    const panel = new GUI({ width: 310 });
    const folder1 = panel.addFolder('Visibility');
    const folder3 = panel.addFolder('Pausing/Stepping');
    const folder4 = panel.addFolder('Crossfading');
    const folder5 = panel.addFolder('Blend Weights');

    const settings = {
        'show robot': true,
        'show skeleton': false,
        'show axes': false,
        'show lookAt': false,
        'loop animation': false,
        'modify step size': 0.05,
        'use default duration': 0.5,
        'set custom duration': 0.5,
        'walk weight': 1.0,
        'take weight': 0.6,
        'turn left weight': 0.8,
        'turn right weight': 0.8,
        'stop weight': 1
    };
    folder1.add(settings, 'show robot').onChange(v => { if (robot) robot.visible = v; });
    folder1.add(settings, 'show skeleton').onChange(v => { if (skeleton) skeleton.visible = v; });
    folder1.add(settings, 'show axes').onChange(v => { if (axesHelper) axesHelper.visible = v; });
    folder1.add(settings, 'show lookAt').onChange(v => { if (lookAtGroup) lookAtGroup.visible = v; });
    folder1.add(settings, 'loop animation');
    folder3.add(settings, 'modify step size', 0.01, 0.1, 0.001);
    folder4.add(settings, 'use default duration');
    folder4.add(settings, 'set custom duration', 0, 10, 0.01);
    folder4.add({ f: () => crossTo(walkAction) }, 'f').name('to walk');
    folder4.add({ f: () => crossTo(takeAction) }, 'f').name('to take');
    folder4.add({ f: () => crossTo(trunLeftAction) }, 'f').name('to turn left');
    folder4.add({ f: () => crossTo(trunRightAction) }, 'f').name('to turn right');
    folder4.add({ f: () => crossTo(stopAction) }, 'f').name('to stop');
    folder5.add(settings, 'walk weight', 0, 1, 0.01).listen().onChange(w => setWeight(walkAction, w));
    folder5.add(settings, 'take weight', 0, 1, 0.01).listen().onChange(w => setWeight(takeAction, w));
    folder5.add(settings, 'turn left weight', 0, 1, 0.01).listen().onChange(w => setWeight(trunLeftAction, w));
    folder5.add(settings, 'turn right weight', 0, 1, 0.01).listen().onChange(w => setWeight(trunRightAction, w));
    folder5.add(settings, 'stop weight', 0, 1, 0.01).listen().onChange(w => setWeight(stopAction, w));
    folder1.open();
    folder3.open();
    folder4.open();
    folder5.open();
    return settings;
}
