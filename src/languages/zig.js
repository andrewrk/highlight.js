/*
Language: Zig
Author: Andrew Kelley <superjoe30@gmail.com>
Category: system
*/

function(hljs) {
  var ZIG_PRIMITIVE_TYPES = {
    className: 'keyword',
    begin: '\\b[a-z\\d_]*_t\\b'
  };

  var STRINGS = {
    className: 'string',
    variants: [
      hljs.inherit(hljs.QUOTE_STRING_MODE, { begin: '((u8?|U)|L)?"' }),
      {
        begin: '(u8?|U)?R"', end: '"',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        begin: '\'\\\\?.', end: '\'',
        illegal: '.'
      }
    ]
  };

  var NUMBERS = {
    className: 'number',
    variants: [
      { begin: '\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)' },
      { begin: hljs.C_NUMBER_RE }
    ],
    relevance: 0
  };

  var FUNCTION_TITLE = hljs.IDENT_RE + '\\s*\\(';

  var ZIG_KEYWORDS = {
    keyword: 'const var extern volatile export pub noalias inline ' +
      'struct enum union ' +
      'goto break return continue asm defer ' +
      'if else switch ' +
      'while for ' +
      'fn use ' +
      'bool f32 f64 void unreachable type error ' +
      'i8 u8 i16 u16 i32 u32 i64 u64 isize usize ' +
      'i8w u8w i16w i32w u32w i64w u64w isizew usizew ' +
      'c_short c_ushort c_int c_uint c_long c_ulong c_longlong c_ulonglong',
    built_in: 'breakpoint return_address frame_address memcpy memset ' +
      'sizeof alignof max_value min_value member_count typeof ' +
      'add_with_overflow sub_with_overflow mul_with_overflow shl_with_overflow ' +
      'c_include c_define c_undef compile_var const_eval ctz clz ' +
      'import c_import err_name embed_file cmpxchg fence div_exact truncate',
    literal: 'true false null undefined'
  };

  var EXPRESSION_CONTAINS = [
    ZIG_PRIMITIVE_TYPES,
    hljs.C_LINE_COMMENT_MODE,
    hljs.C_BLOCK_COMMENT_MODE,
    NUMBERS,
    STRINGS
  ];

  return {
    aliases: ['zig'],
    keywords: ZIG_KEYWORDS,
    illegal: '</',
    contains: EXPRESSION_CONTAINS.concat([
      ,
      {
        // This mode covers expression context where we can't expect a function
        // definition and shouldn't highlight anything that looks like one:
        // `return some()`, `else if()`, `(x*sum(1, 2))`
        variants: [
          {begin: /=/, end: /;/},
          {begin: /\(/, end: /\)/},
          {beginKeywords: 'new throw return else', end: /;/}
        ],
        keywords: ZIG_KEYWORDS,
        contains: EXPRESSION_CONTAINS.concat([
          {
            begin: /\(/, end: /\)/,
            keywords: ZIG_KEYWORDS,
            contains: EXPRESSION_CONTAINS.concat(['self']),
            relevance: 0
          }
        ]),
        relevance: 0
      },
      {
        className: 'function',
        begin: '(' + hljs.IDENT_RE + '[\\*&\\s]+)+' + FUNCTION_TITLE,
        returnBegin: true, end: /[{;=]/,
        excludeEnd: true,
        keywords: ZIG_KEYWORDS,
        illegal: /[^\w\s\*&]/,
        contains: [
          {
            begin: FUNCTION_TITLE, returnBegin: true,
            contains: [hljs.TITLE_MODE],
            relevance: 0
          },
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            keywords: ZIG_KEYWORDS,
            relevance: 0,
            contains: [
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              STRINGS,
              NUMBERS,
              ZIG_PRIMITIVE_TYPES
            ]
          },
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      }
    ]),
    exports: {
      strings: STRINGS,
      keywords: ZIG_KEYWORDS
    }
  };
}
