import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function UpdateMovie({ show, handleClose, movie, onMovieUpdated }) {
	const [title, setTitle] = useState('');
	const [director, setDirector] = useState('');
	const [year, setYear] = useState('');
	const [description, setDescription] = useState('');
	const [genre, setGenre] = useState('');

	useEffect(() => {
		if (movie) {
			setTitle(movie.title || '');
			setDirector(movie.director || '');
			setYear(movie.year || '');
			setDescription(movie.description || '');
			setGenre(movie.genre || '');
		}
	}, [movie]);

	const handleSubmit = (e) => {
		e.preventDefault();
		
		if (!movie || !movie._id) {
			Swal.fire('Error', 'Movie data is missing.', 'error');
			return;
		}

		fetch(`https://movieapp-api-lms1.onrender.com/movies/updateMovie/${movie._id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify({ title, director, year, description, genre }),
		})
			.then(res => {
				console.log('Status:', res.status);
				
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json(); 
			})
			.then(data => {
				// console.log('Response data:', data);
				if (data.updatedMovie || data.message === "Movie updated successfully" || data.success) {
					Swal.fire('Success', data.message || 'Movie updated successfully!', 'success');
					onMovieUpdated();
					handleClose();
				} else {
					Swal.fire('Error', data.message || 'Failed to update movie.', 'error');
				}
			})
			.catch(err => {
				// console.error('Update error:', err);
				Swal.fire('Error', 'Something went wrong.', 'error');
			});
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Update Movie</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Title</Form.Label>
						<Form.Control 
							type="text" 
							value={title} 
							onChange={(e) => setTitle(e.target.value)} 
							required 
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Director</Form.Label>
						<Form.Control 
							type="text" 
							value={director} 
							onChange={(e) => setDirector(e.target.value)} 
							required 
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Year</Form.Label>
						<Form.Control 
							type="number" 
							value={year} 
							onChange={(e) => setYear(e.target.value)} 
							required 
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Description</Form.Label>
						<Form.Control 
							as="textarea" 
							rows={2} 
							value={description} 
							onChange={(e) => setDescription(e.target.value)} 
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Genre</Form.Label>
						<Form.Control 
							type="text" 
							value={genre} 
							onChange={(e) => setGenre(e.target.value)} 
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="primary" type="submit">
						Update Movie
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}