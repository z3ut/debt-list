export default function ConvertStringToNumber(string) {
  if (typeof string != 'string') {
    return 0;
  }

  return Number(string.replace(/,/g, '.')) || 0;
}
