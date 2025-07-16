import React, { useState } from 'react';
import { Form, Button, Alert, Card, Spinner, Row, Col } from 'react-bootstrap';

export default function GetMovieByIdForm() {
	const [movieId, setMovieId] = useState('');
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSearch = (e) => {
		e.preventDefault();

		if (!movieId.trim()) {
			setError('Please enter a valid Movie ID.');
			return;
		}

		setLoading(true);
		setError('');
		setMovie(null);

		fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovie/${movieId}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then((res) => {
				if (!res.ok) throw new Error(`Movie not found (status ${res.status})`);
				return res.json();
			})
			.then((data) => {
				setMovie(data.movie || data); // Adjust based on API response
			})
			.catch((err) => {
				console.error(err);
				setError('Movie not found. Please check the ID and try again.');
			})
			.finally(() => setLoading(false));
	};

	return (
		<>
			<Form onSubmit={handleSearch}>
				<Row className="align-items-center">
					<Col xs={9}>
						<Form.Control
							type="text"
							placeholder="Enter Movie ID"
							value={movieId}
							onChange={(e) => setMovieId(e.target.value)}
						/>
					</Col>
					<Col xs={3}>
						<Button type="submit" variant="primary" disabled={loading}>
							{loading ? (
								<Spinner animation="border" size="sm" />
							) : (
								'Search'
							)}
						</Button>
					</Col>
				</Row>
			</Form>

			{error && <Alert variant="danger" className="mt-3">{error}</Alert>}

			{movie && (
				<Card className="mt-4">
					<Card.Body>
						<Card.Title>{movie.title}</Card.Title>
						<Card.Subtitle className="mb-2 text-muted">
							Directed by {movie.director}
						</Card.Subtitle>
						<p><strong>Year:</strong> {movie.year}</p>
						<p><strong>ID:</strong> {movie._id}</p>
					</Card.Body>
				</Card>
			)}
		</>
	);
}
