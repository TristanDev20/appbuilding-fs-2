import React, { useState } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function AddMovie({ onMovieAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    if (name === 'director') setDirector(value);
    if (name === 'year') setYear(value);
    if (name === 'description') setDescription(value);
    if (name === 'genre') setGenre(value);
  };

  const handleAddMovie = async () => {
    if (!title || !director || !year || !description || !genre) {
      Swal.fire({ icon: 'warning', title: 'Please fill out all fields!' });
      return;
    }

    fetch("https://movieapp-api-lms1.onrender.com/movies/addMovie", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, director, year, description, genre })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Movie added:', data);
      setIsOpen(false);
      setTitle('');
      setDirector('');
      setYear('');
      setDescription('');
      setGenre('');
      onMovieAdded();
      Swal.fire({
        title: "Added Movie Successfully!",
        icon: "success"
      });
    })
    .catch(err => console.error('Error:', err));
  };

  return (
    <Container className="p-0 m-0">
      <Button onClick={() => setIsOpen(true)} className="rounded-0">Add New Movie</Button>

      <Modal show={isOpen} onHide={() => setIsOpen(false)} className='mt-5'>
        <Modal.Header closeButton className='bg-dark text-white'>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Movie Title</Form.Label>
              <Form.Control name="title" value={title} onChange={handleChange} placeholder="Enter movie title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Control name="director" value={director} onChange={handleChange} placeholder="Enter movie director" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control name="year" value={year} onChange={handleChange} placeholder="Enter movie year" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" value={description} onChange={handleChange} placeholder="Enter movie description" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control name="genre" value={genre} onChange={handleChange} placeholder="Enter movie genre" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddMovie}>Add Movie</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
