import React, { useState } from 'react';
import UserInformation from '../models/UserInformation';
interface IProps {
	updateInitialInformation: ((userObj: UserInformation) => void);
	genericProfilePicture: string,
}

const FirstLoginForm: React.SFC<IProps> = (props) => {
	const [userInfoObject, setUserInfoObject] = useState<UserInformation>({
		displayName: "",
		photoURL: "",
		description: "",
		isOnline: false,
		location: "",
		occupation: ""
	})

	const formFields = [
		{name: "displayName", placeholder: "Username", value: userInfoObject.displayName},
		{name: "photoURL", placeholder: "Enter a URL for your profile picture...", value: userInfoObject.photoURL},
		{name: "description", placeholder: "Profile Description", value: userInfoObject.description},
		{name: "location", placeholder: "Location", value: userInfoObject.location},
		{name: "occupation", placeholder: "Occupation", value: userInfoObject.occupation},
	]

	return(
		<>
			<div className='overlay'></div>
			<div className='first-time-form'>
				<h1>Introduce yourself</h1>
				<img alt='generic-profile' src={props.genericProfilePicture}/>
				{formFields.map((field)=> {
					return(
						<input 
							key={field.name}
							placeholder={field.placeholder} 
							value={field.value}
							onChange={(e)=> {e.persist(); setUserInfoObject((prevState) => ({
								...prevState,
								[field.name]: e.target.value
							}))}}
						/>
					)
				})}
				
				<button onClick={()=> props.updateInitialInformation(userInfoObject)}>Update information</button>
			</div>
		</>
	)
}
export default FirstLoginForm;
