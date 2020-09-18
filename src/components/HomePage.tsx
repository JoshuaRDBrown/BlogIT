import React, { useState } from 'react';
import FirstLoginForm from './FirstLoginForm';
import timeFormatter from '../services/timeFormatter';
import { Link } from 'react-router-dom';
import { Posts } from '../models/Posts';

interface IProps {
  isFirstLogin: boolean,
  updateInitialInformation: ((username: string, profilePictureURL: string, userProfileBio: string) => void),
  posts: Posts[],
  creatingNewPost: boolean,
  createNewPost: ((title: string, body: string) => void),
  genericProfilePicture: string,
}

const HomePage: React.SFC<IProps> = (props) => {

  const [title, setPostTitle] = useState('');
  const [body, setPostBody] = useState('');

  document.title = 'Home'

  return(
    <div className='homepage-container'>
      {props.isFirstLogin &&
        <FirstLoginForm updateInitialInformation={props.updateInitialInformation} genericProfilePicture={props.genericProfilePicture} />
      }
      {props.creatingNewPost &&
        <>
          <div className='overlay'></div>
          <div className='new-post-form'>
            <span>Create new post</span>
            <input
              placeholder='Post title'
              onChange={e => setPostTitle(e.target.value)}
            />
            <textarea
              placeholder='Speak your mind...'
              onChange={e => setPostBody(e.target.value)}
            />
            <button onClick={()=> props.createNewPost(title, body)}>Post</button>
          </div>
        </>
      }
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
        props.posts.map((post) => {
          return(
            <Link key={post.content.id} to={`/posts/${post.content.id}`}>
              <div className='content-item post'>
                <div className='information-section'>
                  <Link to={`/user/${post.content.userId}`}>
                    <img alt='profile' src={post.content.photoURL}/>
                    <span>{post.content.author}</span>
                  </Link>
                  <div className='stats'>
                    <span>{timeFormatter(post.content.time)}</span>
                    <span><b>Likes:</b> {post.likes || 0}</span>
                    <span><b>Dislikes:</b> {post.dislikes || 0}</span>
                    <span><b>Comments:</b> {post.comments ? `${post.comments.length}` : '0'}</span>
                  </div>
                </div>
                <span id='title'>{post.content.title}</span>
                <div className='content'>
                  <span>{post.content.body}</span>
                </div>
              </div>
            </Link>
          )
        }):
        <h1>No posts</h1>
      }
      </div>
    </div>
  )
}

export default HomePage;
