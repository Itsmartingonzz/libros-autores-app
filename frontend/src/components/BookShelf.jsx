import { useEffect } from 'react';

import { useFiltro } from '../context/FiltroContext';
import { useAuthor } from '../context/AuthorContext';
import { useBook } from '../context/BookContext';

function BookShelf() {
	const {
		resultados,
		paginaActual,
		setPaginaActual,
		totalPaginas,
		loading,
		fetchData,
		resultadosFiltrados
	} = useFiltro();

	const { setLibroEditando } = useBook();
    const { setAutorSeleccionado } = useAuthor();

	const totalLibros = resultados.reduce((acc, autor) => acc + (autor.libros?.length || 0), 0);

    useEffect(() => {
        fetchData();
    }, []);

	const handleEliminarLibro = async (id) => {
		try {
			const res = await fetch(`http://localhost:5267/api/libros/${id}`, {
				method: 'DELETE'
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || 'No se pudo eliminar el libro');
			}

			toast('Libro eliminado correctamente', 'success');
			await fetchData?.();
		} catch (err) {
			toast(err.message, 'danger');
		}
	};

	return (
		<div className="mt-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h4 className="mb-0">Resultados</h4>
				<button
					className="btn btn-primary"
					onClick={() => setLibroEditando({})}
				>
					<i className="bi bi-plus-lg me-1"></i> Añadir libro
				</button>
			</div>

			{loading ? (
				<p>Cargando libros...</p>
			) : totalLibros === 0 ? (
				<p className="text-muted">No hay libros registrados aún.</p>
			) : (
				<table className="table table-bordered table-hover align-middle">
					<thead className="table-dark">
						<tr>
							<th>Título</th>
							<th>Año</th>
							<th>Género</th>
							<th>Páginas</th>
							<th>Autor</th>
							<th className="text-center">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{resultadosFiltrados.flatMap((autor) =>
							autor.libros?.map((libro) => (
								<tr key={libro.id}>
									<td>{libro.titulo}</td>
									<td>{libro.anio}</td>
									<td>{libro.genero}</td>
									<td>{libro.numeroPaginas}</td>
									<td>
										<button
											className="btn btn-link p-0 text-primary"
											onClick={() => {
												setAutorSeleccionado(autor);
											}}
										>
											{autor.nombreCompleto}
										</button>
									</td>
									<td className="text-center">
										<div className="d-flex justify-content-center gap-2">
											<button
												className="btn btn-sm btn-warning"
												onClick={() => setLibroEditando(libro)}
											>
												Editar
											</button>
											<button 
												className="btn btn-sm btn-danger"
												onClick={() => handleEliminarLibro(libro.id)}
											>
												<i className="bi bi-trash"></i>
											</button>
										</div>
									</td>
								</tr>
							)) || []
						)}
					</tbody>
				</table>
			)}

			{totalPaginas > 1 && (
				<nav className="mt-3">
					<ul className="pagination justify-content-center">
						{Array.from({ length: totalPaginas }).map((_, i) => (
							<li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
								<button className="page-link" onClick={() => setPaginaActual(i + 1)}>
									{i + 1}
								</button>
							</li>
						))}
					</ul>
				</nav>
			)}
		</div>
	);
}

export default BookShelf;
