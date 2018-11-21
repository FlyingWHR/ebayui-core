const Expander = require('makeup-expander');
const processHtmlAttributes = require('../../common/html-attributes');
const template = require('./template.marko');

function getInitialState(input) {
    const { style, open = false, type } = input;
    return {
        htmlAttributes: processHtmlAttributes(input),
        class: [`tooltip`, input.class],
        style,
        type,
        open
    };
}

function getTemplateData(state) {
    return state;
}

function init() {
    const expander = new Expander(this.el, { // eslint-disable-line no-unused-vars
        hostSelector: '.tooltip__host',
        contentSelector: '.tooltip__overlay',
        focusManagement: 'focusable',
        expandOnFocus: true,
        expandOnHover: true,
        autoCollapse: true
    });
}

module.exports = require('marko-widgets').defineComponent({
    template,
    getInitialState,
    getTemplateData,
    init
});
