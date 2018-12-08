
const expect = require('chai').expect;
const testUtils = require('../../../common/test-utils/server');
const transformer = require('../transformer');

const pointerLocations = [
    'top-left',
    'top',
    'top-right',
    'right',
    'right-bottom',
    'right-top',
    'bottom-left',
    'bottom-right',
    'bottom',
    'left',
    'left-bottom',
    'left-top'
];

const pointerLocationsClassMap = {
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

describe('tooltip', () => {
    test('renders default tooltip', context => {
        const input = { contents: [{}] };
        const $ = testUtils.getCheerio(context.render(input));
        expect($('.tooltip').length).to.equal(1);
        expect($('button.tooltip__host').length).to.equal(1);
        expect($('.tooltip__overlay .tooltip__cell .tooltip__content').length).to.equal(1);
    });

    test('renders default infotip', context => {
        const input = { type: 'infotip' };
        const $ = testUtils.getCheerio(context.render(input));
        expect($('.infotip').length).to.equal(1);
        expect($('.infotip__host').length).to.equal(1);
        expect($('button.infotip__host').length).to.equal(1);
        expect($('.infotip__overlay').length).to.equal(1);
    });

    test('renders infotip with a header', context => {
        const input = { type: 'infotip', headings: [{}], contents: [{}] };
        const $ = testUtils.getCheerio(context.render(input));
        expect($('.infotip__heading').length).to.equal(1);
    });

    test('renders default tourtip', context => {
        const input = { type: 'tourtip', contents: [{}] };
        const $ = testUtils.getCheerio(context.render(input));
        expect($('.tourtip').length).to.equal(1);
        expect($('.tourtip__host').length).to.equal(1);
        expect($('button.tourtip__host').length).to.equal(1);
        expect($('.tourtip__overlay').length).to.equal(1);
    });

    test('renders tourtip with a header', context => {
        const input = { type: 'tourtip', headings: [{}], contents: [{}] };
        const $ = testUtils.getCheerio(context.render(input));
        expect($('.tourtip__heading').length).to.equal(1);
    });

    test('renders tourtip with host content', context => {
        const input = { type: 'tourtip', hosts: [{}], contents: [{}] };
        const $ = testUtils.getCheerio(context.render(input));
        expect($('div.tourtip__host').length).to.equal(1);
    });

    pointerLocations.forEach(location => {
        test(`renders tooltip location: ${location}`, context => {
            const input = { contents: [{}], location };
            const $ = testUtils.getCheerio(context.render(input));
            expect($('.tooltip').length).to.equal(1);
            expect($(`.tooltip__pointer.tooltip__pointer--${pointerLocationsClassMap[location]}`).length).to.equal(1);
        });
    });

    describe('transformer', () => {
        const componentPath = '../index.js';

        test('transforms an icon attribute into a tag', () => {
            const tagString = '<ebay-tooltip icon="settings"/>';
            const { el } = testUtils.runTransformer(transformer, tagString, componentPath);
            const { body: { array: [iconEl] } } = el;
            expect(iconEl.tagName).to.equal('ebay-tooltip:icon');
        });

        test('does not transform when icon attribute is missing', () => {
            const tagString = '<ebay-tooltip/>';
            const { el } = testUtils.runTransformer(transformer, tagString, componentPath);
            const { body: { array: [iconEl] } } = el;
            expect(iconEl).to.equal(undefined);
        });
    });

    test('handles pass-through html attributes', context => testUtils.testHtmlAttributes(context, '.tooltip'));
    test('handles custom class and style', context => testUtils.testClassAndStyle(context, '.tooltip'));
});
