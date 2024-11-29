Fork of https://github.com/frencojobs/fenceparser

---

<img align="center" src="https://raw.githubusercontent.com/frencojobs/fenceparser/main/.github/cover.png" />

<p align="center"> A tiny, well-tested parser for parsing metadata out of fenced code blocks in Markdown. </p>

<br />

## Overview ・ <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/fenceparser?color=success&label=size"> <img alt="Codecov" src="https://img.shields.io/codecov/c/github/frencojobs/fenceparser?color=important">

Assuming you have this code fence in your Markdown,

<!-- prettier-ignore-start -->
````md
 ```ts twoslash {1-3, 5} title="Hello, World"
````
<!-- prettier-ignore-end -->

Using [remark](https://github.com/remarkjs/remark) will yield two information about that code block, `lang` and `meta` like this.

```json
{
  "lang": "ts",
  "meta": "twoslash {1-3, 5} title=\"Hello, World\""
}
```

Use `fenceparser` to parse the `meta` string out to a useful object.

```js
import parse from 'fenceparser'

console.log(parse(meta))

// {
//   twoslash: true,
//   highlight: { '1-3': true, '5': true },
//   title: 'Hello, World'
// }
```

> The parser won't intentionally handle parsing the language part since it is usually handled by the Markdown parsers.

But if you want to allow loose syntax grammars such as `ts{1-3, 5}` as well as `ts {1-3, 5}` which is used by [gatsby-remark-vscode](https://github.com/andrewbranch/gatsby-remark-vscode) as an example, remark won't parse the language correctly.

<!-- prettier-ignore-start -->
```json5
{
  "lang": "ts{1-3,", // because remark uses space to split
  "meta": "5}"
}
```
<!-- prettier-ignore-end -->

In these cases, you can use the the library's `lex` function to get a properly tokenized array. You may then take out the first element as `lang`. For example,

```js
import {lex, parse} from 'fenceparser'
// Notice this ^ parse is not the same the default export function

const full = [node.lang, node.meta].join(' ') // Join them back

const tokens = lex(full)
const lang = tokens.shift() // ts
const meta = parse(tokens) // { highlight: {'1-3': true, '5': true} }
```

## Syntax

The syntax grammar is loosely based on techniques used by various syntax-highlighters. Rules are such that

- Valid HTML attributes can be used, `attribute`, `data-attribute`, etc.
- Just like in HTML, top-level attribute names are case insensitive
- Attributes without values are assigned as `true`
- Attribute values can be single or double quoted strings, int/float numbers, booleans, objects or arrays
- Non-quoted strings are valid as long as they are not separated by a whitespace or a line-break, `attr=--theme-color`
- Objects can accept valid attributes as children, or valid attributes with value assigned by `:` keyword, `{1-3, 5, ids: {7}}`
- Arrays are just like JavaScript's arrays
- Objects without attribute keys `{1-3} {7}` are merged and assigned to the `highlight` object
- No trailing commas

## Acknowledgements

1. This project is made initially to use with [Twoslash](https://github.com/shikijs/twoslash).
2. The initial implementations of lexer and parser are based on the examples from the book [Crafting Interpreters](http://craftinginterpreters.com).
