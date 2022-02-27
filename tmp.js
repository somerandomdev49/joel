// hello :>
return {
	keywords: [
		'fn', 'struct', 'syscall', 'of', 'extr', 'locl', 'return', 'mut', 'in',
		'while', 'for', 'if', 'let', 'deref', 'ref', 'namesp', 'struct', 'is',
		'immut', 'default', 'reqrs', 'ensrs', 'this', 'until', 'break', 'do',
		'static', 'type',  'template', 'using', 'cast', 'foreach', 'continue',
		'true', 'false', 'else'
	],
	
	typeKeywords: [
		...[8, 16, 32, 64, 'size'].flatMap(n => [`i${n}`, `u${n}`]), 'non',
		'ptr', 'const', 'bool'
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
    i
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
    stdout.write("hello from nocturne in spokos!\n");
    0
}

//////////////////////////////////////////////////////////////////

namesp std:os
{
    locl namesp util {
        using namesp std:containers;
        using namesp std:traits;
        using namesp std:stream;
        using namesp std:ctype;

        template(type T = Vec:<Str>)
        extr fn parse_cmd(cmd: immut ref Str) -> T
            reqrs IsContainer:<T, Str>,
                  DefaultInitable:<T>
        {
            let v: T = default;
            
            let mut i: usize = 0;
            while true {
                while is_space?() { ++i }
                let j = i;
                if cmd[i] == '"' {
                    i += 1;
                    while cmd[i] != '"' { ++i }
                    i += 1;
                } else {
                    until is_space?() { ++i }
                }
                v.push(Str:fromRange(&cmd[j], &cmd[i]));
            }
            
            return v
        }
    }

    extr fn sync_launch(cmd: immut ref Str) -> Err:<i32> {
        mutex.locked(fn() immut ref -> Err:<i32> {
            let data = util:parse_cmd(cmd);

            let immut proc = std:os:Proc(
                data[0],
                data[1..],
            );

            if let s = proc.start() in s.error?() {
                return Err:Error(s.error())
            }

            until proc.finished?() { @empty }
            
            proc.retcode()
        });
    }
}

//////////////////////////////////////////////////////////////////

namesp examples:e0 {
    fn test() {
    
    }
}

*/
