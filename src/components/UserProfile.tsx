import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import dateFormatter from '../services/dateFormatter';
import fb from '../config/fireBase';
import { Posts } from '../models/Posts';
import Post from './Post';
import { Link } from 'react-router-dom';

interface RouteProps {
  id: string
}
interface UserProfile {
  displayName: string,
  description: string,
  dateCreated: string,
  isOnline: boolean,
  photoURL: string,
  location: string,
  occupation: string
}

function UserProfile(props: RouteComponentProps<RouteProps>) {

  const [profileData, setProfileData] = useState<UserProfile>({ displayName: '', description: '', dateCreated: '', isOnline: false, photoURL: '', location: '', occupation: ''});
  const [userPosts, setUserPosts] = useState<Posts[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Posts[]>([])

  useEffect(() => {
    const db = fb.firestore();
    const profileRef = db.doc(`profiles/${props.match.params.id}`)
    profileRef.get().then((doc: any) => {
      if(doc.exists) {
        setProfileData(doc.data());
      }
    });

    db.collection('posts').where('content.userId', '==', props.match.params.id).get()
    .then((snapshot)=> {
      snapshot.forEach((doc) => {
        setUserPosts((existingPosts: any) => [...existingPosts, doc.data()])
        setFilteredPosts((existingPosts: any) => [...existingPosts, doc.data()])
      })
    })
    .catch((err)=> {
      console.log(err)
    })
  }, [setProfileData, setUserPosts])

  const searchPosts = (input: string) => {
    console.log(filteredPosts)

    if(input !== '') {
      const filteredPosts = userPosts.filter((post)=> {
        return post.content.title.includes(input)
      })
      setFilteredPosts(filteredPosts) 
    } else {
      setFilteredPosts(userPosts)
    }
  }

  const sortPostsBy = (selection: string) => {

    let sortedPosts = userPosts

    switch(selection) {
      case 'Newest': 
        sortedPosts = userPosts.sort((a, b) => a.content.time.toString().localeCompare(b.content.time.toString()));

      case 'Oldest':
        sortedPosts = userPosts.sort((a, b) => b.content.time.toString().localeCompare(a.content.time.toString()));
      
      case 'Popular':
        sortedPosts = userPosts.sort((a, b) => a.likes.length.toString().localeCompare(b.likes.length.toString()));
    }

   setFilteredPosts(sortedPosts)

  }

  document.title = `${profileData?.displayName}'s profile`;
  return(
    <>
      {/* TODO: make post component and reuse to display posts here  */}
      <div className='profile-view'>
        <div className='profile-banner'>
          <img id='profile' src={profileData.photoURL}/>
          <span id='username'>{profileData.displayName}</span>
          <span id='desc'>{profileData.description}</span>
        </div>
        <div className='info-box'>
          <span id='information-title'>Basic Information</span><br/>
          <div className='info-item'>
            <img title='Date joined' src={process.env.PUBLIC_URL + "/assets/calendar.png"}/>
            <span>{profileData.dateCreated}</span>
          </div>
          {/* <div className='info-item'>
            <span>Status:</span>
            <span className={profileData.isOnline ? 'online' : 'offline'}>{profileData.isOnline ? 'Online' : 'Offline'}</span>
          </div> */}
          <div className='info-item'>
            <img title='Location' src={process.env.PUBLIC_URL + "/assets/location.png"}/>
            <span>{profileData.location}</span>
          </div>
          <div className='info-item'>
            <img title='Occupation' src={process.env.PUBLIC_URL + "/assets/occupation.png"}/>
            <span>{profileData.occupation}</span>
          </div>
        </div>
        <div className='posts-action-bar'>
          <p>Posts: <b id='post-amount'>{userPosts.length}</b></p>
          <input placeholder='Search posts...' onChange={e => searchPosts(e.target.value)}/>
          <select onChange={e => sortPostsBy(e.target.value)}>
            <option>Newest</option>
            <option>Oldest</option>
            <option>Popular</option>
          </select>
        </div>
        <div className='user-post-view'>
          {/* <Post postData={filteredPosts}/> */}
        </div>
      </div>
    </>
  )
}

export default UserProfile;