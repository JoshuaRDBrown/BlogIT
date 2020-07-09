import React, { useState, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import fb from '../config/fireBase';
import timeFormatter from '../services/timeFormatter';
import submitComment from '../services/submitComment';
import Comment from '../models/Comment';

interface PostParams {
  id: string,
}

function Post(props: RouteComponentProps<PostParams>) {

  const [postData, setPostData] = useState({ title: '', body: '', author: '', time: 0, photoURL: '', likes: 0, dislikes: 0});
  const [existingComments, setExistingComments] = useState<any>([])
  const [commentContent, setCommentContent] = useState('');
  const isMounted = useRef(false);

  useEffect(():any => {
    isMounted.current = true;
    const db = fb.firestore();
    const ref = db.doc(`posts/${props.match.params.id}`)
    ref.get().then((doc: any) => {
      if(doc.exists && isMounted.current) {
        setPostData(doc.data().content);
        setExistingComments(doc.data().comments ? doc.data().comments : [])
      }
    });
    return ()=> isMounted.current = false; //make sure memory doesn't leak by only fetching data if component is mounted
  }, [setPostData, setExistingComments, props.match.params.id]);

  const onPostClick = () => {
    const updateComments = submitComment(existingComments, commentContent, props.match.params.id);
    setExistingComments(updateComments);
  }

  return (
    <div className='post-container'>
      <div className='post-box'>
        <span id='title'>{postData.title}</span>
        <span id='body'>{postData.body}</span>
        <div className='postFooter'>
          <div className='user-info'>
            <img alt='profile' src={postData.photoURL} />
            <a href='#'>{postData.author}</a>
          </div>
          <div className='time-created'>
            <span>{timeFormatter(postData.time)}</span>
          </div>
        </div>
        <div className='postStats'>
          <span>Likes: {postData.likes}</span>
          <span>Dislikes: {postData.dislikes}</span>
          <span>Comments: {existingComments.length}</span>
        </div>
      </div>
      <div className='post-box'>
        <div className='comment-section'>
          <img alt='profile' src={fb.auth().currentUser?.photoURL!} />
          <textarea onChange={e => setCommentContent(e.target.value)} placeholder='Comment on this post...' />
          <button onClick={onPostClick}>Post</button>
        </div>
      </div>
      {existingComments.length !== 0 &&
        existingComments.map((comment: Comment, i:number) => {
          console.log(comment)
          return(
            <div key={i} className='post-box'>
              <img alt='profile' src={comment.photoURL}/>
              <div className='comment'>
                <span>{comment.author}</span>
                <span>{comment.content}</span>
                <span>{timeFormatter(comment.timeCreated)}</span>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}


export default Post;
