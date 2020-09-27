import React, { useState, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import fb from '../config/fireBase';
import timeFormatter from '../services/timeFormatter';
import submitComment from '../services/submitComment';
import addReaction from '../services/addReaction';
import Comment from '../models/Comment';
import { Link } from 'react-router-dom';
import { Posts } from '../models/Posts';
import { Reaction } from '../models/Reactions';
import PostCommentSection from './PostCommentSection';

interface PostParams {
  id: string,
}

function Post(props: RouteComponentProps<PostParams>) {

  const [postData, setPostData] = useState<Posts>({
    likes: [],
    dislikes: [],
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
  const [likes, setLikes] = useState<Reaction[]>([]);
  const [dislikes, setDislikes] = useState<Reaction[]>([]);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasDisliked, setUserHasDisliked] = useState(false);
  const isMounted = useRef<boolean>(false);
  

  useEffect(():any => {
    isMounted.current = true;
    const db = fb.firestore();
    const ref = db.doc(`posts/${props.match.params.id}`)
    ref.get().then((doc: any) => {
      if(doc.exists && isMounted.current) {
        let store = doc.data()
        setPostData(store);
        setExistingComments(store.comments ? store.comments.reverse() : [])
        setLikes(store['likes'] ? store['likes']  : []);
        setDislikes(store['dislikes'] ? store['dislikes'] : []);
        if(store['likes']) {
          const hasLiked = store['likes'].some((reaction: {uid: String}) => {
            return reaction.uid === fb.auth().currentUser?.uid 
          })
          setUserHasLiked(hasLiked)
        }

        if(store['dislikes']) {
          const hasDisliked = store['dislikes'].some((reaction: {uid: String}) => {
            return reaction.uid === fb.auth().currentUser?.uid 
          })
          setUserHasDisliked(hasDisliked)
        }
      }
    });
    return ()=> isMounted.current = false; //make sure memory doesn't leak by only fetching data if component is mounted
  }, [setPostData, setExistingComments, props.match.params.id, setLikes, setDislikes, setUserHasDisliked, setUserHasLiked]);

  const onPostClick = () => {
    const updateComments = submitComment(existingComments, commentContent, props.match.params.id);
    setExistingComments(updateComments);
  }

  const onReactionClick = (type: string) => {
    if((type === "likes" && !userHasLiked) || (type === "dislikes" && !userHasDisliked)) {
      const newReaction = addReaction(type, postData.content.id, fb.auth().currentUser?.displayName!, fb.auth().currentUser?.uid!, fb.auth().currentUser?.photoURL!, userHasLiked, userHasDisliked)
      if(type === "likes") {
        likes.push(newReaction)
        setUserHasLiked(true)
        setUserHasDisliked(false)
      } else {
        dislikes.push(newReaction)
        setUserHasDisliked(true)
        setUserHasLiked(false)
      }
    } 
  }

  document.title = `Post: ${postData.content.title}`;

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
          <img 
            onClick={()=> onReactionClick("likes")} 
            src={process.env.PUBLIC_URL + '/assets/like.svg'} 
            className={userHasLiked ? 'liked' : ''}
          />
          <span>{likes.length}</span>
          <img 
            onClick={()=> onReactionClick("dislikes")} 
            src={process.env.PUBLIC_URL + '/assets/like.svg'}
            className={userHasDisliked ? 'disliked' : ''} 
          />
          <span>{dislikes.length}</span>
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
