import {lex} from './lex.js'
import {parse} from './parse.js'

export {FenceparserError} from './error.js'
export {lex, parse}
export default (input: string) => parse(lex(input))
