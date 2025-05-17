import { useEffect, useRef, useState } from 'react';
import { Toast as BsToast } from 'bootstrap';

function GlobalToast() {
	const toastRef = useRef(null);
	const [mensaje, setMensaje] = useState('');
	const [tipo, setTipo] = useState('success');
	const [visible, setVisible] = useState(false);

	// Exponer globalmente la función toast()
	useEffect(() => {
		window.toast = (msg, status = null) => {
			let tipo = 'secondary'; // default

			if (typeof status === 'string') {
				// Se pasa directamente el tipo ('success', 'warning', etc.)
				tipo = status;
			} else if (typeof status === 'number') {
				// Se pasa un código HTTP
				if (status >= 200 && status < 300) tipo = 'success';
				else if (status >= 400 && status < 500) {
					tipo = [401, 403].includes(status) ? 'danger' : 'warning';
				} else if (status >= 500) tipo = 'danger';
				else tipo = 'dark';
			}

			setMensaje(msg);
			setTipo(tipo);
			setVisible(true);
		};
	}, []);

	useEffect(() => {
		if (visible && toastRef.current) {
			const toast = new BsToast(toastRef.current, { delay: 3000 });
			toast.show();

			const el = toastRef.current;
			const handleHidden = () => setVisible(false);
			el.addEventListener('hidden.bs.toast', handleHidden);
			return () => el.removeEventListener('hidden.bs.toast', handleHidden);
		}
	}, [visible]);

	return (
		<div className="toast-container position-fixed bottom-0 end-0 p-3">
			<div
				ref={toastRef}
				className={`toast text-bg-${tipo} border-0`}
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
			>
				<div className="d-flex">
					<div className="toast-body">{mensaje}</div>
					<button
						type="button"
						className="btn-close btn-close-white me-2 m-auto"
						data-bs-dismiss="toast"
						aria-label="Cerrar"
					></button>
				</div>
			</div>
		</div>
	);
}

export default GlobalToast;

