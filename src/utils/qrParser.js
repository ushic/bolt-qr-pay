/**
 * Validates and parses QR code data according to the specified format
 * @param {string} data - Raw QR code data
 * @returns {Object} Parsed data object or null if invalid
 */
export function parseQrData(data) {
  if (!data || typeof data !== 'string') return null

  const parts = data.split('|')
  if (parts.length !== 5) return null

  const [serialNumber, amount, date, time, merchantName] = parts

  // Validate amount is numeric
  if (!/^\d+$/.test(amount)) return null

  // Validate date format (MMDD)
  if (!/^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(date)) return null

  // Validate time format (HHMMSS)
  if (!/^([01]\d|2[0-3])([0-5]\d)([0-5]\d)$/.test(time)) return null

  return {
    serialNumber,
    amount: parseInt(amount),
    date: formatDate(date),
    time: formatTime(time),
    merchantName,
    raw: data
  }
}

function formatDate(mmdd) {
  const month = mmdd.slice(0, 2)
  const day = mmdd.slice(2)
  return `${month}/${day}`
}

function formatTime(hhmmss) {
  const hours = hhmmss.slice(0, 2)
  const minutes = hhmmss.slice(2, 4)
  const seconds = hhmmss.slice(4)
  return `${hours}:${minutes}:${seconds}`
}
