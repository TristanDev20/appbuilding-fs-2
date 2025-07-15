import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {

	const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);


    function authenticate(e) {

        
        e.preventDefault();
		fetch('https://movieapp-api-lms1.onrender.com/users/login',{

		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({

			email: email,
			password: password

		})
	})
	.then(res => res.json())
	.then(data => {
    // console.log(data);


    if (data.access) {
        localStorage.setItem('token', data.access);
        retrieveUserDetails(data.access);

        Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: "Movie Catalog System!"
        })
  


    } else {
        Swal.fire({
            title: "Login Failed",
            icon: "error",
            text: data.message || "Please check your credentials and try again."
        });
    }
})

	setEmail('');
	setPassword('');

    }

    const retrieveUserDetails = (token) => {
        
        fetch('https://movieapp-api-lms1.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${ token }`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Fetched user details:', data);
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin
            });

        })

    };

    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

    return (
    (user.id === null ) ?
    <>
			<Container className="mt-5 d-flex justify-content-center">
			<div className="border rounded mt-5 px-5 pt-4 pb-2 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
            <h1 className="text-center mb-4">Log In</h1>
            <Form onSubmit={(e) => authenticate(e)}>
              <Form.Group controlId="userEmail" className="mb-3">
                <Form.Label className='mb-0 mt-3'>Email address</Form.Label>
                <Form.Control 
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-4">
                <Form.Label className='mb-0 mt-3'>Password</Form.Label>
                <Form.Control 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button 
                className="w-100 my-2 btn-submit" 
                type="submit" 
                variant={"danger"}
                disabled={!isActive}
              >
                Submit
              </Button>

              <div className="text-center mt-3">
                <p>Don’t have an account yet? <Link to="/register">Click here</Link> to register.</p>
              </div>
            </Form>
			</div>
			
			</Container>
		
		</>
        :
    <Navigate to='/' />
  );
}
