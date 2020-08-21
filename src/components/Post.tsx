import React, { useState, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import fb from '../config/fireBase';
import timeFormatter from '../services/timeFormatter';
import submitComment from '../services/submitComment';
import addReaction from '../services/addReaction';
import Comment from '../models/Comment';
import { Link } from 'react-router-dom';
import { Posts } from '../models/Posts';
import PostCommentSection from './PostCommentSection';

interface PostParams {
  id: string,
}

function Post(props: RouteComponentProps<PostParams>) {

  const [postData, setPostData] = useState<Posts>({
    likes: 0,
    dislikes: 0,
    comments: [],
    content: { 
      id: 0, 
      userId: '', 
      title: '', 
      body: '', 
      author: '', 
      photoURL: '', 
      time: 0, 
  }
  });
  const [existingComments, setExistingComments] = useState<Comment[]>([])
  const [commentContent, setCommentContent] = useState<string>('');
  const[likes, setLikes] = useState(0);
  const[dislikes, setDislikes] = useState(0);
  const isMounted = useRef<boolean>(false);

  useEffect(():any => {
    isMounted.current = true;
    const db = fb.firestore();
    const ref = db.doc(`posts/${props.match.params.id}`)
    ref.get().then((doc: any) => {
      if(doc.exists && isMounted.current) {
        setPostData(doc.data());
        setExistingComments(doc.data().comments ? doc.data().comments : [])
        setLikes(postData.likes);
        setDislikes(postData.dislikes);
      }
    });
    return ()=> isMounted.current = false; //make sure memory doesn't leak by only fetching data if component is mounted
  }, [setPostData, setExistingComments, props.match.params.id, setLikes, setDislikes]);

  const onPostClick = () => {
    const updateComments = submitComment(existingComments, commentContent, props.match.params.id);
    setExistingComments(updateComments);
  }

  return (
    <div className='post-container'>
      <div className='post-box'>
        <span id='title'>{postData.content.title}</span>
        <span id='body'>{postData.content.body}</span>
        <div className='postFooter'>
          <div className='user-info'>
            <img alt='profile' src={postData.content.photoURL} />
            <Link to={`/user/${postData.content.userId}`}>{postData.content.author}</Link>
          </div>
          <div className='time-created'>
            <span>{timeFormatter(postData.content.time)}</span>
          </div>
        </div>
        <div className='postStats'>
          <img onClick={()=> addReaction('likes', postData.content.id)} src={process.env.PUBLIC_URL + '/assets/like.svg'} />
          <span>{likes}</span>
          <img src={process.env.PUBLIC_URL + '/assets/like.svg'} />
          <span>{dislikes}</span>
          <img src={process.env.PUBLIC_URL + '/assets/comments.svg'} />
          <span>{existingComments.length || '0'}</span>
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
          return(
            <PostCommentSection comment={comment} index={i} />
          )
        })
      }
    </div>
  )
}


export default Post;
