export function applyQuoteFormatting(text) {
  return text
    .replaceAll('QUOTE_BEGIN', "<div class='quote'>")
    .replaceAll('QUOTE_END', '</div>');
}

export function stripQuoteTags(text) {
  return text
    .replaceAll('QUOTE_BEGIN', '')
    .replaceAll('QUOTE_END', '');
}
