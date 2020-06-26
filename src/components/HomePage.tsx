import React, { useState } from 'react';
import FirstLoginForm from './FirstLoginForm';
import timeFormatter from '../services/timeFormatter';
import { Link } from 'react-router-dom';

interface IProps {
  isFirstLogin: boolean,
  updateInitialInformation: ((username: string, profilePictureURL: string) => void),
  posts: Array<{ content: { id: number, title: string, body: string, author: string, photoURL: string, time: number, likes: number, dislikes: number, comments: number } }>,
  creatingNewPost: boolean,
  createNewPost: ((title: string, body: string) => void),
}

const HomePage: React.SFC<IProps> = (props) => {

  const [title, setPostTitle] = useState('');
  const [body, setPostBody] = useState('');

  document.title = 'Home'

  return(
    <div className='homepage-container'>
      {props.isFirstLogin &&
        <FirstLoginForm updateInitialInformation={props.updateInitialInformation} />
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
            <Link to={`/posts/${post.content.id}`}>
              <div key={post.content.id} className='content-item post'>
                <div className='information-section'>
                  <img alt='profile' src={post.content.photoURL}/>
                  <span>{post.content.author}</span>
                  <div className='stats'>
                    <span>{timeFormatter(post.content.time)}</span>
                    <span><b>Likes:</b> {post.content.likes}</span>
                    <span><b>Dislikes:</b> {post.content.dislikes}</span>
                    <span><b>Comments:</b> {post.content.comments}</span>
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
