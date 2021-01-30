import React, { useState } from 'react';
import FirstLoginForm from './FirstLoginForm';
import { Posts } from '../models/Posts';
import getAndSetLocalStorage from '../services/getAndSetLocalStorage';
import RecentlyViewed from './RecentlyViewed';
import Post from './Post';
import UserInformation from '../models/UserInformation';
import PostFilters from './PostFilters';

interface IProps {
  isFirstLogin: boolean,
  updateInitialInformation: ((userObj: UserInformation) => void),
  posts: Posts[],
  genericProfilePicture: string,
  isSearching: boolean,
  showPostCreationMessage: boolean,
}

const HomePage: React.SFC<IProps> = (props) => {

  const [sortedPosts, setSortedPosts] = useState<Posts[]>([]);
  const [isSorting, setIsSorting] = useState(false);

  let recentlyViewed = getAndSetLocalStorage('get', 'recentlyViewedPosts')
  if(recentlyViewed.length >= 3) {
    recentlyViewed.reverse()
    recentlyViewed = [recentlyViewed[0], recentlyViewed[1], recentlyViewed[2]]
    window.localStorage.setItem('recentlyViewedPosts', JSON.stringify(recentlyViewed))
  }

  const filterPosts = (filterBy: string) => {

    let sortedPosts: Posts[] = []

    setIsSorting(true)

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

    setSortedPosts(sortedPosts)
  }

  document.title = 'Home'

  return(
    <div className='homepage-container'>
      {props.isFirstLogin &&
        <FirstLoginForm updateInitialInformation={props.updateInitialInformation} genericProfilePicture={props.genericProfilePicture} />
      }
      <div className='left-container'>
        <RecentlyViewed posts={recentlyViewed} />
        <PostFilters filterPosts={filterPosts} />
      </div>

      <div className='content-container'>

        {props.showPostCreationMessage &&
          <div className="post-creation-confirmation">
            <img alt="post created" src={process.env.PUBLIC_URL + '/assets/postConfirmationTick.svg'} />
            <span>Post successfully created.</span>
          </div>
        }
        
        {props.posts.length !== 0 ? 
          <Post postData={isSorting ? sortedPosts : props.posts} boxSize="50"/> : props.isSearching ? <h1 id="no-results">No results matched your search.</h1> : <h1>No posts</h1>
        }
      </div>
    </div>
  )
}

export default HomePage;
