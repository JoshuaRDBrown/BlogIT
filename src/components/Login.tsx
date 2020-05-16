import React from 'react';

const Login: React.FC = () => {
  return(
    <div className='login-container'>
      <div className='login-container_header'>
	<span>BlogIT</span>
	<input 
	  placeholder='FAQs...'
	/>
	<div className='login-container_header-buttons-container'>
	  <button>Login</button>
	  <button>Sign up</button>
	</div>
      </div>
    </div>
  )

}

export default Login;
