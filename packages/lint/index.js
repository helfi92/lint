const merge = require('deepmerge');

module.exports = (options = {}) => {
  if (!options.use) {
    throw new Error(
      'The linting middleware requires a base middleware to extend'
    );
  }

  if (!Array.isArray(options.use)) {
    throw new Error(
      'The linting middleware requires an array pair of [base, overrides]'
    );
  }

  return neutrino => {
    const [airbnb, overrides] = options.use;

    neutrino.use(
      airbnb({
        eslint: {
          emitWarning: process.env.NODE_ENV === 'development',
          baseConfig: {
            extends: ['prettier'],
          },
          plugins: ['prettier'],
          rules: {
            'import/no-extraneous-dependencies': 'off',
            // Specify the maximum length of a line in your program
            'max-len': [
              'error',
              80,
              2,
              {
                ignoreUrls: true,
                ignoreComments: false,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
              },
            ],
            // Allow using class methods with static/non-instance functionality
            // React lifecycle methods commonly do not use
            // aninstance context for anything
            'class-methods-use-this': 'off',
            // Allow console during development, otherwise throw an error
            'no-console':
              process.env.NODE_ENV === 'development' ? 'off' : 'error',
            // Allow extra parentheses since multiline
            // JSX being wrapped in parens is considered
            // idiomatic
            'no-extra-parens': 'off',
            // Our frontend strives to adopt functional programming practices,
            // so we prefer const over let
            'prefer-const': 'error',
            'prettier/prettier': [
              'error',
              {
                singleQuote: true,
                trailingComma: 'es5',
                bracketSpacing: true,
                jsxBracketSameLine: true,
                tabWidth: 2,
                semi: true,
              },
            ],
            'padding-line-between-statements': [
              'error',
              {
                blankLine: 'always',
                prev: ['const', 'let', 'var'],
                next: '*',
              },
              {
                blankLine: 'never',
                prev: ['const', 'let', 'var'],
                next: ['const', 'let', 'var'],
              },
              {
                blankLine: 'always',
                prev: ['cjs-import'],
                next: '*',
              },
              {
                blankLine: 'always',
                prev: ['import'],
                next: '*',
              },
              {
                blankLine: 'always',
                prev: '*',
                next: ['cjs-export'],
              },
              {
                blankLine: 'always',
                prev: '*',
                next: ['export'],
              },
              {
                blankLine: 'never',
                prev: ['import'],
                next: ['import'],
              },
              {
                blankLine: 'never',
                prev: ['cjs-import'],
                next: ['cjs-import'],
              },
              {
                blankLine: 'any',
                prev: ['export'],
                next: ['export'],
              },
              {
                blankLine: 'any',
                prev: ['cjs-export'],
                next: ['cjs-export'],
              },
              { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
              {
                blankLine: 'always',
                prev: '*',
                next: ['if', 'do', 'for', 'switch', 'try', 'while'],
              },
              { blankLine: 'always', prev: '*', next: 'return' },
            ],
            'consistent-return': 'off',
            'no-unused-expressions': 'off',
            'no-shadow': 'off',
            'no-return-assign': 'off',
            'babel/new-cap': 'off',
            'no-mixed-operators': 'off',
          },
        },
      })
    );

    if (overrides) {
      neutrino.config.module
        .rule('lint')
        .use('eslint')
        .tap(opts => merge(opts, overrides));
    }
  };
};
