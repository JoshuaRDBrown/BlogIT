import React, { useState } from 'react';
import FirstLoginForm from './FirstLoginForm';
import fb from '../config/fireBase';
import timeFormatter from '../services/timeFormatter';

interface IProps {
  isFirstLogin: boolean,
  updateInitialInformation: ((username: string, profilePictureURL: string) => void),
  posts: Array<{ content: { id: number, title: string, body: string, author: string, photoURL: string, time: number } }>,
  creatingNewPost: boolean,
  createNewPost: ((title: string, body: string) => void),
}

const HomePage: React.SFC<IProps> = (props) => {

  const [title, setPostTitle] = useState('');
  const [body, setPostBody] = useState('');

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
          <img alt='profile' src={fb.auth().currentUser?.photoURL!} />
          <textarea wrap="off" cols={10} rows={10} placeholder='Write a quick update here...'/>
          <button>
            <img alt='post-icon' src='https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-arrow-24.png' />
          </button>
        </div><br/>
        {props.posts && props.posts.length !== 0 ?
        props.posts.map((post) => {
          return(
            <div key={post.content.id} className='content-item post'>
              <div className='user-information-section'>
                <img alt='profile' src={post.content.photoURL}/>
                <span>{post.content.author}</span>
                <span>{timeFormatter(post.content.time)}</span>
              </div>
              <span id='title'>{post.content.title}</span>
              <span id='text-content'>{post.content.body}</span>
            </div>
          )
        }):
        <h1>No posts</h1>
      }
      </div>
    </div>
  )
}

export default HomePage;
