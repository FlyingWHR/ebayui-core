# ebay-tooltip

## ebay-tooltip Usage

### tooltip example

```marko
<ebay-tooltip>
    <ebay-tooltip-content><p>Use Access Key 'S' to display settings.</p></ebay-tooltip-content>
</ebay-tooltip>
```

### infotip example

```marko
<ebay-tooltip type="infotip" a11y-close-text="Dismiss infotip" aria-label="Important information">
    <ebay-tooltip-heading>Important</ebay-tooltip-heading>
    <ebay-tooltip-content><p>This is some important info</p></ebay-tooltip-content>
</ebay-tooltip>
```

### tourtip example

```marko
<ebay-tooltip type="tourtip" a11y-close-text="Dismiss tourtip" aria-label="Important information">
    <ebay-tooltip-host>
        <p>Nisi quis officia cupidatat irure qui aliquip mollit aliqua dolore. Sint ut anim adipisicing
        eiusmod. Dolor irure adipisicing dolor ullamco elit irure laboris consectetur eiusmod et officia
        mollit irure. Reprehenderit nostrud proident anim deserunt aliqua proident dolore reprehenderit.
        Proident fugiat sit nostrud Lorem aliquip enim est sint. Labore esse quis nulla in Lorem aute
        duis exercitation sit in laborum cillum qui. Dolore voluptate commodo adipisicing anim id
        voluptate dolore quis aliquip duis duis.</p>
    </ebay-tooltip-host>
    <ebay-tooltip-heading>Important</ebay-tooltip-heading>
    <ebay-tooltip-content><p>This new feature was added.</p></ebay-tooltip-content>
</ebay-tooltip>
```

## ebay-tooltip Attributes

Name | Type | Stateful | Description
--- | --- | --- | ---
`type` | String | No | options are `tooltip`, `infotip`, `tourtip`
`location` | String | No | options are `top-left`, `top`, `top-right`, `right`, `right-bottom`, `right-top`, `bottom-left`, `bottom-right`, `bottom`, `left`, `left-bottom`, `left-top`
`a11y-close-text` | String | No | A11y text for close button

**Note:** In order for the `infotip` type to meet accessibility standards you must supply an `aria-label` attribute when using `<ebay-tooltip>`

## ebay-tooltip Events

Event | Data | Description
--- | --- | ---
`tooltip-expand` | | tooltip has been expanded
`tooltip-collapse` | | tooltip has been collapsed
