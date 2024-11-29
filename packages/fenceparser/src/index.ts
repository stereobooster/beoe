import {lex} from './lex.js'
import {parse, ParseOptions} from './parse.js'

export {FenceparserError} from './error.js'
export {lex, parse}
export default (input: string, opts?: ParseOptions) => parse(lex(input), opts)
