"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
var React = __importStar(require("react"));
var react_native_1 = require("react-native");
var Block = function (_a) {
    var style = _a.style, dragStartAnimationStyle = _a.dragStartAnimationStyle, onPress = _a.onPress, onLongPress = _a.onLongPress, children = _a.children, panHandlers = _a.panHandlers, delayLongPress = _a.delayLongPress;
    return (<react_native_1.Animated.View style={[styles.blockContainer, style, dragStartAnimationStyle]} {...panHandlers}>
      <react_native_1.Animated.View>
        <react_native_1.TouchableWithoutFeedback delayLongPress={delayLongPress} onPress={onPress} onLongPress={onLongPress}>
          {children}
        </react_native_1.TouchableWithoutFeedback>
      </react_native_1.Animated.View>
    </react_native_1.Animated.View>);
};
exports.Block = Block;
var styles = react_native_1.StyleSheet.create({
    blockContainer: {
        alignItems: 'center',
    },
});
//# sourceMappingURL=block.js.map