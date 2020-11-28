import React, { useState } from 'react';
import FirstLoginForm from './FirstLoginForm';
import { Posts } from '../models/Posts';
import getAndSetLocalStorage from '../services/getAndSetLocalStorage';
import RecentlyViewed from './RecentlyViewed';
import Post from './Post';
import PostCreationForm from './PostCreationForm';
import { FormTypes } from '../enums/FormTypes';
import UserInformation from '../models/UserInformation';

interface IProps {
  isFirstLogin: boolean,
  updateInitialInformation: ((userObj: UserInformation) => void),
  posts: Posts[],
  creatingNewPost: boolean,
  createNewPost: ((title: string, body: string) => void),
  genericProfilePicture: string,
}

const HomePage: React.SFC<IProps> = (props) => {

  const [title, setPostTitle] = useState('');
  const [body, setPostBody] = useState('');

  const passCreateNewPost = (title: string, body: string) => {
    props.createNewPost(title, body)
  }

  let recentlyViewed = getAndSetLocalStorage('get', 'recentlyViewedPosts')
  if(recentlyViewed.length >= 3) {
    recentlyViewed.reverse()
    recentlyViewed = [recentlyViewed[0], recentlyViewed[1], recentlyViewed[2]]
    window.localStorage.setItem('recentlyViewedPosts', JSON.stringify(recentlyViewed))
  }

  document.title = 'Home'

  return(
    <div className='homepage-container'>
      {props.isFirstLogin &&
        <FirstLoginForm updateInitialInformation={props.updateInitialInformation} genericProfilePicture={props.genericProfilePicture} />
      }
      {props.creatingNewPost &&
        <PostCreationForm formTitle="Create new post" formType={FormTypes.create} createNewPost={passCreateNewPost} />
      }

      <div className='left-container'>
        <RecentlyViewed posts={recentlyViewed} />
      </div>

      <div className='content-container'>
        <div className='content-item'>
          <span>Filter:</span>
          <select>
            <option value="volvo">Popular</option>
            <option value="saab">Newest</option>
            <option value="opel">Official</option>
            <option value="audi">Admin</option>
          </select>
          <input placeholder='Search posts' />

          </div><br/>
        {props.posts && props.posts.length !== 0 ?
          <Post postData={props.posts}/> : <h1>No posts</h1>
        }
      </div>
    </div>
  )
}

export default HomePage;
