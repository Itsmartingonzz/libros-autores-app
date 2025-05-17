export function toInputDateFormat(fechaISO) {
	if (!fechaISO) return '';
	return fechaISO.split('T')[0]; // "1999-04-01"
}

export function formatearFechaVisual(fechaISO) {
	if (!fechaISO) return '';
	const [año, mes, dia] = fechaISO.split('T')[0].split('-');
	return `${dia}-${mes}-${año}`;
}