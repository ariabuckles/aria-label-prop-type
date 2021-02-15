var React = require('react');

var deepTraverseChildren = function (children, callback) {
    React.Children.forEach(children, function (child) {
        if (!child) {
            return;
        }
        callback(child);
        if (child.props && child.props.children) {
            deepTraverseChildren(child.props.children, callback);
        }
    });
};

var _accessibilityLabel = function (
    props,
    propName,
    componentName,
    renderPropDefault
) {
    var label = props[propName];
    if (typeof label === 'string' && label.trim() !== '') {
        return;
    }

    var hasStringChild = false;
    var children =
        typeof props.children === 'function'
            ? props.children(renderPropDefault)
            : props.children;

    deepTraverseChildren(children, function (child) {
        if (typeof child === 'string') {
            hasStringChild = true;
        }
    });

    if (hasStringChild) {
        return;
    }

    return new Error(
        '`' +
            componentName +
            '` must have either an `' +
            propName +
            '` prop, or one or more text (string) children ' +
            'for screen-reader accessibility.'
    );
};

var accessibilityLabel = function (props, propName, componentName) {
    return _accessibilityLabel(props, propName, componentName);
};
accessibilityLabel.isRequired = accessibilityLabel;

accessibilityLabel.renderPropDefault = function (renderPropDefault) {
    var propType = function (props, propName, componentName) {
        return _accessibilityLabel(
            props,
            propName,
            componentName,
            renderPropDefault
        );
    };
    propType.isRequired = propType;
    return propType;
};

module.exports = accessibilityLabel;
