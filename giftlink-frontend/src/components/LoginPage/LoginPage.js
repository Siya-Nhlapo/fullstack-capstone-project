import React, { useState } from 'react';
import './LoginPage.css';
// Step 1 - Task 1: Import urlConfig from 'giftlink-frontend/src/config.js'
import {urlConfig} from '../../../src/config';
// Step 1 - Task 2: Import useAppContext from 'giftlink-frontend/context/AuthContext.js'
import { useAppContext } from '../../context/AuthContext';
// Step 1 - Task 3: Import useNavigate from 'react-router-dom'
import {useNavigate} from 'react-router-dom';

function LoginPage() {

    //insert code here to create useState hook variables for email, password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Step 1 - Task 4: Include a state for incorrect password.
    const [incorrect, setIncorrect] = useState('');
    // Step 1 - Task 5: Create a local variable for 'navigate', 'bearerToken' and 'setIsLoggedIn'
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    // Step 1 - Task 6: If the bearerToken has a value (user already logged in), navigate to MainPage
    useEffect(() => {
      if (sessionStorage.getItem('auth-token')) {
        navigate('/app')
      }
    }, [navigate])

    /**PRO TIP 
     * To handle this login via a native HTML <form> element's onSubmit event,
     * you MUST accept the event object parameter (e) and call e.preventDefault().
     * Without it, the browser will automatically refresh the page upon submission,
     * which instantly cancels your asynchronous API requests mid-flight.
     * 
     * Explicit Form Implementation Example:
     * const handleLogin = async (e) => {
     *     e.preventDefault(); // Prevents page reload
     *     // code continues...
     * };
    */

    // insert code here to create handleLogin function and include console.log
    const handleLogin = async () => {
        try {
          const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            // Step 1 - Task 7: Set method
            method: 'POST',
            // Step 1 - Task 8: Set headers
            headers: {
              'content-type': 'application/json',
              'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Include Bearer token if available
            },
            // Step 1 - Task 9: Set the body section to send user details
            body: JSON.stringify({
              emai: email,
              password: password
            })
          });
          // Step 2 - Task 1: Access data coming from fetch API
          const json = await response.json();
          // Step 2 - Task 2: Set user details
          if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);
            // Step 2 - Task 3: Set the user's state to login using the 'useAppContext'.
            setIsLoggedIn(true);
            // Step 2 - Task 4: Navigate to the MainPage after logging in.
            navigate('/app');
          } else { // Step 2 - Task 5: Clear input and set an error message if the password is incorrect.
              document.getElementById("email").value="";
              document.getElementById("password").value="";
              setIncorrect("Wrong password. Try again.");
              // Clear out error message after 4 seconds
              setTimeout(() => {
                setIncorrect("");
              }, 4000);
          }
          // Step 2 - Task 6: Display an error message to the user.
          <span style={ { color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px' } }>{incorrect}</span>
        }
        catch (e) {
          console.log("Error fetching details: " + e.message);
        }
    }
        
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>

          {/* insert code here to create input elements for the variables email and  password */}
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
                id="email"
                type="text"
                /* DYNAMIC CLASS AT THE END: Adds 'has-text' if email is not empty */
                className={ `form-control ${email ? 'has-text' : ''}` }
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="lastName" className="form label"> Password</label><br></br>
              <input
                  id="password"
                  type="text"
                  /* DYNAMIC CLASS AT THE END: Adds 'has-text' if password is not empty */
                  className={ `form-control ${password ? 'has-text' : ''}` }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
        </div>
          {/* insert code here to create a button that performs the `handleLogin` function on click */}
                <p className="mt-4 text-center">
                    New here? <a href="/app/register" className="text-primary">Register Here</a>
                </p>
                <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default LoginPage;
