const Expander = require('makeup-expander');
const emitAndFire = require('../../common/emit-and-fire');
const processHtmlAttributes = require('../../common/html-attributes');
const template = require('./template.marko');

const hostSelector = '.tooltip__host';
const overlaySelector = '.tooltip__overlay';
const pointerSelecter = '.tooltip__pointer';
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
    const pointer = this.el.querySelector(pointerSelecter);

    const hostBoundingBox = host.getBoundingClientRect();
    const overlayBoundingBox = overlay.getBoundingClientRect();
    const pointerBoundingBox = pointer.getBoundingClientRect();

    const pointerSize = pointer.offsetWidth;

    // get the width of the host, divided by two
    let hostMiddle = `${((hostBoundingBox.width / 2) - pointerSize)}px`;
    let overlayTop = `-${(overlayBoundingBox.height + pointerSize + 4)}px`;

    // determine the offsets for each type of location
    switch (this.state.location) {
        case 'top-right':
            hostMiddle = `${((hostBoundingBox.width / 2) - pointerSize)}px`;
            overlayTop = `-${(overlayBoundingBox.height + pointerSize + 4)}px`;
            break;
        default:
            break;
    }

    console.table({
        'hostMiddle': hostMiddle,
        'overlayTop': overlayTop,
        'pointerSize': pointerSize,
        'overlayBoundingBox.height': overlayBoundingBox.height,
        'pointerBoundingBox.height': pointerBoundingBox.height
    });

    overlay.style.left = hostMiddle;
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
