const processHtmlAttributes = require('../../common/html-attributes');
const template = require('./template.marko');

function getInitialState(input) {
    return {
        htmlAttributes: processHtmlAttributes(input),
        class: [`tooltip`, input.class],
        style: input.style,
        type: input.type
    };
}

function getTemplateData(state) {
    return state;
}

module.exports = require('marko-widgets').defineComponent({
    template,
    getInitialState,
    getTemplateData
});
