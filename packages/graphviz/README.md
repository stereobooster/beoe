# graphviz

Small wrapper around `@hpcc-js/wasm/graphviz` to:

- remove doctype, html comments etc., so it would be safe to inline SVG in HTML
- remove width and height, so it can take whole available width (there is viewBox for aspect ratio anyway)
- wrap in div with class, so it can be used for styling and JS
