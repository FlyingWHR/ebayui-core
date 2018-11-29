const Expander = require('makeup-expander');
const emitAndFire = require('../../common/emit-and-fire');
const processHtmlAttributes = require('../../common/html-attributes');
const template = require('./template.marko');

const hostSelector = '.tooltip__host';
const overlaySelector = '.tooltip__overlay';
const flyoutPointerLocation = {
    'top-left': 'bottom-right',
    top: 'bottom',
    'top-right': 'bottom-left',
    right: 'left',
    'bottom-left': 'top-right',
    'bottom-right': 'top-left',
    bottom: 'top',
    left: 'right'
};

function getInitialState(input) {
    const { style, open = false, type = 'tooltip', location = 'top-right' } = input;
    return {
        htmlAttributes: processHtmlAttributes(input),
        class: [`tooltip`, input.class],
        style,
        type,
        location,
        open
    };
}

function getTemplateData(state) {
    state.pointerLocation = flyoutPointerLocation[state.location];

    return state;
}

function init() {
    const expander = new Expander(this.el, { // eslint-disable-line no-unused-vars
        hostSelector: hostSelector,
        contentSelector: overlaySelector,
        focusManagement: 'focusable',
        expandOnFocus: true,
        expandOnHover: true,
        autoCollapse: true
    });
}

function handleExpand() {
    this.flyout();
    emitAndFire(this, 'tooltip-expand');
}

function flyout() {
    const host = this.el.querySelector(hostSelector);
    const overlay = this.el.querySelector(overlaySelector);
    const pointer = this.el.querySelector('.tooltip__pointer');

    const hostBoundingBox = host.getBoundingClientRect();
    const overlayBoundingBox = overlay.getBoundingClientRect();

    // vertical alighment
    const flyoutRight = `${(hostBoundingBox.width + 8)}px`;
    const flyoutAboveBelowRight = `${((hostBoundingBox.width / 2) - (pointer.offsetWidth + 4))}px`;
    const flyoutLeft = `-${(overlayBoundingBox.width + 8)}px`;
    const flyoutAboveBelowLeft = `-${(overlayBoundingBox.width - hostBoundingBox.width - 4)}px`;
    const flyoutVerticalMiddle = `-${((overlayBoundingBox.width / 2) - (hostBoundingBox.width / 2))}px`;

    // horizontal alignment
    const flyoutAbove = `-${(overlayBoundingBox.height + 8)}px`;
    const flyoutBelow = `${(hostBoundingBox.height + 8)}px`;
    const flyoutHorizontalMiddle = `${((hostBoundingBox.height / 2) - (overlayBoundingBox.height / 2))}px`;

    let overlayLeft = flyoutAboveBelowRight;
    let overlayTop = flyoutAbove;

    // determine the offsets for each type of location
    switch (this.state.location) {
        case 'right':
            overlayLeft = flyoutRight;
            overlayTop = flyoutHorizontalMiddle;
            break;
        case 'left':
            overlayLeft = flyoutLeft;
            overlayTop = flyoutHorizontalMiddle;
            break;
        case 'bottom':
            overlayLeft = flyoutVerticalMiddle;
            overlayTop = flyoutBelow;
            break;
        case 'top':
            overlayLeft = flyoutVerticalMiddle;
            overlayTop = flyoutAbove;
            break;
        case 'bottom-right':
            overlayLeft = flyoutAboveBelowRight;
            overlayTop = flyoutBelow;
            break;
        case 'bottom-left':
            overlayLeft = flyoutAboveBelowLeft;
            overlayTop = flyoutBelow;
            break;
        case 'top-left':
            overlayLeft = flyoutAboveBelowLeft;
            overlayTop = flyoutAbove;
            break;
        case 'top-right':
        default:
            overlayLeft = flyoutAboveBelowRight;
            overlayTop = flyoutAbove;
            break;
    }

    overlay.style.left = overlayLeft;
    overlay.style.top = overlayTop;
}

module.exports = require('marko-widgets').defineComponent({
    template,
    getInitialState,
    getTemplateData,
    init,
    handleExpand,
    flyout
});
