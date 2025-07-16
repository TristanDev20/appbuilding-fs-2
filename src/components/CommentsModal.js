import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function CommentsModal({ show, handleClose, movie, user }) {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	// Fetch comments for the movie
	const fetchComments = () => {
		if (!movie?._id) return;
		
		setIsLoading(true);
		setError(null);
		
		fetch(`https://movieapp-api-lms1.onrender.com/movies/getComments/${movie._id}`, {
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
				console.log('Comments response:', data);
				// Adjust based on your API response structure
				if (Array.isArray(data)) {
					setComments(data);
				} else if (Array.isArray(data.comments)) {
					setComments(data.comments);
				} else {
					setComments([]);
				}
			})
			.catch((err) => {
				console.error('Fetch comments error:', err);
				setError('Failed to load comments.');
				setComments([]);
			})
			.finally(() => setIsLoading(false));
	};

	// Submit new comment
	const handleSubmitComment = (e) => {
		e.preventDefault();
		
		if (!newComment.trim()) {
			Swal.fire('Error', 'Please enter a comment.', 'error');
			return;
		}

		setIsSubmitting(true);
		
		fetch(`https://movieapp-api-lms1.onrender.com/movies/addComment/${movie._id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({ comment: newComment })
		})
			.then((res) => {
				console.log('Add comment status:', res.status);
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				console.log('Add comment response:', data);
				// Updated success condition based on common API response patterns
				if (data.message || data.success || data.comment || data.result) {
					Swal.fire('Success', data.message || 'Comment added successfully!', 'success');
					setNewComment('');
					fetchComments(); // Refresh comments
				} else {
					Swal.fire('Error', data.message || 'Failed to add comment.', 'error');
				}
			})
			.catch((err) => {
				console.error('Add comment error:', err);
				Swal.fire('Error', 'Something went wrong.', 'error');
			})
			.finally(() => setIsSubmitting(false));
	};

	// Fetch comments when modal opens and movie changes
	useEffect(() => {
		if (show && movie) {
			fetchComments();
		}
	}, [show, movie]);

	// Reset form when modal closes
	useEffect(() => {
		if (!show) {
			setNewComment('');
			setError(null);
		}
	}, [show]);

	return (
		<Modal show={show} onHide={handleClose} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					Comments for "{movie?.title}"
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
				{error && (
					<Alert variant="danger" className="mb-3">
						{error}
					</Alert>
				)}

				{/* Add Comment Form */}
				<Form onSubmit={handleSubmitComment} className="mb-4">
					<Form.Group>
						<Form.Label>Add a comment</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Share your thoughts about this movie..."
							disabled={isSubmitting}
						/>
					</Form.Group>
					<Button 
						type="submit" 
						variant="primary" 
						className="mt-2"
						disabled={isSubmitting || !newComment.trim()}
					>
						{isSubmitting ? (
							<>
								<Spinner animation="border" size="sm" className="me-2" />
								Adding...
							</>
						) : (
							'Add Comment'
						)}
					</Button>
				</Form>

				<hr />

				{/* Comments List */}
				<div>
					<h6 className="mb-3">
						Comments 
						{comments.length > 0 && (
							<Badge bg="secondary" className="ms-2">
								{comments.length}
							</Badge>
						)}
					</h6>

					{isLoading ? (
						<div className="text-center py-3">
							<Spinner animation="border" size="sm" />
							<p className="mt-2 mb-0">Loading comments...</p>
						</div>
					) : comments.length === 0 ? (
						<Alert variant="info" className="text-center">
							No comments yet. Be the first to comment!
						</Alert>
					) : (
						<ListGroup variant="flush">
							{comments.map((comment, index) => (
								<ListGroup.Item key={comment._id || index} className="px-0">
									<div className="d-flex justify-content-between align-items-start">
										<div>
											<strong className="text-primary">
												{comment.user?.firstName && comment.user?.lastName 
													? `${comment.user.firstName} ${comment.user.lastName}`
													: comment.user?.email || comment.userId || 'Anonymous User'}
											</strong>
											<p className="mb-1 mt-1">{comment.comment}</p>
										</div>
									</div>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}