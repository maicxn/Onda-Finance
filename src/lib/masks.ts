export function maskCpf(value: string): string {
  if (!value) return ''
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function maskCurrency(value: string | number): string {
  if (value === undefined || value === null) return ''
  const stringValue = String(value)
  const digits = stringValue.replace(/\D/g, '')
  if (!digits) return ''
  const num = parseInt(digits, 10)
  return (num / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function currencyToNumber(masked: string): number {
  if (!masked) return 0
  const cleaned = masked.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}
