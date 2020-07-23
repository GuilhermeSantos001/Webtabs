function CONTROLLER() {
    throw new Error('This is a static class');
}

CONTROLLER._frameEmpty = null;

CONTROLLER.setframeEmpty = function (value) {
    CONTROLLER._frameEmpty = value;
};

CONTROLLER.frameEmpty = function () {
    return CONTROLLER._frameEmpty;
};

module.exports = CONTROLLER;