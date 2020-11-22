import React from 'react';
import { Link } from 'react-router-dom';
import { Posts } from '../models/Posts';
import timeFormatter from '../services/timeFormatter';

interface Props {
  postData: Posts[]
}

const Post: React.SFC<Props> = (props) => {

  return(
    <>
      {props.postData.map((post) => {
        return(
          <Link id='post-box' key={post.content.id} to={`/posts/${post.content.id}`}>
            <div className='content-item post'>
              <div className='information-section'>
                <Link to={`/user/${post.content.userId}`}>
                  <img alt='profile' src={post.content.photoURL}/>
                  <span id='author'>{post.content.author}</span>
                </Link>
                <div className='stats'>
                  <span>{timeFormatter(post.content.time)}</span>
                  <span><b>Likes:</b> {post.likes ? post.likes.length : '0'}</span>
                  <span><b>Dislikes:</b> {post.dislikes ? post.dislikes.length : '0'}</span>
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
      })}
    </>
  )
}

export default Post; 