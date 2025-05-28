/**
 * Detects the type of credit card based on its number.
 * @param {string} cardNumber - The credit card number.
 * @returns {string} - The card type (e.g., 'visa', 'mastercard', 'amex', 'discover', 'unknown').
 */
function getCardType(cardNumber) {
  const num = String(cardNumber).replace(/\D/g, ''); // Remove non-digits

  // Visa
  if (/^4/.test(num)) {
    return 'visa';
  }
  // Mastercard
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(num)) {
    return 'mastercard';
  }
  // American Express
  if (/^3[47]/.test(num)) {
    return 'amex';
  }
  // Discover
  if (/^(6011|65|64[4-9])/.test(num)) {
    return 'discover';
  }
  // Diners Club
  if (/^3(?:0[0-5]|[689])/.test(num)) {
    return 'diners';
  }
  // JCB
  if (/^35(?:2[89]|[3-8][0-9])/.test(num)) {
    return 'jcb';
  }

  return 'unknown';
}