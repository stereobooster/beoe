import {FenceparserError} from './error.js'
import type {lex} from './lex.js'

// Grammar - Recursive Descent
//
// MAIN → EXPR*
// EXPR → OBJECT | IDENTIFIER (= VALUE)?
//
// IDENTIFIER → STRING | NUMBER
//
// OBJECT → { OBJECT_VALUES? }
// OBJECT_VALUES → OBJECT_VALUE (, OBJECT_VALUE)*
// OBJECT_VALUE → IDENTIFIER | (IDENTIFIER | ("|') STRING ("|')): VALUE
//
// ARRAY → [ ARRAY_VALUES? ]
// ARRAY_VALUES → (ARRAY_VALUE) (ARRAY_VALUE)*
// ARRAY_VALUE → VALUE
//
// VALUE → OBJECT | ARRAY | STRING | ("|') STRING ("|') | BOOLEAN | NUMBER | null | undefined

// types according to the grammar
export type IDENTIFIER = string | number
export type OBJECT = {[key in IDENTIFIER]: VALUE}
export type ARRAY = VALUE[]
export type VALUE =
  | OBJECT
  | ARRAY
  | string
  | boolean
  | number
  | null
  | undefined

// keywords
const KEYWORDS: Record<string, VALUE> = {
  true: true,
  false: false,
  NaN: NaN,
  null: null,
  undefined: undefined,
}

// highlight object name
const HIGHLIGHT = 'highlight'

// Utils
export const isQuotedString = (s: string | number): s is string =>
  typeof s === 'string' && /^(['"]).*\1$/.test(s)

export type ParseOptions = { lowerCase?: boolean }

export const parse = (input: ReturnType<typeof lex>, opts: ParseOptions = {}): OBJECT => {
  let current = 0
  const output = new Map<IDENTIFIER, VALUE>()

  const peek = (n = 0) => input[current + n]!
  const advance = () => input[current++]!
  const ending = () => current >= input.length

  // collect from array like structure
  // takes a name for the structure to use when throwing an error
  // and a character to look for as closing operator, and
  // a collector to run when collecting values
  function collect<T>(name: string, op: string, collector: () => T): T[] {
    const result: T[] = []

    advance() // skip opening op

    // if we haven't found the closing op yet
    if (peek() !== op) {
      // take the first value
      result.push(collector())

      // loop as long as the next character is a comma
      while (peek() === ',') {
        advance() // skip ','
        // op comes after a comma, throw
        if (peek() === op) throw new FenceparserError('Trailing comma')
        // otherwise
        result.push(collector())
      }
    }

    // no more comma, but still haven't found the closing op, throw
    if (advance() !== op) throw new FenceparserError(`Unterminated ${name}`)

    return result
  }

  // parse array
  function array(): ARRAY {
    return collect<VALUE>('array', ']', value)
  }

  // parse object
  function object() {
    const objectValue = (): [string, VALUE] => {
      const [key, value] = assignment(':')
      return [
        // strip quotes from key, and stringify
        isQuotedString(key) ? key.slice(1, -1) : String(key),
        value,
      ]
    }
    return Object.fromEntries(collect('object', '}', objectValue))
  }

  // parse values
  function value(): VALUE {
    const peeked = peek()

    // objects or arrays
    if (peeked === '{') return object()
    if (peeked === '[') return array()

    // if strings have quotes, remove them and return
    if (isQuotedString(peeked)) return (advance() as typeof peeked).slice(1, -1)

    // if it's a keyword, transform it to the correct type
    // otherwise, return
    return peeked in KEYWORDS ? KEYWORDS[advance()]! : advance()
  }

  // parse highlights
  function highlight(): [IDENTIFIER, VALUE] {
    const highlights = output.has(HIGHLIGHT)
      ? (output.get(HIGHLIGHT) as OBJECT)
      : {}
    return [HIGHLIGHT, {...highlights, ...object()}]
  }

  // parse assignments
  // takes a character to look for as assignment operator
  function assignment(op = '='): [IDENTIFIER, VALUE] {
    const identifier = advance()

    if (peek() === op) {
      advance() // skip op
      return [identifier, value()]
    }

    // if no value was provided, default to true
    return [identifier, true]
  }

  function walk() {
    while (!ending()) {
      const [key, value] = peek() === '{' ? highlight() : assignment()
      output.set(
        opts.lowerCase === false ? String(key) : String(key).toLowerCase(), value)
    }

    return output
  }

  return Object.fromEntries(walk())
}
