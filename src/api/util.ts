export function pad2Digits (n: number) { return String(n).padStart(2, '0') }
export function addMinutes (date: Date, minutes: number) { return new Date(date.getTime() + minutes * 60000) }
export function dateToIsoLocal (date: Date) { return pad2Digits(date.getHours()) + ':' + pad2Digits(date.getMinutes()) }
export function dateToIsoLocalSeconds (date: Date) { return pad2Digits(date.getHours()) + ':' + pad2Digits(date.getMinutes()) + ':' + pad2Digits(date.getSeconds()) }
