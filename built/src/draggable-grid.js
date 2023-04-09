"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.DraggableGrid = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_native_1 = require("react-native");
var block_1 = require("./block");
var utils_1 = require("./utils");
var activeBlockOffset = { x: 0, y: 0 };
var DraggableGrid = function (props) {
    var blockPositions = (0, react_1.useState)([])[0];
    var orderMap = (0, react_1.useState)({})[0];
    var itemMap = (0, react_1.useState)({})[0];
    var items = (0, react_1.useState)([])[0];
    var _a = (0, react_1.useState)(0), blockHeight = _a[0], setBlockHeight = _a[1];
    var _b = (0, react_1.useState)(0), blockWidth = _b[0], setBlockWidth = _b[1];
    var gridHeight = (0, react_1.useState)(new react_native_1.Animated.Value(0))[0];
    var _c = (0, react_1.useState)(false), hadInitBlockSize = _c[0], setHadInitBlockSize = _c[1];
    var dragStartAnimatedValue = (0, react_1.useState)(new react_native_1.Animated.Value(1))[0];
    var _d = (0, react_1.useState)({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }), gridLayout = _d[0], setGridLayout = _d[1];
    var _e = (0, react_1.useState)(), activeItemIndex = _e[0], setActiveItemIndex = _e[1];
    var assessGridSize = function (event) {
        if (!hadInitBlockSize) {
            var blockWidth_1 = event.nativeEvent.layout.width / props.numColumns;
            var blockHeight_1 = props.itemHeight || blockWidth_1;
            setBlockWidth(blockWidth_1);
            setBlockHeight(blockHeight_1);
            setGridLayout(event.nativeEvent.layout);
            setHadInitBlockSize(true);
        }
    };
    var _f = (0, react_1.useState)(false), panResponderCapture = _f[0], setPanResponderCapture = _f[1];
    var panResponder = react_native_1.PanResponder.create({
        onStartShouldSetPanResponder: function () { return true; },
        onStartShouldSetPanResponderCapture: function () { return false; },
        onMoveShouldSetPanResponder: function () { return panResponderCapture; },
        onMoveShouldSetPanResponderCapture: function () { return panResponderCapture; },
        onShouldBlockNativeResponder: function () { return false; },
        onPanResponderTerminationRequest: function () { return false; },
        onPanResponderGrant: onStartDrag,
        onPanResponderMove: onHandMove,
        onPanResponderRelease: onHandRelease,
    });
    function initBlockPositions() {
        items.forEach(function (_, index) {
            blockPositions[index] = getBlockPositionByOrder(index);
        });
    }
    function getBlockPositionByOrder(order) {
        if (blockPositions[order]) {
            return blockPositions[order];
        }
        var columnOnRow = order % props.numColumns;
        var y = blockHeight * Math.floor(order / props.numColumns);
        var x = columnOnRow * blockWidth;
        return {
            x: x,
            y: y,
        };
    }
    function resetGridHeight() {
        var rowCount = Math.ceil(props.data.length / props.numColumns);
        gridHeight.setValue(rowCount * blockHeight);
    }
    function onBlockPress(itemIndex) {
        var _a;
        var item = (_a = items[itemIndex]) === null || _a === void 0 ? void 0 : _a.itemData;
        props.onItemPress && item && props.onItemPress(item);
    }
    function onStartDrag(_, gestureState) {
        var _a;
        var activeItem = getActiveItem();
        if (!activeItem)
            return false;
        props.onDragStart && props.onDragStart(activeItem.itemData);
        var x0 = gestureState.x0, y0 = gestureState.y0, moveX = gestureState.moveX, moveY = gestureState.moveY;
        var order = (_a = orderMap[activeItem.key]) === null || _a === void 0 ? void 0 : _a.order;
        if (!order) {
            return;
        }
        var activeOrigin = blockPositions[order];
        if (!activeOrigin) {
            return;
        }
        var x = activeOrigin.x - x0;
        var y = activeOrigin.y - y0;
        activeItem.currentPosition.setOffset({
            x: x,
            y: y,
        });
        activeBlockOffset = {
            x: x,
            y: y,
        };
        activeItem.currentPosition.setValue({
            x: moveX,
            y: moveY,
        });
        return true;
    }
    function onHandMove(_, gestureState) {
        var _a, _b, _c;
        var activeItem = getActiveItem();
        if (!activeItem)
            return false;
        var moveX = gestureState.moveX, moveY = gestureState.moveY;
        props.onDragging && props.onDragging(gestureState);
        var xChokeAmount = Math.max(0, activeBlockOffset.x + moveX - (gridLayout.width - blockWidth));
        var xMinChokeAmount = Math.min(0, activeBlockOffset.x + moveX);
        var dragPosition = {
            x: moveX - xChokeAmount - xMinChokeAmount,
            y: moveY,
        };
        var order = (_a = orderMap[activeItem.key]) === null || _a === void 0 ? void 0 : _a.order;
        if (!order) {
            return false;
        }
        var originPosition = blockPositions[order];
        if (!originPosition) {
            return false;
        }
        var dragPositionToActivePositionDistance = getDistance(dragPosition, originPosition);
        activeItem.currentPosition.setValue(dragPosition);
        var closetItemIndex = activeItemIndex;
        var closetDistance = dragPositionToActivePositionDistance;
        items.forEach(function (item, index) {
            var _a;
            if (item.itemData.disabledReSorted)
                return;
            if (index != activeItemIndex) {
                var itemOrder = (_a = orderMap[item.key]) === null || _a === void 0 ? void 0 : _a.order;
                if (!itemOrder) {
                    return;
                }
                var itemPosition = blockPositions[itemOrder];
                if (!itemPosition) {
                    return;
                }
                var dragPositionToItemPositionDistance = getDistance(dragPosition, itemPosition);
                if (dragPositionToItemPositionDistance < closetDistance &&
                    dragPositionToItemPositionDistance < blockWidth) {
                    closetItemIndex = index;
                    closetDistance = dragPositionToItemPositionDistance;
                }
            }
        });
        if (activeItemIndex != closetItemIndex) {
            var closetKey = (_b = items[closetItemIndex]) === null || _b === void 0 ? void 0 : _b.key;
            if (!closetKey) {
                return false;
            }
            var closetOrder = (_c = orderMap[closetKey]) === null || _c === void 0 ? void 0 : _c.order;
            if (!closetOrder) {
                return false;
            }
            var activeOrder = orderMap[activeItem.key];
            if (!activeOrder) {
                return false;
            }
            resetBlockPositionByOrder(activeOrder.order, closetOrder);
            activeOrder.order = closetOrder;
            props.onResetSort && props.onResetSort(getSortData());
        }
        return true;
    }
    function onHandRelease() {
        var activeItem = getActiveItem();
        if (!activeItem)
            return false;
        props.onDragRelease && props.onDragRelease(getSortData());
        setPanResponderCapture(false);
        activeItem.currentPosition.flattenOffset();
        moveBlockToBlockOrderPosition(activeItem.key);
        setActiveItemIndex(undefined);
        return true;
    }
    function resetBlockPositionByOrder(activeItemOrder, insertedPositionOrder) {
        var disabledReSortedItemCount = 0;
        if (activeItemOrder > insertedPositionOrder) {
            for (var i = activeItemOrder - 1; i >= insertedPositionOrder; i--) {
                var key = getKeyByOrder(i);
                var item = itemMap[key];
                if (item && item.disabledReSorted) {
                    disabledReSortedItemCount++;
                }
                else {
                    var itemOrder = orderMap[key];
                    if (itemOrder) {
                        itemOrder.order += disabledReSortedItemCount + 1;
                        disabledReSortedItemCount = 0;
                        moveBlockToBlockOrderPosition(key);
                    }
                }
            }
        }
        else {
            for (var i = activeItemOrder + 1; i <= insertedPositionOrder; i++) {
                var key = getKeyByOrder(i);
                var item = itemMap[key];
                if (item && item.disabledReSorted) {
                    disabledReSortedItemCount++;
                }
                else {
                    var itemOrder = orderMap[key];
                    if (itemOrder) {
                        itemOrder.order -= disabledReSortedItemCount + 1;
                        disabledReSortedItemCount = 0;
                        moveBlockToBlockOrderPosition(key);
                    }
                }
            }
        }
    }
    function moveBlockToBlockOrderPosition(itemKey) {
        var _a, _b;
        var itemIndex = (0, utils_1.findIndex)(items, function (item) { return "".concat(item.key) === "".concat(itemKey); });
        var item = items[itemIndex];
        if (!item) {
            return;
        }
        var itemOrder = (_a = orderMap[itemKey]) === null || _a === void 0 ? void 0 : _a.order;
        if (!itemOrder) {
            return;
        }
        item.currentPosition.flattenOffset();
        react_native_1.Animated.timing(item.currentPosition, {
            toValue: (_b = blockPositions[itemOrder]) !== null && _b !== void 0 ? _b : { x: 0, y: 0 },
            duration: 200,
            useNativeDriver: false,
        }).start();
    }
    function getKeyByOrder(order) {
        return (0, utils_1.findKey)(orderMap, function (item) { return item.order === order; });
    }
    function getSortData() {
        var sortData = [];
        items.forEach(function (item) {
            var _a;
            var itemOrder = (_a = orderMap[item.key]) === null || _a === void 0 ? void 0 : _a.order;
            if (itemOrder) {
                sortData[itemOrder] = item.itemData;
            }
        });
        return sortData;
    }
    function getDistance(startOffset, endOffset) {
        var xDistance = startOffset.x + activeBlockOffset.x - endOffset.x;
        var yDistance = startOffset.y + activeBlockOffset.y - endOffset.y;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }
    function setActiveBlock(itemIndex, item) {
        if (item.disabledDrag)
            return;
        setPanResponderCapture(true);
        setActiveItemIndex(itemIndex);
    }
    function startDragStartAnimation() {
        if (!props.dragStartAnimation) {
            dragStartAnimatedValue.setValue(1);
            react_native_1.Animated.timing(dragStartAnimatedValue, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }
    }
    function getBlockStyle(itemIndex) {
        var item = items[itemIndex];
        return [
            {
                justifyContent: 'center',
                alignItems: 'center',
            },
            hadInitBlockSize && item && {
                width: blockWidth,
                height: blockHeight,
                position: 'absolute',
                top: item.currentPosition.getLayout()['top'],
                left: item.currentPosition.getLayout()['left'],
            },
        ];
    }
    function getDragStartAnimation(itemIndex) {
        if (activeItemIndex != itemIndex) {
            return;
        }
        var dragStartAnimation = props.dragStartAnimation || getDefaultDragStartAnimation();
        return __assign({ zIndex: 3 }, dragStartAnimation);
    }
    function getActiveItem() {
        if (activeItemIndex === undefined)
            return false;
        return items[activeItemIndex];
    }
    function getDefaultDragStartAnimation() {
        return {
            transform: [
                {
                    scale: dragStartAnimatedValue,
                },
            ],
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            shadowOffset: {
                width: 1,
                height: 1,
            },
        };
    }
    function addItem(item, index) {
        blockPositions.push(getBlockPositionByOrder(items.length));
        orderMap[item.key] = {
            order: index,
        };
        itemMap[item.key] = item;
        items.push({
            key: item.key,
            itemData: item,
            currentPosition: new react_native_1.Animated.ValueXY(getBlockPositionByOrder(index)),
        });
    }
    function removeItem(item) {
        var itemIndex = (0, utils_1.findIndex)(items, function (curItem) { return curItem.key === item.key; });
        items.splice(itemIndex, 1);
        blockPositions.pop();
        delete orderMap[item.key];
    }
    function diffData() {
        props.data.forEach(function (item, index) {
            var itemOrder = orderMap[item.key];
            if (itemOrder) {
                if (itemOrder.order != index) {
                    itemOrder.order = index;
                    moveBlockToBlockOrderPosition(item.key);
                }
                var currentItem = items.find(function (i) { return i.key === item.key; });
                if (currentItem) {
                    currentItem.itemData = item;
                }
                itemMap[item.key] = item;
            }
            else {
                addItem(item, index);
            }
        });
        var deleteItems = (0, utils_1.differenceBy)(items, props.data, 'key');
        deleteItems.forEach(function (item) {
            removeItem(item);
        });
    }
    (0, react_1.useEffect)(function () {
        startDragStartAnimation();
    }, [activeItemIndex]);
    (0, react_1.useEffect)(function () {
        if (hadInitBlockSize) {
            initBlockPositions();
        }
    }, [gridLayout]);
    (0, react_1.useEffect)(function () {
        resetGridHeight();
    });
    if (hadInitBlockSize) {
        diffData();
    }
    var itemList = items.map(function (item, itemIndex) {
        var _a;
        return (<block_1.Block onPress={onBlockPress.bind(null, itemIndex)} onLongPress={setActiveBlock.bind(null, itemIndex, item.itemData)} panHandlers={panResponder.panHandlers} style={getBlockStyle(itemIndex)} dragStartAnimationStyle={getDragStartAnimation(itemIndex)} delayLongPress={props.delayLongPress || 300} key={item.key}>
        {props.renderItem(item.itemData, (_a = orderMap[item.key]) === null || _a === void 0 ? void 0 : _a.order)}
      </block_1.Block>);
    });
    return (<react_native_1.Animated.View style={[
            styles.draggableGrid,
            props.style,
            {
                height: gridHeight,
            },
        ]} onLayout={assessGridSize}>
      {hadInitBlockSize && itemList}
    </react_native_1.Animated.View>);
};
exports.DraggableGrid = DraggableGrid;
var styles = react_native_1.StyleSheet.create({
    draggableGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
//# sourceMappingURL=draggable-grid.js.map