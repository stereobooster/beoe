import {FenceparserError} from '../src'
import {prepareCases} from './utils'

const cases = [
  // Empty
  {
    input: [''],
    output: {},
  },
  // Attributes
  {
    input: ['attr1', 'attr-2', 'attr_3'],
    output: {
      attr1: true,
      'attr-2': true,
      attr_3: true,
    },
  },
  {
    input: ['attr1', 'attr2=2', 'attr3="string"', 'attr4=false'],
    output: {
      attr1: true,
      attr2: 2,
      attr3: 'string',
      attr4: false,
    },
  },
  // Case insensitivity
  {
    input: ['attr1', 'aTtr1', 'Attr1', 'aTTr1', 'ATTR1'],
    output: {
      attr1: true,
    },
  },
  // Numbers
  {
    input: [
      'attr1=1',
      'attr2=2.3',
      'attr3=123',
      'attr4=456.789',
      'attr5={1, 2-3, 123, 456-789}',
    ],
    output: {
      attr1: 1,
      attr2: 2.3,
      attr3: 123,
      attr4: 456.789,
      attr5: {1: true, '2-3': true, 123: true, '456-789': true},
    },
  },
  // Strings
  {
    input: ['attr1="doublequoted"', "attr2='singlequoted'"],
    output: {
      attr1: 'doublequoted',
      attr2: 'singlequoted',
    },
  },
  // Objects
  {
    input: ['attr1={}', 'attr2={1-3, 5}', 'attr3={1, inner1, inner2:2}'],
    output: {
      attr1: {},
      attr2: {'1-3': true, 5: true},
      attr3: {1: true, inner1: true, inner2: 2},
    },
  },
  {
    input: [
      'attr1={1-3, 5, inner1: false, inner2: "string", inner3: {innermost1}}',
    ],
    output: {
      attr1: {
        '1-3': true,
        5: true,
        inner1: false,
        inner2: 'string',
        inner3: {
          innermost1: true,
        },
      },
    },
  },
  // Arrays
  {
    input: ['attr1=[]', 'attr2=[0, false, "string", {1-3, 5}, ["innermost"]]'],
    output: {
      attr1: [],
      attr2: [0, false, 'string', {'1-3': true, 5: true}, ['innermost']],
    },
  },
  // Unquoted strings (only works for those without spaces)
  {
    input: ['attr1=value1', 'attr2=--variable-names-like-css'],
    output: {
      attr1: 'value1',
      attr2: '--variable-names-like-css',
    },
  },
  // Highlight Object (object literal without an attribute name)
  {
    input: ['{}'],
    output: {
      highlight: {},
    },
  },
  {
    input: ['{1-3, 5, numberLines: 7}'],
    output: {
      highlight: {
        '1-3': true,
        5: true,
        numberLines: 7,
      },
    },
  },
  // Multiple Highlight Objects
  {
    input: ['{1-3}', '{5}'],
    output: {
      highlight: {
        '1-3': true,
        5: true,
      },
    },
  },
  // Mixed
  {
    input: ['attr', '{1-3, 5}', 'title="Title Text"'],
    output: {
      attr: true,
      highlight: {
        '1-3': true,
        5: true,
      },
      title: 'Title Text',
    },
  },
  // Well Mixed
  {
    input: [
      'twoslash',
      '{1-3, 5, numberLines: 7}',
      'title="Title Text"',
      'color=--theme-color',
      'themes=[nord, dracula]',
      'css-overrides={ "*": { display: none }}',
    ],
    output: {
      twoslash: true,
      highlight: {
        '1-3': true,
        5: true,
        numberLines: 7,
      },
      title: 'Title Text',
      color: '--theme-color',
      themes: ['nord', 'dracula'],
      'css-overrides': {
        '*': {
          display: 'none',
        },
      },
    },
  },
  // Tricky ??
  {
    input: ['true=false'],
    output: {
      true: false,
    },
  },
  {
    input: ['0=1'],
    output: {
      0: 1, // works because of JS's '0' === 0 for keys
    },
  },
  // Exceptions
  {
    input: ['{1-3, 5'],
    error: new FenceparserError('Unterminated object'),
  },
  {
    input: ['title="Title Text'],
    error: new FenceparserError('Unterminated string'),
  },
  {
    input: ['themes=[nord'],
    error: new FenceparserError('Unterminated array'),
  },
  {
    input: ['{1-3, }'],
    error: new FenceparserError('Trailing comma'),
  },
  {
    input: ['themes=[nord, ]'],
    error: new FenceparserError('Trailing comma'),
  },
  {
    input: ['css={*: {}}'],
    error: new FenceparserError('Unexpected character *'),
  },
] as Parameters<typeof prepareCases>[0]

export const n = cases.length
export default prepareCases(cases)
