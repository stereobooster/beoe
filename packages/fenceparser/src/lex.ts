import {FenceparserError} from './error.js'

// patterns
const SPACES = /[\s\t\n\r]/
const OPS = /[{}[\]=,:]/
const QUOTES = /["']/
const ALPHAS = /[a-zA-Z_$-]/
const NUMBERS = /[0-9]/
const ALPHANUMERIC = /[a-zA-Z_$-]|[0-9]/

type Input = string
type Output = Array<string | number>

export const lex = (input: Input): Output => {
  let start = 0
  let current = 0
  const output: Output = []

  const peek = (n = 0) => input[current + n]!
  const advance = () => input[current++]!
  const ending = () => current >= input.length

  // parse quoted string
  function string(quote: string) {
    // loop until we find the matching quote or reach the end of the input
    while (peek() !== quote && !ending()) advance()
    // is end of input? we haven't found the matching quote
    if (ending()) throw new FenceparserError('Unterminated string')
    // otherwise, we advance another step to claim the matching quote
    // because start is inclusive, and current is exclusive
    advance()
    output.push(input.substring(start, current))
  }

  // parse number
  function number() {
    // loop as long as the next character is a number
    while (NUMBERS.test(peek())) advance()

    // if it's a range, of n-p format
    if (peek() === '-' && NUMBERS.test(peek(1))) {
      advance() // claim the '-'
      while (NUMBERS.test(peek())) advance() // claim the rest of the numbers
      output.push(input.substring(start, current))
      return
    }

    // if it's a fraction
    if (peek() === '.' && NUMBERS.test(peek(1))) {
      advance() // claim '.'
      while (NUMBERS.test(peek())) advance() // claim the rest of the numbers
    }

    output.push(parseFloat(input.substring(start, current)))
  }

  // parse alphanumeric keywords to identifiers and values
  function keyword() {
    // loop as long as the next character is a number or an alpha
    // alphanumeric becase we accept numbers in identifiers as long as
    // they're not at the start, just like in JavaScript
    while (ALPHANUMERIC.test(peek()) && !ending()) advance()
    output.push(input.substring(start, current))
  }

  function scan() {
    while (!ending()) {
      start = current
      const next = advance()

      if (SPACES.test(next)) continue
      else if (OPS.test(next)) output.push(next)
      else if (QUOTES.test(next)) string(next)
      else if (NUMBERS.test(next)) number()
      else if (ALPHAS.test(next)) keyword()
      // unrecognized pattern, throw
      else throw new FenceparserError(`Unexpected character ${next}`)
    }
    return output
  }

  return scan()
}
