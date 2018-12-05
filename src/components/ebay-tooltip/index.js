const Expander = require('makeup-expander');
const emitAndFire = require('../../common/emit-and-fire');
const processHtmlAttributes = require('../../common/html-attributes');
const template = require('./template.marko');

const flyoutPointerLocation = {
    'top-left': 'bottom-right',
    top: 'bottom',
    'top-right': 'bottom-left',
    right: 'left',
    'right-bottom': 'left-top',
    'right-top': 'left-bottom',
    'bottom-left': 'top-right',
    'bottom-right': 'top-left',
    bottom: 'top',
    left: 'right',
    'left-bottom': 'right-top',
    'left-top': 'right-bottom'
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
        expandInit: false,
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

    if (this.state.expanded) {
        this.setState('expandInit', true);
    }
}

function onRender() {
    if (this.state.expanded) {
        this.alignOverlay();
    }
}

function handleExpand() {
    this.setState('expandInit', true);
    this.setState('expanded', true);
    this.alignOverlay();
    emitAndFire(this, 'tooltip-expand');
}

function handleCollapse() {
    this.setState('expanded', false);
    emitAndFire(this, 'tooltip-collapse');
}

function handleTooltipClose() {
    this.expander.collapse();
    this.handleCollapse();
}

function alignOverlay() {
    const host = this.el.querySelector(this.state.hostSelector);
    const overlay = this.el.querySelector(this.state.overlaySelector);
    const pointer = this.el.querySelector(`.${this.state.baseClass}__pointer`);

    const hostBoundingBox = host.getBoundingClientRect();
    const overlayBoundingBox = overlay.getBoundingClientRect();

    let flyoutLeftOffset = hostBoundingBox.width / 2;

    if (hostBoundingBox.width > overlayBoundingBox.width) {
        flyoutLeftOffset = pointer.offsetWidth / 2;
    }

    // vertical alighment
    const flyoutRight = `${(hostBoundingBox.width + 8)}px`;
    const flyoutLeft = `-${(overlayBoundingBox.width + 8)}px`;
    const flyoutAboveBelowLeft = `-${(overlayBoundingBox.width - hostBoundingBox.width - 4)}px`;
    const flyoutAboveBelowRight = `${(flyoutLeftOffset - (pointer.offsetWidth + 4))}px`;
    const flyoutVerticalMiddle = `${((hostBoundingBox.width / 2) - (overlayBoundingBox.width / 2))}px`;

    // horizontal alignment
    const flyoutAbove = `-${(overlayBoundingBox.height + 8)}px`;
    const flyoutBelow = `${(hostBoundingBox.height + 8)}px`;
    const flyoutLeftRightAbove = `-${(hostBoundingBox.height - pointer.offsetHeight)}px`;
    const flyoutLeftRightBelow = `-4px`;
    const flyoutHorizontalMiddle = `${((hostBoundingBox.height / 2) - (overlayBoundingBox.height / 2))}px`;

    let overlayLeft = flyoutAboveBelowRight;
    let overlayTop = flyoutAbove;

    // determine the offsets for each type of location
    switch (this.state.location) {
        case 'right':
            overlayLeft = flyoutRight;
            overlayTop = flyoutHorizontalMiddle;
            break;
        case 'right-bottom':
            overlayLeft = flyoutRight;
            overlayTop = flyoutLeftRightBelow;
            break;
        case 'right-top':
            overlayLeft = flyoutRight;
            overlayTop = flyoutLeftRightAbove;
            break;
        case 'left':
            overlayLeft = flyoutLeft;
            overlayTop = flyoutHorizontalMiddle;
            break;
        case 'left-bottom':
            overlayLeft = flyoutLeft;
            overlayTop = flyoutLeftRightBelow;
            break;
        case 'left-top':
            overlayLeft = flyoutLeft;
            overlayTop = flyoutLeftRightAbove;
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
    alignOverlay
});
