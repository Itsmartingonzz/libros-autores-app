import { createContext, useContext, useState } from 'react';

const AuthorContext = createContext();

export const AuthorProvider = ({ children }) => {
	const [autorSeleccionado, setAutorSeleccionado] = useState(null);
	const [autorEditando, setAutorEditando] = useState(null);

	return (
		<AuthorContext.Provider value={{ autorSeleccionado, setAutorSeleccionado, autorEditando, setAutorEditando }}>
			{children}
		</AuthorContext.Provider>
	);
};

export const useAuthor = () => useContext(AuthorContext);