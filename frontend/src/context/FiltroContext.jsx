import { createContext, useContext, useState, useMemo } from 'react';

const FiltroContext = createContext();

export const FiltroProvider = ({ children }) => {
	const [filtros, setFiltros] = useState({
		query: '',
		vista: 'libros'
	});

	const [loading, setLoading] = useState(false);
	const [resultados, setResultados] = useState([]);
	const [paginaActual, setPaginaActual] = useState(1);

	const resultadosFiltrados = useMemo(() => {
		const q = filtros.query.trim().toLowerCase();
		if (!q) return resultados;

		function analizarTérmino(q) {
			const cleaned = q.trim().toLowerCase();

			// RUT válido con o sin puntos y guión
			const rutRegex = /^(?:(\d{1,2}\.\d{3}\.\d{3}-[\dkK])|(\d{7,8}-?[\dkK]))$/;
			if (rutRegex.test(cleaned)) {
				const rutLimpio = cleaned.replace(/\./g, '').replace(/-/g, '');
				return { tipo: 'rut', valor: rutLimpio };
			}

			// Rango de años
			if (/^\d{4}-\d{4}$/.test(cleaned)) {
				const [desde, hasta] = cleaned.split('-').map(s => Number(s));
				if (desde <= hasta && desde >= 1000 && hasta <= 2025) {
					return { tipo: 'rango', valor: { desde, hasta } };
				}
			}

			// Detectar si es año válido
			if (/^\d{4}$/.test(cleaned) && Number(cleaned) >= 0 && Number(cleaned) <= 2025) {
				return { tipo: 'anio', valor: cleaned };
			}

			// Texto libre
			return { tipo: 'texto', valor: cleaned };
		}

		const { tipo, valor } = analizarTérmino(q);

		console.log(`[Filtro] tipo: ${tipo}, valor: ${valor}`);

		if (filtros.vista === 'libros') {
			return resultados
				.map((autor) => {
					const librosFiltrados = autor.libros?.filter((libro) => {
						switch (tipo) {
							case 'rut':
								return autor.rut.replace(/\./g, '').replace(/-/g, '').toLowerCase().includes(valor);
							case 'anio':
								return libro.anio?.toString() === valor;
							case 'rango': {
								const anioLibro = Number(libro.anio);
								return !isNaN(anioLibro) &&
									anioLibro >= valor.desde &&
									anioLibro <= valor.hasta;
							}
							case 'texto':
								return [
									libro.titulo,
									libro.genero,
									autor.nombreCompleto,
									autor.ciudad
								].some((campo) => campo?.toLowerCase().includes(valor));
							default:
								return false;
						}
					});

					return { ...autor, libros: librosFiltrados };
				})
				.filter((autor) => autor.libros?.length > 0);
		}

		if (filtros.vista === 'autores') {
			return resultados.filter((autor) => {
				switch (tipo) {
					case 'rut':
						return autor.rut.replace(/\./g, '').replace(/-/g, '').toLowerCase().includes(valor);
					case 'texto':
						return [
							autor.nombreCompleto,
							autor.correo,
							autor.ciudad,
							...(autor.libros?.map((l) => l.titulo) ?? [])
						].some((campo) => campo?.toLowerCase().includes(valor));
					default:
						return false;
				}
			});
		}

		return resultados;
	}, [filtros, resultados]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const query = new URLSearchParams();

			const res = await fetch(`http://localhost:5267/api/autores?${query}`);
			const data = await res.json();

			setResultados(data);
		} catch (err) {
			console.error('Error al obtener autores:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<FiltroContext.Provider value={{
			filtros,
			setFiltros,
			loading,
			setLoading,
			resultados,
			setResultados,
			paginaActual,
			setPaginaActual,
			fetchData,
			resultadosFiltrados
		}}>
			{children}
		</FiltroContext.Provider>
	);
};

export const useFiltro = () => useContext(FiltroContext);