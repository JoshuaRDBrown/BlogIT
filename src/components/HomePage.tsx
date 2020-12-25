import React, { useState } from 'react';
import FirstLoginForm from './FirstLoginForm';
import { Posts } from '../models/Posts';
import getAndSetLocalStorage from '../services/getAndSetLocalStorage';
import RecentlyViewed from './RecentlyViewed';
import Post from './Post';
import PostCreationForm from './PostCreationForm';
import { FormTypes } from '../enums/FormTypes';
import UserInformation from '../models/UserInformation';
import PostFilters from './PostFilters';

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
  const [closePostCreation, setClosePostCreation] = useState(false);
  const [posts, setPosts] = useState<Posts[]>([])

  const passCreateNewPost = (title: string, body: string) => {
    props.createNewPost(title, body)
  }

  let recentlyViewed = getAndSetLocalStorage('get', 'recentlyViewedPosts')
  if(recentlyViewed.length >= 3) {
    recentlyViewed.reverse()
    recentlyViewed = [recentlyViewed[0], recentlyViewed[1], recentlyViewed[2]]
    window.localStorage.setItem('recentlyViewedPosts', JSON.stringify(recentlyViewed))
  }

  const filterPosts = (filterBy: string) => {

    let sortedPosts: Posts[] = []

    console.log(filterBy)

    switch (filterBy) {
      case "popular": 
        //@ts-ignore
        sortedPosts = props.posts.sort((a, b) =>  {
          let aLikes = a.likes ? a.likes.length : 0
          let bLikes = b.likes ? b.likes.length : 0

          return bLikes - aLikes
        });

        break;

      case "newest":
        sortedPosts = props.posts.sort((a, b) => {
          return b.content.time - a.content.time;
        })
        break;
    }

    console.log(sortedPosts)

    setPosts(sortedPosts)
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
        <PostFilters filterPosts={filterPosts} />
      </div>

      <div className='content-container'>
        {posts.length !== 0 ? 
          <Post postData={posts} boxSize="50"/> : <Post postData={props.posts} boxSize="50"/>
      
      }


        {/* {props.posts && props.posts.length !== 0 ?
          <Post postData={props.posts} boxSize="50"/> : <p>There are currently no posts to show.</p>
        } */}
      </div>
    </div>
  )
}

export default HomePage;
