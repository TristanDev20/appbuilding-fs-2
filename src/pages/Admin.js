import { Table, Container, Button, Spinner } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import AddMovie from '../components/AddMovie';
import UpdateMovie from '../components/UpdateMovie';

export default function Admin() {
	const { user } = useContext(UserContext);
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState(null);

	const handleShowUpdateModal = (movie) => {
		setSelectedMovie(movie);
		setShowUpdateModal(true);
	};

	const handleCloseUpdateModal = () => {
		setShowUpdateModal(false);
		setSelectedMovie(null);
	};

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

	const handleDelete = (id) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'This will permanently delete the movie.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${id}`, {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
					.then((res) => {
						// console.log('Delete Status:', res.status);
						if (!res.ok) {
							throw new Error(`HTTP error! status: ${res.status}`);
						}
						return res.json();
					})
					.then((data) => {
						// console.log('Delete Response data:', data);
						if (data.message || data.success) {
							Swal.fire('Deleted!', data.message || 'Movie has been deleted.', 'success');
							fetchData(); 
						} else {
							Swal.fire('Error!', data.message || 'Failed to delete movie.', 'error');
						}
					})
					.catch((err) => {
						console.error('Delete error:', err);
						Swal.fire('Error!', 'Something went wrong.', 'error');
					});
			}
		});
	};


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
				<>
					<Table striped bordered hover responsive>
						<thead className="table-dark">
							<tr>
								<th>#</th>
								<th>Title</th>
								<th>Director</th>
								<th>Year</th>
								<th>Description</th>
								<th>Genre</th>
								<th>Actions</th>
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
									<td>
										<Button 
											variant="warning" 
											size="sm" 
											className="me-2 mb-1" 
											onClick={() => handleShowUpdateModal(movie)}
										>
											Update
										</Button>
										<Button 
											variant="danger" 
											size="sm" 
											className="mx-1" 
											onClick={() => handleDelete(movie._id)}
										>
											Delete
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					
					
					<UpdateMovie 
						show={showUpdateModal} 
						handleClose={handleCloseUpdateModal} 
						movie={selectedMovie} 
						onMovieUpdated={fetchData} 
					/>
				</>
			)}
		</Container>
	);
}