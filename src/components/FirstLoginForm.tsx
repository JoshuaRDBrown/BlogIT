import React, { useState } from 'react';

interface IProps {
	updateInitialInformation: ((username: string, photoUrl: string, userProfileDesc: string) => void);
	genericProfilePicture: string,
}

const FirstLoginForm: React.SFC<IProps> = (props) => {

	const [username, setUsername] = useState('');
	const [profilePictureURL, setUrl] = useState('');
	const [userProfileDesc, setUserProfileDesc] = useState('');

	return(
		<>
			<div className='overlay'></div>
			<div className='first-time-form'>
				<h1>Introduce yourself</h1>
				<img alt='generic-profile' src={props.genericProfilePicture}/>
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
				<input 
					placeholder='Write a short bio...' 
					value={userProfileDesc}
					onChange={e => setUserProfileDesc(e.target.value)}
				/>
				<button onClick={()=> props.updateInitialInformation(username, profilePictureURL, userProfileDesc)}>Update information</button>
			</div>
		</>
	)
}
export default FirstLoginForm;
