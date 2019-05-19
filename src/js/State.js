define(["require", "exports", "esri/core/Accessor", "esri/core/accessorSupport/decorators"], function (require, exports, Accessor, decorators_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var State = /** @class */ (function (_super) {
        __extends(State, _super);
        function State() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.sliderIsOpen = false;
            _this.smallViewport = _this.hasSmallViewport();
            _this.currentPoi = null;
            _this.images = null;
            _this.imagesChanged = false;
            _this.cleanUp = null;
            return _this;
        }
        State.prototype.hasSmallViewport = function () {
            var mediaQuery = window.matchMedia("(max-width: 700px)");
            if (mediaQuery.matches) {
                return true;
            }
            else {
                return false;
            }
        };
        __decorate([
            decorators_1.property()
        ], State.prototype, "sliderIsOpen", void 0);
        __decorate([
            decorators_1.property({ readOnly: true })
        ], State.prototype, "smallViewport", void 0);
        __decorate([
            decorators_1.property()
        ], State.prototype, "currentPoi", void 0);
        __decorate([
            decorators_1.property()
        ], State.prototype, "images", void 0);
        __decorate([
            decorators_1.property()
        ], State.prototype, "imagesChanged", void 0);
        __decorate([
            decorators_1.property()
        ], State.prototype, "cleanUp", void 0);
        State = __decorate([
            decorators_1.subclass()
        ], State);
        return State;
    }(decorators_1.declared(Accessor)));
    exports.default = State;
});
