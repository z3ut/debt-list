export default function FilterDigitsAndSeparators(input: string): string {
  if (typeof input != 'string') {
    return '';
  }

  const digitsWithSeparatorsRegexp = /(\d|\.|,)/g;
  const matches = input.match(digitsWithSeparatorsRegexp);
  return matches ? matches.join('') : '';
}
