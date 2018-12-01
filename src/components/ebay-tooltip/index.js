const Expander = require('makeup-expander');
const emitAndFire = require('../../common/emit-and-fire');
const processHtmlAttributes = require('../../common/html-attributes');
const template = require('./template.marko');

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
    const {
        style,
        type = 'tooltip',
        location = 'top-right',
        contentHeading,
        a11yCloseText } = input;

    const hosts = (input.hosts || []).map(content => ({
        htmlAttributes: processHtmlAttributes(content),
        classes: content.class,
        style: content.style,
        renderBody: content.renderBody
    }));

    const headings = (input.headings || []).map(heading => ({
        htmlAttributes: processHtmlAttributes(heading),
        classes: heading.class,
        style: heading.style,
        renderBody: heading.renderBody
    }));

    const contents = (input.contents || []).map(content => ({
        htmlAttributes: processHtmlAttributes(content),
        classes: content.class,
        style: content.style,
        renderBody: content.renderBody
    }));

    let expanded = false;

    if (input.expanded && input.expanded !== 'false') {
        expanded = true;
    } else if (type === 'tourtip') {
        expanded = true;
    }

    return {
        htmlAttributes: processHtmlAttributes(input),
        class: [type, input.class],
        baseClass: type,
        hostSelector: `.${type}__host`,
        overlaySelector: `.${type}__overlay`,
        style,
        type,
        location,
        expanded,
        contentHeading,
        a11yCloseText,
        hosts,
        headings,
        contents
    };
}

function getTemplateData(state) {
    state.pointerLocation = flyoutPointerLocation[state.location];

    return state;
}

function init() {
    this.expander = new Expander(this.el, { // eslint-disable-line no-unused-vars
        hostSelector: this.state.hostSelector,
        contentSelector: this.state.overlaySelector,
        focusManagement: this.state.type === 'tourtip' ? null : 'focusable',
        expandOnFocus: this.state.type === 'tooltip',
        expandOnHover: this.state.type === 'tooltip',
        expandOnClick: this.state.type === 'infotip',
        autoCollapse: this.state.type !== 'tourtip'
    });

    if (this.type === 'tourtip' && this.state.expanded) {
        this.handleExpand();
    }
}

function onRender() {
    if (this.state.expanded) {
        this.flyout();
    }
}

function handleExpand() {
    this.state.expanded = true;
    this.flyout();
    emitAndFire(this, 'tooltip-expand');
    this.setStateDirty();
}

function handleCollapse() {
    this.state.expanded = false;
    emitAndFire(this, 'tooltip-collapse');
    this.setStateDirty();
}

function handleTooltipClose() {
    this.expander.collapse();
}

function flyout() {
    const host = this.el.querySelector(this.state.hostSelector);
    const overlay = this.el.querySelector(this.state.overlaySelector);
    const pointer = this.el.querySelector(`.${this.state.baseClass}__pointer`);

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
    onRender,
    handleExpand,
    handleCollapse,
    handleTooltipClose,
    flyout
});
