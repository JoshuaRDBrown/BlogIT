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
import { RecentlyViewedPosts } from '../models/RecentlyViewedPosts';
import PostCommentSection from './PostCommentSection';
import getAndSetLocalStorage from '../services/getAndSetLocalStorage';
import removePost from '../services/removePost';
import PostCreationForm from './PostCreationForm';
import { FormTypes } from '../enums/FormTypes'; 
import createOrUpdatePosts from '../services/createOrUpdatePost';

interface PostParams {
  id: string,
}

function PostPage(props: RouteComponentProps<PostParams>) {

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
      timeUpdated: 0, 
      isEdited: false
  }
  });

  const [existingComments, setExistingComments] = useState<Comment[]>([])
  const [commentContent, setCommentContent] = useState<string>('');
  const [likes, setLikes] = useState<Reaction[]>([]);
  const [dislikes, setDislikes] = useState<Reaction[]>([]);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasDisliked, setUserHasDisliked] = useState(false);
  const isMounted = useRef<boolean>(false);
  const [hasClickedPostActions, setHasClickedPostActions] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false)

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

        const recentlyViewedPosts = getAndSetLocalStorage('get', 'recentlyViewedPosts')
        let postIsAlreadyInList;
        if(recentlyViewedPosts) {
           postIsAlreadyInList = recentlyViewedPosts.some((post: RecentlyViewedPosts) => {
            return post.postId === props.match.params.id
          })
        }
        
        if(!postIsAlreadyInList) {
          getAndSetLocalStorage('set', 'recentlyViewedPosts', {
            postId: props.match.params.id, 
            postTitle: store.content.title, 
            author: store.content.author,
            timeViewed: Date.now()
          })
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

  const editNewPost = (postHeader: string, postBody: string) => {
    let editedContent = createOrUpdatePosts("EDIT", postHeader, postBody, postData.content.id, postData.content)
    setPostData({...postData, content: {
        id: postData.content.id,
        userId: postData.content.userId, 
        title: postHeader == "" ? postData.content.title : postHeader, 
        body: postBody == "" ? postData.content.body : postBody,  
        author: postData.content.author, 
        photoURL: postData.content.photoURL, 
        time: postData.content.time, 
        timeUpdated: editedContent?.updatedTime ? editedContent?.updatedTime : 0,
        isEdited: true
      }
    })
    setIsEditingPost(false)
  }

  document.title = `Post: ${postData.content.title}`;

  return (
    <div className='post-container'>
      {isEditingPost &&
        <PostCreationForm 
          formTitle="Edit post" 
          postHeaderDefaultValue={postData.content.title} 
          postBodyDefaultValue={postData.content.body} 
          formType={FormTypes.edit}
          editNewPost={editNewPost}
        />
      }
      <div className='post-box'>
        <div className="post-top">
          <span id='title'>{postData.content.title}</span>
          {postData.content.userId === fb.auth().currentUser?.uid &&
            <button id="post-author-actions" onClick={()=> setHasClickedPostActions((prevState)=> !prevState)}>
              <img src={process.env.PUBLIC_URL + '/assets/3dots.svg'}/>
              {hasClickedPostActions &&
                <div className='post-actions-menu'>
                  <button onClick={()=> setIsEditingPost(true)}>
                    <img src={process.env.PUBLIC_URL + '/assets/edit.svg'}/>
                    <span>Edit</span>
                  </button>
                  <Link to="/home" style={{all: "unset"}}>
                    <button id='delete' onClick={()=> removePost(props.match.params.id)}>
                      <img src={process.env.PUBLIC_URL + '/assets/delete.svg'}/>
                      <span>Delete</span>
                    </button>
                  </Link>
                </div>
              }
            </button>
          }
        </div>
        <span id='body'>{postData.content.body}</span>
        <div className='postFooter'>
          <div className='user-info'>
            <img alt='profile' src={postData.content.photoURL} />
            <Link to={`/user/${postData.content.userId}`}>{postData.content.author}</Link>
          </div>
          <div className='timestamp'>
            <span style={{float: "right"}}>{timeFormatter(postData.content.time)}</span><br/>
            {postData.content.isEdited &&
              <span>Edited: {timeFormatter(postData.content.timeUpdated)}</span>
            }
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

export default PostPage;
