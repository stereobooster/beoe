# rehype-color-chips

Not very practical, because it checks all possible colors:

```js
vc.validateHTMLColor(code) ||
  vc.validateHTMLColorSpecialName(code) ||
  vc.validateHTMLColorName(code);
```

Better solution would be to write special remark-directive for this.
