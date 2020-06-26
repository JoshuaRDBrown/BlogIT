import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import fb from '../config/fireBase';
import timeFormatter from '../services/timeFormatter';

interface PostParams {
  id: string,
}

function Post(props: RouteComponentProps<PostParams>) {

  const [data, setPostData] = useState({ title: '', body: '', author: '', time: 0, photoURL: '', likes: 0, dislikes: 0, comments: 0 })

  const db = fb.firestore();
  const ref = db.doc(`posts/${props.match.params.id}`)
  ref.get().then((doc: any) => {
    if(doc.exists) {
      setPostData(doc.data().content);
    }
  })

  return (
    <div className='post-container'>
      <div className='post-box'>
        <span id='title'>{data.title}</span>
        <span id='body'>{data.body}</span>
        <div className='postFooter'>
          <img src={data.photoURL} />
          <a href='#'>{data.author}</a>
          <span>{timeFormatter(data.time)}</span>
        </div>
        <div className='postStats'>
          <span>Likes: {data.likes}</span>
          <span>Dislikes: {data.dislikes}</span>
          <span>Likes: {data.comments}</span>
        </div>
      </div>
      <div className='post-box'>
        <div className='comment-section'>
          <img src={data.photoURL} />
          <textarea placeholder='Comment on this post...' />
          <button>Post</button>
        </div>
      </div>
    </div>
  )
}


export default Post;
