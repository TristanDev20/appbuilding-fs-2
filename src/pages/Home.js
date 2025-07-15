import React, { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';


export default function Home(){
	const { user } = useContext(UserContext);
	return (
		<>
		<Container className="top-right">
			<div className="d-flex flex-column align-items-center text-center">
			<h1>Movie Catalog System</h1>
			<h5 className="mb-3">Here's the Movie list today</h5>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
			</div>
		</Container>
		</>
		)
}