const assert = require('assert').strict || require('assert');
const React = require('react');
const ariaLabelPropType = require('./index');

// A simple, styled button
function ConfirmButton({ children, ...props }) {
    return React.createElement(
        'button',
        {
            style: { backgroundColor: 'green', borderRadius: 12, padding: 8 },
            ...props,
        },
        children
    );
}

ConfirmButton.propTypes = {
    'aria-label': ariaLabelPropType,
};

// A button that can change its contents based on its state:
function StatusButton({ children, ...props }) {
    const [status, setStatus] = React.useState('inactive');

    const onMouseDown = React.useCallback(() => setStatus('active'), [
        setStatus,
    ]);
    const onMouseUp = React.useCallback(() => setStatus('inactive'), [
        setStatus,
    ]);

    // Accepts either child nodes, or a render prop that takes the current status:
    const content =
        typeof children === 'function' ? children(status) : children;

    return React.createElement(
        'button',
        {
            ...props,
            onMouseDown: onMouseDown,
            onMouseUp: onMouseUp,
        },
        content
    );
}

StatusButton.propTypes = {
    'aria-label': ariaLabelPropType.renderPropDefault('inactive').isRequired,
};

describe('aria-label-prop-type', () => {
    const getSanitizedWarning = () => {
        return global.console.error.mock.calls[0][0]
            .replace(/0.\d+/g, '')
            .replace(/\s\s+/g, ' ');
    };

    beforeEach((...args) => {
        // Mock console.error to listen to PropType warnings:
        global.console.error = jest.fn();

        // Update component displayNames to avoid React de-duping them:
        // https://github.com/facebook/react/issues/7047
        // These are sanitized by getSanitizedWarning()
        ConfirmButton.displayName = 'ConfirmButton' + Math.random();
        StatusButton.displayName = 'StatusButton' + Math.random();
    });

    describe('react node children', () => {
        it('should error if no label or text child is present', () => {
            const el = React.createElement(
                ConfirmButton,
                {},
                React.createElement('img', { src: 'test.png' })
            );

            assert.equal(console.error.mock.calls.length, 1);
            assert.equal(
                getSanitizedWarning(),
                'Warning: Failed prop type: `ConfirmButton` must have either an `aria-label` prop, or one or more text (string) children for screen-reader accessibility. in ConfirmButton'
            );
        });

        it('should not error if there is an aria-label prop', () => {
            const el = React.createElement(
                ConfirmButton,
                { 'aria-label': 'Confirm' },
                React.createElement('img', { src: 'test.png' })
            );

            assert.equal(console.error.mock.calls.length, 0);
        });

        it('should not error if the child is a string', () => {
            const el = React.createElement(ConfirmButton, {}, 'Confirm');

            assert.equal(console.error.mock.calls.length, 0);
        });

        it('should not error if there is an aria-label prop', () => {
            const el = React.createElement(
                ConfirmButton,
                {},
                React.createElement(
                    'div',
                    {},
                    React.createElement('img', { src: 'test.png' }),
                    'Confirm'
                )
            );

            assert.equal(console.error.mock.calls.length, 0);
        });
    });

    describe('render prop child', () => {
        it('should error if no label or text child is present', () => {
            const el = React.createElement(StatusButton, {}, (status) =>
                React.createElement('img', { src: 'test.png' })
            );

            assert.equal(console.error.mock.calls.length, 1);
            assert.equal(
                getSanitizedWarning(),
                'Warning: Failed prop type: `StatusButton` must have either an `aria-label` prop, or one or more text (string) children for screen-reader accessibility. in StatusButton'
            );
        });

        it('should not error if there is an aria-label prop', () => {
            const el = React.createElement(
                StatusButton,
                { 'aria-label': 'Confirm' },
                (status) => React.createElement('img', { src: 'test.png' })
            );

            assert.equal(console.error.mock.calls.length, 0);
        });

        it('should not error if the render prop returns a string', () => {
            const el = React.createElement(
                StatusButton,
                {},
                (status) => 'Confirm (' + status + ')'
            );

            assert.equal(console.error.mock.calls.length, 0);
        });

        it('should not error if there is an aria-label prop', () => {
            const el = React.createElement(StatusButton, {}, (status) =>
                React.createElement(
                    'div',
                    {},
                    React.createElement('img', { src: 'test.png' }),
                    'Confirm (' + status + ')'
                )
            );

            assert.equal(console.error.mock.calls.length, 0);
        });

        it('should error if there is a non-render-prop child but no text', () => {
            global.console.error = jest.fn();

            const el = React.createElement(
                StatusButton,
                {},
                React.createElement('img', { src: 'test.png' })
            );

            assert.equal(console.error.mock.calls.length, 1);
            assert.equal(
                getSanitizedWarning(),
                'Warning: Failed prop type: `StatusButton` must have either an `aria-label` prop, or one or more text (string) children for screen-reader accessibility. in StatusButton'
            );
        });

        it('should not error if there is a non-render-prop child including text', () => {
            const el = React.createElement(
                StatusButton,
                {},
                React.createElement(
                    'div',
                    {},
                    React.createElement('img', { src: 'test.png' }),
                    'Confirm'
                )
            );

            assert.equal(console.error.mock.calls.length, 0);
        });
    });
});
