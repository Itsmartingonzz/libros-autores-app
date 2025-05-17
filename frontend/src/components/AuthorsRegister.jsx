import { useAuthor } from '../context/AuthorContext';
import { useFiltro } from '../context/FiltroContext';
import { formatearRut } from '../utils/rutFormatter';

function AuthorsRegister() {
    	const {
		resultados,
		paginaActual,
		setPaginaActual,
		totalPaginas,
		loading,
		fetchData,
		resultadosFiltrados
	} = useFiltro();

	const { setAutorEditando } = useAuthor();

    const handleEliminarAutor = async (id) => {
        try {
            const res = await fetch(`http://localhost:5267/api/autores/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'No se pudo eliminar el autor');
            }

            toast('Autor eliminado correctamente', 'success');
            await fetchData?.();
        } catch (err) {
            toast(err.message, 'danger');
        }
    }

	return (
		<div className="mt-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h4 className="mb-0">Autores</h4>
				<button
					className="btn btn-primary"
					onClick={() => setAutorEditando({})}
				>
					<i className="bi bi-plus-lg me-1"></i> Añadir autor
				</button>
			</div>

			{resultadosFiltrados.length === 0 ? (
				<p className="text-muted">No hay autores registrados aún.</p>
			) : (
				<table className="table table-bordered table-hover align-middle">
					<thead className="table-dark">
						<tr>
							<th>Nombre</th>
							<th>Correo</th>
							<th>Ciudad</th>
							<th>Libros</th>
							<th className="text-center">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{resultadosFiltrados.map((autor) => (
							<tr key={autor.rut}>
                                <td>
                                    <div className="fw-semibold">{autor.nombreCompleto}</div>
                                    <div className="text-muted small">{formatearRut(autor.rut)}</div>
                                </td>
								<td>{autor.correo}</td>
								<td>{autor.ciudad}</td>
								<td>{autor.libros?.length || 0}</td>
								<td className="text-center">
									<div className="d-flex justify-content-center gap-2">
										<button
											className="btn btn-sm btn-warning"
											onClick={() => setAutorEditando(autor)}
										>
											Editar
										</button>
										<button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleEliminarAutor(autor.rut)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default AuthorsRegister;
