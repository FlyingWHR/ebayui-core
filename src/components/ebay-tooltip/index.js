const Expander = require('makeup-expander');
const emitAndFire = require('../../common/emit-and-fire');
const processHtmlAttributes = require('../../common/html-attributes');
const template = require('./template.marko');

const hostSelector = '.tooltip__host';
const overlaySelector = '.tooltip__overlay';
// const locations = [
//     'top-left',
//     'top',
//     'top-right',
//     'right',
//     'bottom-left',
//     'bottom-right',
//     'bottom',
//     'left'
// ];

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
    state.pointerLocation = getPointerLocation(state.location);

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

    // get the width of the host, divided by two (defaults to top-right location)
    const flyoutRight = `${((hostBoundingBox.width / 2) - (pointer.offsetWidth + 8))}px`;
    const flyoutLeft = `-${(overlayBoundingBox.width - hostBoundingBox.width + 4)}px`;
    // get the height of the overlay, plus a little padding
    const flyoutAbove = `-${(overlayBoundingBox.height + pointer.offsetHeight)}px`;
    const flyoutBelow = `${(hostBoundingBox.height + pointer.offsetHeight)}px`;

    let overlayLeft = flyoutRight;
    let overlayTop = flyoutAbove;

    // determine the offsets for each type of location
    switch (this.state.location) {
        case 'bottom-right':
            // move middle relative to the host
            overlayLeft = flyoutRight;
            overlayTop = flyoutBelow;
            break;
        case 'bottom-left':
            // move middle relative to the overlay, minus the host
            overlayLeft = flyoutLeft;
            overlayTop = flyoutBelow;
            break;
        case 'top-left':
            // move middle relative to the overlay, minus the host
            overlayLeft = flyoutLeft;
            overlayTop = flyoutAbove;
            break;
        case 'top-right':
        default:
            // move middle relative to the host
            overlayLeft = flyoutRight;
            overlayTop = flyoutAbove;
            break;
    }

    overlay.style.left = overlayLeft;
    overlay.style.top = overlayTop;
}

function getPointerLocation(location) {
    let pointerLocation = 'bottom-left';

    switch (location) {
        case 'top-left':
            pointerLocation = 'bottom-right';
            break;
        case 'top-right':
        default:
            pointerLocation = 'bottom-left';
            break;
    }

    return pointerLocation;
}

module.exports = require('marko-widgets').defineComponent({
    template,
    getInitialState,
    getTemplateData,
    init,
    handleExpand,
    flyout
});
