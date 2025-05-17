import { useFiltro } from '../context/FiltroContext';

function SearchSection() {
	const { filtros, setFiltros } = useFiltro();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFiltros((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<form className="d-flex flex-column gap-3">
			<div>
				<label className="form-label">Visualización</label>
				<select
					name="vista"
					value={filtros.vista}
					onChange={handleChange}
					className="form-select"
				>
					<option value="libros">📚 Libros</option>
					<option value="autores">👤 Autores</option>
				</select>
			</div>

			<div>
				<label className="form-label">Búsqueda</label>
				<input
					type="text"
					name="query"
					value={filtros.query}
					onChange={handleChange}
					className="form-control"
					placeholder="Buscar por título, autor, ciudad, etc."
				/>
			</div>
		</form>
	);
}

export default SearchSection;