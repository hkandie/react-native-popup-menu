module.exports = {
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    'eslint-config-prettier'
  ],
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: 'detect'
    },
    // Tells eslint how to resolve imports
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'error',

    // No declaring variables as type: any. You can ignore this error, but you MUST provide a comment with a reason.
    '@typescript-eslint/no-explicit-any': 'error',

    // Allows non-default imports
    'import/named': 'off',

    // Ignoring character escaping - turn back on if we're noticing strange symbols
    'react/no-unescaped-entities': 'off',

    // Ensuring no console statements
    'no-console': 'warn',

    // Just for me for now
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/prop-types': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-empty': 'off',
    'no-constant-condition': 'off',
    'no-irregular-whitespace': 'off',
    'no-unreachable': 'off',
    'no-useless-escape': 'off',
    'no-empty-pattern': 'off',
    'no-prototype-builtins': 'off',
    'no-async-promise-executor': 'off',
    'no-unsafe-finally': 'off',
    'no-constant-condition': 'off',
    'no-irregular-whitespace': 'off',
    'no-unreachable': 'off',
    'no-useless-escape': 'off',
    'no-empty-pattern': 'off',
    'no-prototype-builtins': 'off',
    'no-async-promise-executor': 'off',
    'no-unsafe-finally': 'off',
    'no-constant-condition': 'off'
  }
};
