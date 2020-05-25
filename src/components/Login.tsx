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

	const userInput: SubmitObj = {
		email: email,
		password: password,
		repeatedPassword: repeatPassword,
	}

  return(
  	<div className='login-container'>
			<div className='login-container_header'>
				<span>BlogIT</span>
				<div className='login-container_header-buttons-container'>
					<button onClick={()=> setFormType('LOGIN')}>Login</button>
					<button onClick={()=> setFormType('SIGN_UP')}>Sign up</button>
				</div>
			</div>
			<div className='login-container_content'>
				<div className='login-form'>
					<form>
						<h1>{formType === 'LOGIN' ? 'Login' : 'Sign up'}</h1>
						<hr/>
						<input 
							placeholder='Email address'
							onChange={e => setEmail(e.target.value)}
						/><br/>
						<input
							placeholder='Password'
							type='password'
							onChange={e => setPassword(e.target.value)}
						/><br/>
						{formType === 'SIGN_UP' ?
							<>
								<input
									placeholder='Repeat password'
									type='password'
									onChange={e => setRepeatedPassword(e.target.value)}
								/><br/> 
							</> :
							<p>Forgot password?</p>
						}
						<button type='button' onClick={()=> props.authUser(formType, userInput)}>{formType === 'LOGIN' ? 'Login' : 'Sign up'}</button>
					</form>
				</div>
			</div>
    </div>
  )
}

export default Login;