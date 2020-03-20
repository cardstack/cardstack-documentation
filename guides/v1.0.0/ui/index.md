When you are authoring a Card it is important to make sure that the styling
associated with your Card cannot break out of the context of the card and affect
the rest of the application. This is especially important when writing styles
that would allow the card to open a "full screen" view. Traditionally when you
are developing for the web and you are building applications that have the
ability to got full-screen you would consider the viewport to be the same as the
browser window's viewport, in Cardstack you cannot make this assumption.
Depending on the circumstances, various parts of the Cardstack system will
render your card in different ways, for example the [Card
Picker](https://www.npmjs.com/package/@cardstack/card-picker) can render your
card in a very small viewport intended to be used to chose the card during
various types of searches.

To get around this limitation we can make use of the `fixed-within-viewport`
component.

## fixed-within-viewport

The `fixed-within-viewport` component can be used to position and size elements
in either the actual browser viewport or a virtual viewport.

A typical example for an element that would usually be positioned and sized
relative to the viewport is a mobile navigation:

![mobile navigation](/images/cards/mobile-nav-real-viewport.png)

Here, the navigation sticks to the top of the viewport and remains there, even
if the underlying document is scrolled. Likewise, when extended, it covers the
complete viewport:

![mobile navigation expanded](/images/cards/mobile-nav-expanded-real-viewport.png)

As we mentioned above, the viewport for a card is not necessarily always the
actual browser viewport but might be something smaller than that. If the card
containing the navigation is rendered inside a modal window above other content
the, the navigation is to be positioned relative to that virtual viewport:

![mobile navigation in virtual viewport](/images/cards/mobile-nav-virtual-viewport.png)

as well as sized relative to it when expanded:

![mobile navigation expanded in virtual viewport](/images/cards/mobile-nav-expanded-virtual-viewport.png)

## Usage

The `fixed-within-viewport` component is used to wrap the element that is
supposed to be positioned and sized in relation to the viewport like this:

```hbs
{{#fixed-within-viewport width="100vw" height="100vh"}}
  {{cardstack-content content=content.navigationCard format="embedded"}}
{{/fixed-within-viewport}}
```

If no virtual viewport exists, positioning and sizing will be in relation to
the browser viewport. If a virtual viewport exists that is marked with the
`data-virtual-viewport` attribute, the `fixed-within-component` will position
and size itself (and its contents) in relation to that element instead:

```hbs
<div class="modal-window" data-virtual-viewport>
  {{#fixed-within-viewport width="100vw" height="100vh"}}
    {{cardstack-content content=content.navigationCard format="embedded"}}
  {{/fixed-within-viewport}}
</div>
```

## Options

The `fixed-within-viewport` component accepts a number of options to configure
its position and size:

* `width`: the width of the fixed element - the `vw` unit will be in relation
  to the virtual viewport if one exists
* `height`: the height of the fixed element - the `vh` unit will be in relation
  to the virtual viewport if one exists
* `left`: the offset from the left edge of the viewport - this will be in
  relation to the virtual viewport if one exists
* `top`: the offset from the top edge of the viewport - this will be in
  relation to the virtual viewport if one exists
* `minWidth`, `maxWidth`, `minHeight`, `maxHeight`: media queries that allow
  limiting the behavior of the `fixed-within-viewport` component to specific
  element sizes (e.g. to narrow viewports in the above mobile navigation
  examples); if the media query does not match, the `fixed-within-viewport`
  component simply renders a `<div>` with no attached styles or behavior
