import { Table, Container, Button, Spinner } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { useEffect, useState, useContext } from 'react';
import AddMovie from '../components/AddMovie';

export default function Admin() {
	const { user } = useContext(UserContext);
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = () => {
		setIsLoading(true);
		fetch('https://movieapp-api-lms1.onrender.com/movies/getMovies', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setMovies(data);
				} else if (Array.isArray(data.movies)) {
					setMovies(data.movies);
				} else {
					setMovies([]);
				}
			})
			.catch((err) => {
				console.error('Fetch error:', err);
				setMovies([]);
			})
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (!user) {
		return (
			<Container className="text-center mt-5">
				<h3>Please login to view your movies.</h3>
			</Container>
		);
	}

	if (!user.isAdmin) {
		return (
			<Container className="text-center mt-5">
				<h3>This is for Admin user only.</h3>
			</Container>
		);
	}

	return (
		<Container className="mt-5">
			<h1 className="text-center mb-4">Admin Dashboard</h1>

			<div className="d-flex justify-content-center mb-4">
				<AddMovie onMovieAdded={fetchData} />
			</div>

			{isLoading ? (
				<div className="text-center mt-5">
					<Spinner animation="border" variant="primary" />
				</div>
			) : (
				<Table striped bordered hover responsive>
					<thead className="table-dark">
						<tr>
							<th>#</th>
							<th>Title</th>
							<th>Director</th>
							<th>Year</th>
							<th>Description</th>
							<th>Genre</th>
						</tr>
					</thead>
					<tbody>
						{movies.map((movie, index) => (
							<tr key={movie._id}>
								<td>{index + 1}</td>
								<td>{movie.title}</td>
								<td>{movie.director}</td>
								<td>{movie.year}</td>
								<td>{movie.description}</td>
								<td>{movie.genre}</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</Container>
	);
}
	