import React, { useState } from 'react';

interface SubmitObj {
	email: string,
	password: string,
	repeatedPassword: string,
}

interface IProps {
	authUser: ((authType: string, userInput: {email: string, password: string, repeatedPassword: string}) => void) 
}

const Login: React.SFC<IProps> = (props) => {

	const [formType, setFormType] = useState('LOGIN');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatedPassword] = useState('');
	//TODO - add form validation
	const [formHasError, setFormHasError] = useState(false);

	const userInput: SubmitObj = {
		email: email,
		password: password,
		repeatedPassword: repeatPassword,
	}

  return(
  	<div className='login-container'>
			<div className='login-container_header'>
				<span>BlogIT</span>
			</div>
			<div className='login-container_content'>
				<div className="login-form">
					<h1>{formType === "LOGIN" ? "Login" : "Sign up"}</h1>
					<input placeholder="Email Address" onChange={e => setEmail(e.target.value)}/><br/>
					<input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} /><br/>
					{formType === "SIGN_UP" &&
						<>
							<input placeholder="Repeat Password" onChange={e => setRepeatedPassword(e.target.value)} type="password" /><br/>
						</>
					}
					{formType !== "SIGN_UP" &&
						<>
							<p id='forgot-password'>Forgot password?</p><br/>
						</>
					}
					<button onClick={()=> props.authUser(formType, userInput)}>Login</button>
						{formType === "LOGIN" ?
							<p id='create-account' onClick={()=> setFormType("SIGN_UP")}>
								Don't have an account? Click here to create one.
							</p> : 
							<p id='create-account' onClick={()=> setFormType("LOGIN")}>
								Already have an account? Click here to login.
							</p>
						}
				</div>
			</div>
    </div>
  )
}

export default Login;
