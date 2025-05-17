import { createContext, useContext, useState } from 'react';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
	const [libroEditando, setLibroEditando] = useState(null);
	const [autorRecienCreado, setAutorRecienCreado] = useState(null);
	

	return (
		<BookContext.Provider value={{ 
			libroEditando, 
			setLibroEditando,
			autorRecienCreado,
			setAutorRecienCreado, 
		}}>
			{children}
		</BookContext.Provider>
	);
};

export const useBook = () => useContext(BookContext);
