import { useState, useEffect } from 'react';
import { useBook } from '../context/BookContext';
import { useFiltro } from '../context/FiltroContext';
import { useAuthor } from '../context/AuthorContext';

import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

function BookForm() {
    const { libroEditando, setLibroEditando, autorRecienCreado, setAutorRecienCreado } = useBook();
    const { setAutorEditando } = useAuthor();
    const { resultados, fetchData } = useFiltro();

    const autoresUnicos = [...new Map(resultados.map(a => [a.rut.replace(/\.|-/g, ''), a])).values()];

    const [show, setShow] = useState(false);
	const [libro, setLibro] = useState({
		titulo: '',
		año: '',
		genero: '',
		numeroPaginas: '',
		autorRut: '',
	});

    // Abrir modal al editar
	useEffect(() => {
		if (libroEditando) {
			setLibro(
                libroEditando.id
                    ? libroEditando
                    : {
                            titulo: '',
                            anio: '',
                            genero: '',
                            numeroPaginas: '',
                            autorRut: ''
                    }
            );

            setShow(true);
        }
    }, [libroEditando]);

    useEffect(() => {
        if (autorRecienCreado) {
            setLibro((prev) => ({
                ...prev,
                autorRut: autorRecienCreado
            }));
            setShow(true);
            setAutorRecienCreado(null);
        }
    }, [autorRecienCreado]);

	const handleChange = (e) => {
        const { name, value } = e.target;
        setLibro((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
		setLibroEditando(null);
		setLibro({
			titulo: '',
			anio: '',
			genero: '',
			numeroPaginas: '',
			autorRut: ''
		});
		setShow(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
            const libroLimpio = {
				...libro,
				anio: Number(libro.anio),
				numeroPaginas: Number(libro.numeroPaginas),
				autorRut: libro.autorRut
			};

			const res = await fetch(
				libroEditando?.id
					? `http://localhost:5267/api/libros/${libroEditando.id}`
					: 'http://localhost:5267/api/libros',
				{
					method: libroEditando?.id ? 'PUT' : 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(libroLimpio)
				}
			);

			const data = res.status !== 204 ? await res.json() : null;
			if (!res.ok) throw new Error(data.message || 'Error al guardar libro');

            await fetchData();

            handleClose();
			toast(libroEditando?.id ? 'Libro actualizado' : 'Libro registrado', 'success');
		} catch (err) {
			toast(err.message, 'danger');
		}
	};

	return (
		<Modal show={show} onHide={handleClose} backdrop="static" centered>
			<Modal.Header closeButton>
				<Modal.Title>{libroEditando?.id ? 'Editar Libro' : 'Registrar Libro'}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Control
							type="text"
							name="titulo"
							value={libro.titulo}
							onChange={handleChange}
							placeholder="Título"
							required
						/>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Col>
							<Form.Control
								type="number"
								name="anio"
								value={libro.anio}
								onChange={handleChange}
								placeholder="Año"
								required
							/>
						</Col>
						<Col>
							<Form.Control
								type="text"
								name="genero"
								value={libro.genero}
								onChange={handleChange}
								placeholder="Género"
								required
							/>
						</Col>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Control
							type="number"
							name="numeroPaginas"
							value={libro.numeroPaginas}
							onChange={handleChange}
							placeholder="Número de páginas"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
                        <Form.Label>Autor</Form.Label>
                        <Row className="g-2">
                            <Col>
                                <Form.Select
                                    name="autorRut"
                                    value={libro.autorRut}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona un autor...</option>
                                    {autoresUnicos.map(a => (
                                        <option key={a.rut} value={a.rut.replace(/\.|-/g, '')}>
                                            {`${a.nombreCompleto} (${a.libros?.length || 0} ${a.libros?.length === 1 ? 'libro' : 'libros'})`}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col xs="auto">
                                <Button 
                                    variant="outline-primary" 
                                    onClick={() => {
                                        setAutorEditando({});
                                        handleClose();
                                    }} 
                                    title="Agregar nuevo autor"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" variant="primary">
						{libroEditando?.id ? 'Guardar Cambios' : 'Registrar'}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default BookForm;
