import React from 'react';
import dateFormatter from '../services/dateFormatter';

interface IProps {
  user: any
}

const UserProfile: React.SFC<IProps> = (props) => {

  let dates = dateFormatter(props.user.metadata.creationTime, props.user.metadata.lastSignInTime);
  const [creationDate, lastSignIn] = dates;

  document.title = `${props.user.displayName}'s profile`;
  return(
    <>
      <div className='profileBanner'>
        <img alt='profile' src={props.user.photoURL}/>
        <h1>{props.user.displayName}</h1>
        <p>{props.user.profileDesc || 'Hello World!'}</p>
      </div>
      <div className='achievements-list'>
        <h1>Achievements:</h1>
        <p>This user currently has no achievements.</p>
      </div>
      <div className='more-information'>
        <h1>About</h1>
        <p>Date joined: {creationDate}</p>
        <p>Status: {false ? 'Online' : `Offline: ${lastSignIn}`}</p>
      </div>
    </>
  )
}

export default UserProfile;