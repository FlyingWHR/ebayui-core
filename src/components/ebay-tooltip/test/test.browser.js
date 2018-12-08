const sinon = require('sinon');
const expect = require('chai').expect;
const testUtils = require('../../../common/test-utils/browser');
const renderer = require('../');

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

describe('given the default tooltip', () => {
    let widget;
    let host;

    beforeEach(() => {
        const input = { contents: [{}] };
        widget = renderer.renderSync(input).appendTo(document.body).getWidget();
        host = widget.el.querySelector('.tooltip__host');
    });

    afterEach(() => widget.destroy());

    describe('when the host element is hovered', () => {
        let spy;
        beforeEach(() => {
            spy = sinon.spy();
            widget.on('tooltip-expand', spy);
            testUtils.triggerEvent(host, 'expander-expand');
        });

        test('then it emits the marko event from expander-expand event', () => {
            expect(spy.calledOnce).to.equal(true);
        });
    });
});

describe('given the tooltip with custom location', () => {
    let widget;
    let host;
    let overlay;

    beforeEach(() => {
        const input = { contents: [{}], styleTop: '20px', styleLeft: '20px' };
        widget = renderer.renderSync(input).appendTo(document.body).getWidget();
        host = widget.el.querySelector('.tooltip__host');
        overlay = widget.el.querySelector('.tooltip__overlay');
    });

    afterEach(() => widget.destroy());

    describe('when the host element is hovered', () => {
        beforeEach(() => {
            testUtils.triggerEvent(host, 'expander-expand');
        });

        test('then it emits the marko event from expander-expand event', () => {
            expect(overlay.style.top).to.equal('20px');
            expect(overlay.style.left).to.equal('20px');
        });
    });
});

describe('given the default infotip', () => {
    let widget;
    let host;
    let closeButton;

    beforeEach(() => {
        const input = { type: 'infotip', headings: [{}], contents: [{}] };
        widget = renderer.renderSync(input).appendTo(document.body).getWidget();
        host = widget.el.querySelector('.infotip__host');
        closeButton = widget.el.querySelector('.infotip__close');
    });

    afterEach(() => widget.destroy());

    describe('when the host element is clicked', () => {
        let spy;
        beforeEach(() => {
            spy = sinon.spy();
            widget.on('tooltip-expand', spy);
            testUtils.triggerEvent(host, 'click');
        });

        test('then it emits the marko event from expander-expand event', () => {
            expect(spy.calledOnce).to.equal(true);
        });
    });

    describe('when the close button is clicked', () => {
        let spy;
        beforeEach(() => {
            spy = sinon.spy();
            widget.on('tooltip-collapse', spy);
            testUtils.triggerEvent(closeButton, 'click');
        });

        test('then it emits the marko event from expander-collapse event', () => {
            expect(spy.calledOnce).to.equal(true);
        });
    });
});

describe('given the default tourtip', () => {
    let widget;
    let closeButton;

    beforeEach(() => {
        const input = { type: 'tourtip', headings: [{}], contents: [{}] };
        widget = renderer.renderSync(input).appendTo(document.body).getWidget();
        closeButton = widget.el.querySelector('.tourtip__close');
    });

    afterEach(() => widget.destroy());

    describe('when the tourtip is rendered', () => {
        test('then it is already expanded', () => {
            expect(widget.state.expandInit).to.equal(true);
            expect(widget.state.expanded).to.equal(true);
        });
    });

    describe('when the close button is clicked', () => {
        let spy;
        beforeEach(() => {
            spy = sinon.spy();
            widget.on('tooltip-collapse', spy);
            testUtils.triggerEvent(closeButton, 'click');
        });

        test('then it emits the marko event from expander-collapse event', () => {
            expect(spy.calledOnce).to.equal(true);
        });
    });
});

pointerLocations.forEach(location => {
    describe(`given the default tooltip with location ${location}`, () => {
        let widget;
        let host;

        beforeEach(() => {
            const input = { contents: [{}], location };
            widget = renderer.renderSync(input).appendTo(document.body).getWidget();
            host = widget.el.querySelector('.tooltip__host');
        });

        afterEach(() => widget.destroy());

        describe('when the host element is hovered', () => {
            let spy;
            beforeEach(() => {
                spy = sinon.spy();
                widget.on('tooltip-expand', spy);
                testUtils.triggerEvent(host, 'expander-expand');
            });

            test('then it emits the marko event from expander-expand event', () => {
                expect(spy.calledOnce).to.equal(true);
                expect(widget.state.expandInit).to.equal(true);
            });
        });
    });
});
