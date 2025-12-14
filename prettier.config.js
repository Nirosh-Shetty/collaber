/** @type {import("prettier").Config} */
export default {
  semi: true,                 // Explicit > implicit
  singleQuote: false,          
  trailingComma: 'es5',       // Works in Node + modern browsers
  printWidth: 100,            // Readable without being obnoxious
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',

  // JSX / Next.js
  jsxSingleQuote: false,
  bracketSameLine: false,

  // Imports & formatting sanity
  quoteProps: 'as-needed',
  proseWrap: 'preserve',
};
