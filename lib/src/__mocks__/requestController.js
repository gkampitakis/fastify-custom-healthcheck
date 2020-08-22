function Controller (...args) {
  ControllerSpy(...args);
}

const ControllerSpy = jest.fn();

module.exports = Controller;
module.exports.ControllerSpy = ControllerSpy;
