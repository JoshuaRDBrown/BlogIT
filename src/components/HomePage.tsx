import React from 'react';
import FirstLoginForm from './FirstLoginForm';
import fb from '../config/fireBase';
interface IProps {
  isFirstLogin: boolean,
  updateInitialInformation: ((username: string, profilePictureURL: string) => void)
}

const HomePage: React.SFC<IProps> = (props) => {
  return(
    <div className='homepage-container'>
      {props.isFirstLogin &&
        <FirstLoginForm updateInitialInformation={props.updateInitialInformation} />
      }
      <div className='content-container'>
        <div className='content-item'>
          <img alt='profile' src={fb.auth().currentUser?.photoURL!} />
          <textarea wrap="off" cols={10} rows={10} placeholder='Write a quick update here...'/>
          <button>
            <img alt='post-icon' src='https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-arrow-24.png' />
          </button>
        </div>
      </div>

    </div>
    

  )
}

export default HomePage;