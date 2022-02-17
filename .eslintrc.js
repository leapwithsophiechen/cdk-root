module.exports = {
  env: {
    es2021: true,
    node: true,
  },

  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:typescript-sort-keys/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    sourceType: 'module',
  },

  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import-helpers',
    'import',
    'sort-destructure-keys',
    'sort-keys-fix',
    'typescript-sort-keys',
    'unused-imports',
    'prettier',
  ],

  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': [
      2,
      {
        allow: [
          'resolve',
          'reject',
          'done',
          'next',
          'err',
          'error',
          'decodedToken',
        ],
        hoist: 'all',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['off'],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-spacing': [
      'error',
      {
        after: true,
        before: true,
      },
    ],
    'comma-dangle': 'off',
    curly: ['error'],
    'global-require': 'off',
    'import-helpers/order-imports': [
      'error',
      {
        alphabetize: {
          ignoreCase: true,
          order: 'asc',
        },
        groups: ['module', '/^@shared/', ['parent', 'sibling', 'index']],
      },
    ],
    'import/extensions': ['never' | 'always' | 'ignorePackages'],
    'import/prefer-default-export': 'off',
    'max-len': [
      'error',
      {
        code: 250,
      },
    ],
    'no-console': [1],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      },
    ],
    'no-new': 'off',
    'no-param-reassign': [
      'warn',
      {
        ignorePropertyModificationsFor: ['ctx', 'state', 'acc'],
        props: true,
      },
    ],
    'no-template-curly-in-string': 'off',
    'no-unused-vars': [
      1,
      {
        argsIgnorePattern:
          'res|next|^err|rejectedFiles|body|options|request|reply|error|_context|_',
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'padded-blocks': ['warn', 'never'],
    'prettier/prettier': [
      'warn',
      {
        bracketSpacing: true,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    semi: 'error',
    'sort-destructure-keys/sort-destructure-keys': [
      'error',
      { caseSensitive: false },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: true,
        minKeys: 2,
        natural: false,
      },
    ],
    'sort-keys-fix/sort-keys-fix': 'warn',
    'space-before-function-paren': 'off',
    // 'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
  },
};
