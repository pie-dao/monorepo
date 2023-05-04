import {
  formatAsPercentOfTotal,
  formatBalanceCurrency,
  formatAsPercent,
} from '../formatBalance';

describe('formatAsPercentOfTotal', () => {
  test('returns correct percentage without unnecessary fraction digits', () => {
    expect(formatAsPercentOfTotal(50, 100)).toBe('50%');
    expect(formatAsPercentOfTotal(50, 200)).toBe('25%');
    expect(formatAsPercentOfTotal(45, 150)).toBe('30%');
    expect(formatAsPercentOfTotal(33.33, 100)).toBe('33.33%');
    expect(formatAsPercentOfTotal(66.67, 100)).toBe('66.67%');
  });

  test('throws an error on invalid input', () => {
    expect(() => formatAsPercentOfTotal(50, 0)).toThrowError('Invalid input');
    expect(() => formatAsPercentOfTotal(50, NaN)).toThrowError('Invalid input');
    expect(() => formatAsPercentOfTotal(NaN, 100)).toThrowError(
      'Invalid input',
    );
  });
});

describe('formatBalanceCurrency', () => {
  test('should format with default values', () => {
    const formatted = formatBalanceCurrency(1234.56);
    expect(formatted).toBe('$1,234.56');
  });

  test('should format with a custom locale', () => {
    const formatted = formatBalanceCurrency(1234.56, 'de-DE');
    expect(formatted).toBe('1.234,56 $');
  });

  test('should format with a custom currency', () => {
    const formatted = formatBalanceCurrency(1234.56, 'en-US', 'EUR');
    expect(formatted).toBe('€1,234.56');
  });

  test('should format using compact notation', () => {
    const formatted = formatBalanceCurrency(1234567.89, 'en-US', 'USD', true);
    expect(formatted).toBe('$1.23M');
  });

  test('should format with custom maximum fraction digits', () => {
    const formatted = formatBalanceCurrency(
      1234.5678,
      'en-US',
      'USD',
      false,
      4,
    );
    expect(formatted).toBe('$1,234.5678');
  });

  test('should handle a missing balance amount', () => {
    const formatted = formatBalanceCurrency(undefined);
    expect(formatted).toBe('$0.00');
  });
});

describe('formatAsPercent', () => {
  test('should format with default values', () => {
    const formatted = formatAsPercent(12.345);
    expect(formatted).toBe('12.345%');
  });

  test('should format with a custom locale', () => {
    const formatted = formatAsPercent(12.345, 'de-DE');
    expect(formatted).toBe('12,345 %');
  });

  test('should format with custom maximum fraction digits', () => {
    const formatted = formatAsPercent(12.345, 'en-US', 1);
    expect(formatted).toBe('12.3%');
  });

  test('should handle a missing number', () => {
    const formatted = formatAsPercent(undefined);
    expect(formatted).toBe('0%');
  });

  test('should handle negative numbers', () => {
    const formatted = formatAsPercent(-12.345);
    expect(formatted).toBe('-12.345%');
  });

  test('should format without unnecessary fraction digits', () => {
    const formatted = formatAsPercent(12);
    expect(formatted).toBe('12%');
  });

  test('should format with necessary fraction digits only', () => {
    const formatted = formatAsPercent(12.3);
    expect(formatted).toBe('12.3%');
  });
});
