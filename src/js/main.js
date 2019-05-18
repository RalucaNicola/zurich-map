define(["require", "exports", "./State", "./ui", "./scene"], function (require, exports, State_1, ui_1, scene_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var state = new State_1.default();
    ui_1.default(state);
    scene_1.default(state);
});
