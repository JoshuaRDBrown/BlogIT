import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import dateFormatter from '../services/dateFormatter';
import fb from '../config/fireBase';

interface IProps {
  id: string
}

interface UserProfile {
  displayName: string,
  description: string,
  dateCreated: string,
  isOnline: boolean,
  photoURL: string,
}

function UserProfile(props: RouteComponentProps<IProps>) {

  //let dates = dateFormatter(props.user.metadata.creationTime, props.user.metadata.lastSignInTime);
  //const [creationDate, lastSignIn] = dates;
  const [profileData, setProfileData] = useState<UserProfile>({ displayName: '', description: '', dateCreated: '', isOnline: false, photoURL: '', });

  const db = fb.firestore();
  const ref = db.doc(`profiles/${props.match.params.id}`)
  ref.get().then((doc: any) => {
    if(doc.exists) {
      setProfileData(doc.data());
    }
  });

  document.title = `${profileData?.displayName}'s profile`;
  return(
    <>
      <div className='profileBanner'>
        <img alt='profile' src={profileData.photoURL}/>
        <h1>{profileData.displayName}</h1>
        <p>{profileData.description || 'Hello World!'}</p>
      </div>
      <div className='achievements-list'>
        <h1>Achievements:</h1>
        <p>This user currently has no achievements.</p>
      </div>
      <div className='more-information'>
        <h1>About</h1>
        <p>Date joined: {profileData.dateCreated}</p>
        <p>Status: {profileData.isOnline ? 'Online' : 'Offline'}</p>
      </div>
    </>
  )
}

export default UserProfile;