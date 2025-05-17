export function formatearRut(rut) {
	if (!rut) return '';

	// Eliminar puntos, guiones y espacios
	const limpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

	if (limpio.length < 2) return limpio;

	const cuerpo = limpio.slice(0, -1);
	const dv = limpio.slice(-1);

	const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

	return `${cuerpoConPuntos}-${dv}`;
}