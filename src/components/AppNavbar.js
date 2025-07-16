import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import UserContext from '../context/UserContext';


export default function AppNavbar(){

	const { user } = useContext(UserContext);

	return (
  <Navbar expand="lg" className="bg-light">
    <Container className="ms-0">
      <Navbar.Brand as={Link} to="/">Movie Catalog System</Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">

          {/* Show this if user is logged in */}
          {user?.id ? (
            <>
              {user.isAdmin ? (
                <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
              )}
              <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
            </>
          ) : (
            // Show this if user is not logged in
            <>
              <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
              <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
            </>
          )}

        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

}