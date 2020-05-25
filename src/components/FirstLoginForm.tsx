import React, { useState } from 'react';
import fb from '../config/fireBase';

interface IProps {
	updateInitialInformation: ((username: string, photoUrl: string) => void);
}

const FirstLoginForm: React.SFC<IProps> = (props) => {

	const [username, setUsername] = useState('');
	const [profilePictureURL, setUrl] = useState('')

	return(
		<>
			<div className='overlay'></div>
			<div className='first-time-form'>
				<h1>Introduce yourself</h1>
				<img alt='generic-profile' src={fb.auth().currentUser?.photoURL!}/>
				<input 
					placeholder='Enter a url for your profile picture...' 
					value={profilePictureURL}
					onChange={e => setUrl(e.target.value)}
				/>
				<input 
					placeholder='Pick a username...' 
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
				<button onClick={()=> props.updateInitialInformation(username, profilePictureURL)}>Update information</button>
			</div>
		</>
	)
}

export default FirstLoginForm;