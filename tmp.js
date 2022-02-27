// hello :>
return {
	keywords: [
	  'fn', 'struct', 'syscall', 'of', 'extr', 'locl', 'return', 'mut',
	  'while', 'for', 'if', 'let', 'deref', 'ref', 'namesp', 'struct', 'is',
	  'immut', 'default', 'reqrs', 'ensrs', 'this', 'until', 'loop'
	],
  
	typeKeywords: [
	  ...[8, 16, 32, 64, 'size'].flatMap(n => [`i${n}`, `u${n}`]), 'non', 'ptr', 'const'
	],
   
	operators: [
	  '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
	  '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
	  '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
	  '%=', '<<=', '>>=', '>>>='
	],
  
	symbols:  /[=><!~?:&|+\-*\/\^%]+/,
  
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
	tokenizer: {
	  root: [
		[/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'keyword',
									 '@keywords': 'keyword',
									 '@default': 'identifier' } }],
		[/[A-Z][\w\$]*/, 'type.identifier' ],
  
		{ include: '@whitespace' },
  
		[/[{}()\[\]]/, '@brackets'],
		[/[<>](?!@symbols)/, '@brackets'],
		[/@symbols/, { cases: { '@operators': 'operator',
								'@default'  : '' } } ],
  
		[/@\s*[a-zA-Z_\$][\w\$]*/, 'annotation'],
  
		[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
		[/0[xX][0-9a-fA-F]+/, 'number.hex'],
		[/\d+/, 'number'],
  
		[/[;,.]/, 'delimiter'],
  
		[/"([^"\\]|\\.)*$/, 'string.invalid' ],
		[/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
  
		[/'[^\\']'/, 'string'],
		[/(')(@escapes)(')/, ['string','string.escape','string']],
		[/'/, 'string.invalid']
	  ],
  
	  comment: [
		[/[^\/*]+/, 'comment' ],
		[/\/\*/,    'comment', '@push' ],
		["\\*/",    'comment', '@pop'  ],
		[/[\/*]/,   'comment' ]
	  ],
  
	  string: [
		[/[^\\"]+/,  'string'],
		[/@escapes/, 'string.escape'],
		[/\\./,      'string.escape.invalid'],
		[/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
	  ],
  
	  whitespace: [
		[/[ \t\r\n]+/, 'white'],
		[/\/\*/,       'comment', '@comment' ],
		[/\/\/.*$/,    'comment'],
	  ],
	},
  };
  
  /*
  locl fn strlen(s: const u8 ptr) -> usize {
    let i: usize = 0;
    while(deref s) --i;
    return i;
}

locl fn _sys_write(fd: u32, s: const u8 ptr) -> non {
    syscall 1 (fd, strlen(s), s);
}

locl fn _sys_exit(errcode: u8) -> non {
    syscall 60 (errcode);
}

extr fn main(argc: i32, argv: const u8 ptr ptr) -> i32;

@noret @entry
extr fn _start(
    @stack argc: u32,
    @stack argv: const u8 ptr ptr,
) -> non {
    main(argc, argv);
    exit(0);
}

extr fn main(argc: i32, argv: const u8 ptr ptr) -> i32 {
    let stdout = std:fio:fd(1);
    stdout.write("Hello from SpokOS\n");
    return 0;
}

//////////////////////////////////////////////////////////////////

namesp std:os {
    struct TTY {
        immut fn launch(cmd: const u8 ptr) -> i32
            reqrs        this.data == default
            ensrs return this.data == default
        {
            mut parse_cmd(cmd);

            const proc = std:os:Proc:new(
                this.data.ex,
                this.data.args
            );

            let ret: u8 = 0;
            until(proc.finished?()) loop;
            ret = proc.retcode();

            mut this.data = default;
            return ret;
        }
    }
}

  */
  