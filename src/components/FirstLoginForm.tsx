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

	const [formHasError, setFormHasError] = useState(false);

	const formFields = [
		{name: "displayName", placeholder: "Username", value: userInfoObject.displayName},
		{name: "photoURL", placeholder: "Enter a URL for your profile picture...", value: userInfoObject.photoURL},
		{name: "description", placeholder: "Profile Description", value: userInfoObject.description},
		{name: "location", placeholder: "Location", value: userInfoObject.location},
		{name: "occupation", placeholder: "Occupation", value: userInfoObject.occupation},
	]

	const validateInput = () => {
		if(userInfoObject.displayName !== "" && userInfoObject.description !== "" && userInfoObject.location !== "" && userInfoObject.occupation !== "") {
			props.updateInitialInformation(userInfoObject)
		} else {
			setFormHasError(true)
		}
	}

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
							style={{border: field.value === "" && formHasError ? "2px solid red" : "2px solid #dcdcdc"}} 
							value={field.value}
							onChange={(e)=> {e.persist(); setUserInfoObject((prevState) => ({
								...prevState,
								[field.name]: e.target.value
							}))}}
						/>
					)
				})}
				{formHasError &&
					<p>Please fill in all the fields.</p>
				}
				<button onClick={validateInput}>Submit</button>
			</div>
		</>
	)
}
export default FirstLoginForm;
