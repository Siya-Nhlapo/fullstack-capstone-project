import Eeact, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage() {
    // insert code here to create useState hook variables for firstName, lastName, email, password
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // insert code here to create handleRegister function and include console.log
    const handleRegister = async () => {
        console.log("Register invoked")
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="register-card p-4 border rounded">
                    <h2 className="text-center mb-4 font-weight-bold"> Register </h2>

                    {/** insert code here to create input elements for all the variables - firstName, lastName, email, password */}
                    <div className="mb-4">
                        <label htmlFor="firstName" className="form label"> First Name</label><br></br>
                        <input
                            id="firstName"
                            type="text"
                            /* DYNAMIC CLASS AT THE END: Adds 'has-text' if firstName is not empty */
                            className={ `form-control ${firstName ? 'has-text' : ''}` }
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label htmlFor="lastName" className="form label"> first Name</label><br></br>
                        <input
                            id="lastName"
                            type="text"
                            /* DYNAMIC CLASS AT THE END: Adds 'has-text' if lastName is not empty */
                            className={ `form-control ${lastName ? 'has-text' : ''}` }
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label htmlFor="lastName" className="form label"> Email </label><br></br>
                        <input
                            id="email"
                            type="text"
                            /* DYNAMIC CLASS AT THE END: Adds 'has-text' if email is not empty */
                            className={ `form-control ${email ? 'has-text' : ''}` }
                            placeholder="Enter your email address"
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
                    {/** insert code here to create a button that performs the `handleRegister` function on click */}
                    <button className="btn btn-primary w-100 mv-3" onClick={handleRegister}>Register</button>

                    <p className="mt-4 text-center">
                        Already a member? <a href="/app/login" className="text-primary"> Login </a>
                    </p>
                </div>
            </div>
        </div>
    ) // end of return
}

export default RegisterPage;
