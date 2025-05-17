import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

import { useAuthor } from '../context/AuthorContext';
import { useFiltro } from '../context/FiltroContext';
import { useBook } from '../context/BookContext';

import { formatearRut } from '../utils/rutFormatter';
import { toInputDateFormat } from '../utils/dateFormatter';

function AuthorForm() {
    const { autorEditando, setAutorEditando } = useAuthor();
	const { setAutorRecienCreado } = useBook();
	const { fetchData, filtros } = useFiltro();

	const [show, setShow] = useState(false);
	const [autor, setAutor] = useState({
		rut: '',
		nombreCompleto: '',
		fechaNacimiento: '',
		ciudad: '',
		correo: '',
	});

    // Formatear el RUT al abrir el modal
    useEffect(() => {
        if (autorEditando) {
            const autorFormateado = {
                ...autorEditando,
                rut: formatearRut(autorEditando.rut)
            };

            setAutor({
                rut: '',
                nombreCompleto: '',
                fechaNacimiento: '',
                ciudad: '',
                correo: ''
            });

            // Forzar carga después de limpiar
            setTimeout(() => {
                setAutor(autorFormateado);
                setShow(true);
            }, 50);
        }
    }, [autorEditando]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		const nuevoValor = name === 'rut'
			? formatearRut(value.replace(/\./g, '').replace('-', ''))
			: value;
		setAutor((prev) => ({ ...prev, [name]: nuevoValor }));
	};

	const handleClose = () => {
		setShow(false);
		setTimeout(() => {
			setAutorEditando(null)
			setAutor({
				rut: '',
				nombreCompleto: '',
				fechaNacimiento: '',
				ciudad: '',
				correo: ''
			});
		}, 300);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
            const autorLimpio = {
                ...autor,
                rut: autor.rut.replace(/\./g, '').replace(/-/g, '')
            };

			const res = await fetch(
				autorEditando?.rut
					? `http://localhost:5267/api/autores/${autorLimpio.rut}`
					: 'http://localhost:5267/api/autores',
				{
					method: autorEditando?.rut ? 'PUT' : 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(autorLimpio)
				}
			);

			const data = res.status !== 204 ? await res.json() : null;
			if (!res.ok) throw new Error(data.message || 'Error al guardar autor');

            await fetchData();

			if (filtros.vista === 'libros') {
				setAutorRecienCreado(autorLimpio.rut);
			}
			handleClose();
			toast(autorEditando ? 'Autor actualizado' : 'Autor registrado', 'success');
		} catch (err) {
            console.log(JSON.stringify(autor))
			toast(err.message, 'danger');
		}
	};

	return (
		<Modal show={show} onHide={handleClose} backdrop="static" centered>
			<Modal.Header closeButton>
				<Modal.Title>{autorEditando?.rut ? 'Editar Autor' : 'Registrar Autor'}</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Group className="position-relative mb-3">
						<Form.Control
							type="text"
							name="rut"
							value={formatearRut(autor.rut)}
							onChange={handleChange}
							placeholder="RUT"
							disabled={!!autorEditando?.rut}
							required
						/>
						{autorEditando?.rut && (
							<i
								className="bi bi-question-circle-fill text-muted position-absolute end-0 top-50 translate-middle-y me-3"
								data-bs-toggle="tooltip"
								data-bs-placement="left"
								title="El RUT no se puede modificar. Crea un nuevo autor y elimina este si necesitas cambiarlo."
								style={{ cursor: 'pointer' }}
							></i>
						)}
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Control
							type="text"
							name="nombreCompleto"
							value={autor.nombreCompleto}
							onChange={handleChange}
							placeholder="Nombre completo"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Control
							type="date"
							name="fechaNacimiento"
							value={toInputDateFormat(autor.fechaNacimiento)}
							onChange={handleChange}
							required
							max={new Date().toISOString().split('T')[0]}
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Control
							type="text"
							name="ciudad"
							value={autor.ciudad}
							onChange={handleChange}
							placeholder="Ciudad de procedencia"
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Control
							type="email"
							name="correo"
							value={autor.correo}
							onChange={handleChange}
							placeholder="Correo electrónico"
							required
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" variant="primary">
						{autorEditando?.rut ? 'Guardar Cambios' : 'Registrar'}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default AuthorForm;
