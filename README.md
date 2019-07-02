# aria-label-prop-type

A prop-type for `aria-label` and `accessibilityLabel` that accepts either a string,
or a string child somewhere in children.

## About

To have a screen-reader-accessible app/site, it's important for interactive
elements to have a screen-reader-visible description.

Sometimes, that's in the form of an explicit `aria-label` or
`accessibilityLabel` prop, for example in
`<button aria-label="Add a photo"><img src="addPhoto.png" /></button>`.

Sometimes, the text within an element is enough, for example in
`<button>Done with questions</button>`.

If you require an explicit `aria-label` prop in the second case, it becomes
easier for the label to get out of sync with the screen text, making the
app less usable. But in the first case, or other cases of a button built
from non-text elements, having an `aria-label` is critical for using the
app with a screen-reader.

That's where aria-label-prop-type comes in. `aria-label-prop-type` is a
react prop-type for `aria-label` or `accessibilityLabel` or other label
props, that enforces that a specified component must either have some
string content somewhere within its children, or must have an explicit
`aria-label` / `accessibilityLabel` prop.


## Installation:

```sh
npm install aria-label-prop-type
```

While aria-label-prop-type should be installed as a dependency rather than a
devDependency, it will check for `process.env.NODE_ENV` to reduce bundle size
in production.


## Basic Usage

For an interactive element that accepts children and an `aria-label` prop:

```jsx
import * as React from 'react';
import * as PropTypes from 'prop-types';
import ariaLabelPropType from 'aria-label-prop-type';

// A simple, styled button
function ConfirmButton({children, ...props}) {
  return (
    <button
      style={{ backgroundColor: 'green', borderRadius: 12, padding: 8 }}
      {...props}
    >
      {children}
    </button>
  )
}

ConfirmButton.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
  'aria-label': ariaLabelPropType.isRequired,
};
```


## Render Prop Usage

For a component that (may) accept a render prop as a child:

```jsx
import * as React from 'react';
import * as PropTypes from 'prop-types';
import ariaLabelPropType from 'aria-label-prop-type';

// A button that can change its contents based on its state:
function StatusButton({children, ...props}) {

  const [status, setStatus] = React.useState('inactive');

  const onMouseDown = React.useCallback(
    () => setStatus('active'),
    [setStatus]
  );
  const onMouseUp = React.useCallback(
    () => setStatus('inactive'),
    [setStatus]
  );

  // Accepts either child nodes, or a render prop that takes the current status:
  const content = typeof children === 'function' ? children(status) : children;

  return (
    <button
      {...props}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {content}
    </button>
  )
}

StatusButton.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
  'aria-label': ariaLabelPropType.renderPropDefault('inactive').isRequired,
};
```


## ReactNative usage

```jsx
import * as React from 'react';
import * as PropTypes from 'prop-types';
import ariaLabelPropType from 'aria-label-prop-type';

// A simple, styled button
function ConfirmButton({children, onPress, accessibilityLabel, ...props}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{ backgroundColor: 'green', borderRadius: 12, padding: 8 }}
        accessibilityLabel={accessibilityLabel}
        {...props}
      >
        {children}
      </View>
    </TouchableOpacity>
  )
}

ConfirmButton.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
  accessibilityLabel: ariaLabelPropType.isRequired,
};
```


## API

`ariaLabelPropType` is a prop-type describing a required either:

1. string
2. text (string) child somewhere within its children

`ariaLabelPropType.isRequired` is an alias for `ariaLabelPropType`, provided
for convenience.

If your aria-label is optional (which I recommend it not being if you're
focusing on accessibility), you can use `PropTypes.string` instead.

`ariaLabelPropType.renderPropDefault(...defaultParams)` is a wrapper around
`ariaLabelPropType` for components that do or may accept a render prop as
children. `ariaLabelPropType` will call the render prop with
`...defaultParams`, and check the resulting children nodes for text (if
a string label is not present).

`ariaLabelPropType.renderPropDefault(...defaultParams).isRequired` is
an alias for `ariaLabelPropType.renderPropDefault(...defaultParams)`.

