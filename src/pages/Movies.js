import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import CommentsModal from '../components/CommentsModal';

export default function Movies() {
	const { user } = useContext(UserContext);
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	
	// Movie details modal
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState(null);
	
	// Comments modal
	const [showCommentsModal, setShowCommentsModal] = useState(false);
	const [commentsMovie, setCommentsMovie] = useState(null);

	// Fetch movies from API
	const fetchMovies = () => {
		setIsLoading(true);
		setError(null);
		
		fetch('https://movieapp-api-lms1.onrender.com/movies/getMovies', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
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
				setError('Failed to load movies. Please try again.');
				setMovies([]);
			})
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		fetchMovies();
	}, []);

	// Handle view movie details
	const handleViewMovie = (movie) => {
		setSelectedMovie(movie);
		setShowDetailsModal(true);
	};

	// Handle close details modal
	const handleCloseDetailsModal = () => {
		setShowDetailsModal(false);
		setSelectedMovie(null);
	};

	// Handle view comments
	const handleViewComments = (movie) => {
		setCommentsMovie(movie);
		setShowCommentsModal(true);
	};

	// Handle close comments modal
	const handleCloseCommentsModal = () => {
		setShowCommentsModal(false);
		setCommentsMovie(null);
	};

	// If user is not logged in
	if (!user) {
		return (
			<Container className="text-center mt-5">
				<Alert variant="warning">
					<h4>Please login to view movies.</h4>
				</Alert>
			</Container>
		);
	}

	return (
		<Container className="mt-4">
			<h1 className="text-center mb-4">Movie Collection</h1>
			
			{error && (
				<Alert variant="danger" className="mb-4">
					{error}
				</Alert>
			)}

			{isLoading ? (
				<div className="text-center mt-5">
					<Spinner animation="border" variant="primary" size="lg" />
					<p className="mt-3">Loading movies...</p>
				</div>
			) : movies.length === 0 ? (
				<Alert variant="info" className="text-center">
					<h4>No movies available</h4>
					<p>Check back later for new releases!</p>
				</Alert>
			) : (
				<Row>
					{movies.map((movie) => (
						<Col key={movie._id} lg={4} md={6} sm={12} className="mb-4">
							<Card className="h-100 shadow-sm">
								<Card.Body className="d-flex flex-column">
									<Card.Title className="text-primary mb-3">
										{movie.title}
									</Card.Title>
									<Card.Text className="mb-2">
										<strong>Director:</strong> {movie.director}
									</Card.Text>
									<Card.Text className="mb-3">
										<strong>Year:</strong> {movie.year}
									</Card.Text>
									<div className="mt-auto">
										<Button 
											variant="primary" 
											className="me-2 mb-2"
											onClick={() => handleViewMovie(movie)}
										>
											View Movie
										</Button>
										<Button 
											variant="outline-secondary" 
											onClick={() => handleViewComments(movie)}
										>
											Comments
										</Button>
									</div>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			)}

			{/* Movie Details Modal */}
			<Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Movie Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedMovie && (
						<div>
							<h3 className="text-primary mb-3">{selectedMovie.title}</h3>
							<Row>
								<Col md={6}>
									<p><strong>Director:</strong> {selectedMovie.director}</p>
									<p><strong>Year:</strong> {selectedMovie.year}</p>
									<p><strong>Genre:</strong> {selectedMovie.genre}</p>
								</Col>
								<Col md={6}>
									<Button 
										variant="outline-primary" 
										size="sm"
										onClick={() => handleViewComments(selectedMovie)}
									>
										View Comments
									</Button>
								</Col>
							</Row>
							<hr />
							<div>
								<h5>Description</h5>
								<p className="text-muted">{selectedMovie.description}</p>
							</div>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseDetailsModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Comments Modal */}
			<CommentsModal 
				show={showCommentsModal}
				handleClose={handleCloseCommentsModal}
				movie={commentsMovie}
				user={user}
			/>
		</Container>
	);
}