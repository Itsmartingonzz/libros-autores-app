import { useState, useEffect } from 'react';
import { useAuthor } from '../context/AuthorContext';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

function AuthorDetailsModal() {
	const { autorSeleccionado, setAutorSeleccionado } = useAuthor();
    const [show, setShow] = useState(false);

    // Abrir modal al editar
    useEffect(() => {
        if (autorSeleccionado) {
            setShow(true);
        }
    }, [autorSeleccionado]);

	const handleClose = () => {
		setShow(false);
		setTimeout(() => setAutorSeleccionado(null), 300);
	};

    if (!autorSeleccionado) return null;

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Detalle de Autor</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{autorSeleccionado ? (
					<>
						<p><strong>Nombre:</strong> {autorSeleccionado.nombreCompleto}</p>
						<p><strong>Correo:</strong> {autorSeleccionado.correo}</p>
						<p><strong>Ciudad:</strong> {autorSeleccionado.ciudad}</p>
						<p><strong>Libros registrados:</strong> {autorSeleccionado.libros.length}</p>
					</>
				) : (
					<p>Cargando autor...</p>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>Cerrar</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default AuthorDetailsModal;