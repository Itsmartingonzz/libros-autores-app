import { FiltroProvider, useFiltro } from './context/FiltroContext';
import { AuthorProvider } from './context/AuthorContext';
import { BookProvider } from './context/BookContext';

import SearchSection from './components/SearchSection';
import AuthorForm from './components/AuthorForm';
import BookForm from './components/BookForm';
import BookShelf from './components/BookShelf';
import AuthorDetailsModal from './components/AuthorDetailsModal';
import GlobalToast from './components/Toast';
import AuthorsRegister from './components/AuthorsRegister';

function AppContent() {
	const { filtros } = useFiltro();

	const contenidoPrincipal = filtros.vista === 'libros'
		? <BookShelf />
		: <AuthorsRegister />;

  	return (
		<div className="container-fluid py-4">
			<h1 className="text-center mb-4">Gestor de Libros y Autores</h1>
			<div className="row">
				<div className="col-md-2 border-end pe-4">
					<h5 className="mb-3">Filtros</h5>
					<SearchSection />
				</div>
				<div className="col-md-10 ps-4">
					{contenidoPrincipal}
					<AuthorDetailsModal/>
				</div>
			</div>
			<AuthorForm />
			<BookForm />
		</div>
  	);
}

function App() {
	return (
		<FiltroProvider>
			<AuthorProvider>
				<BookProvider>
					<AppContent />
					<GlobalToast />
				</BookProvider>
			</AuthorProvider>
		</FiltroProvider>
	);
}

export default App;
