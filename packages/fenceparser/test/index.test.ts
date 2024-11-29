import {describe, expect, it} from 'vitest'
import parse, {lex, parse as pureParse} from '../src'
import cases, {n} from './cases'

describe('test an edge case for parser', () => {
  it('parser should return null if input is empty', () => {
    expect(pureParse([])).toEqual({})
  })
})

describe(`${n} tests with ordering permutations`, () => {
  for (const test of cases) {
    it(`${test.error ? 'Exception: ' : ''}${test.input}`, () => {
      if (test.error) {
        expect(() => parse(test.input)).toThrowError(test.error)
      } else if (test.output) {
        // `pureParse(lex` is same as `parse`
        expect(pureParse(lex(test.input))).toEqual(test.output)
      }
    })
  }
})
