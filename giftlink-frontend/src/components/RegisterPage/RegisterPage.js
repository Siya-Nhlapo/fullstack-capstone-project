import React, { useState } from 'react';
import './RegisterPage.css';
// Task 1: Import urlConfig from `giftlink-frontend/src/config.js`
import { urlConfig } from '../../config';
// Task 2: Import useAppContext `giftlink-frontend/context/AuthContext.js`
import { useAppContext } from '../../context/AuthContext';
// Task 3: Import useNavigate from `react-router-dom` to handle navigation after successful registration.
import { useNavigate } from 'react-router-dom';

/** Do these tasks inside the RegisterPage function, after the useStates definition
 * Task 4: Include a state for error message.
 * Task 5: Create a local variable for `navigate` and `setIsLoggedIn`.
 */
function RegisterPage() {
    // insert code here to create useState hook variables for firstName, lastName, email, password
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Step 1 - Task 4
    const [showerr, setShowerr] = useState('');
    // Step 1 - Task 5
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // insert code here to create handleRegister function and include console.log
    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                // Step 1 - Task 6: Set method
                method: 'POST',
                // Step 1 - Task 7: Set headers
                headers: {
                    'content-type': 'application/json',
                },
                // Step 1 - Task 8: Set body to send user details
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            // Step 2 - Task 1: Access data coming from fetch API
            const json = await response.json();

            // Step 2 - Task 2: Set user details
            if (response.ok && json.authToken) {
                sessionStorage.setItem('auth-token', json.authToken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                // Step 2 - Task 3: insert code for setting logged in state
                setIsLoggedIn(true);
                // Step 2 - Task 4: insert code for navigating to MainPage
                navigate('/app');
            } else {
                // Step 2 - Task 5: Set an error message if the registration fails.
                setShowerr(json.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            // Step 2 - Task 6: Display error message to enduser.
            setShowerr(`Unable to contact the server: ${error.message}`);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="register-card p-4 border rounded">
                    <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                    {/* insert code here to create input elements for all the variables - firstName, lastName, email, password */}
                    <div className="mb-4">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            /* DYNAMIC CLASS AT THE END: Adds 'has-text' if firstName is not empty */
                            className={`form-control ${firstName ? 'has-text' : ''}`}
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                        />
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            /* DYNAMIC CLASS AT THE END: Adds 'has-text' if lastName is not empty */
                            className={`form-control ${lastName ? 'has-text' : ''}`}
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                        />
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            /* DYNAMIC CLASS AT THE END: Adds 'has-text' if email is not empty */
                            className={`form-control ${email ? 'has-text' : ''}`}
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            /* DYNAMIC CLASS AT THE END: Adds 'has-text' if password is not empty */
                            className={`form-control ${password ? 'has-text' : ''}`}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    {/* insert code here to create a button that performs the `handleRegister` function on click */}
                    <button className="btn btn-primary w-100 mv-3" onClick={handleRegister}>Register</button>
                    <div className="text-danger">{showerr}</div>
                    <p className="mt-4 text-center">
                        Already a member? <a href="/app/login" className="text-primary">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
