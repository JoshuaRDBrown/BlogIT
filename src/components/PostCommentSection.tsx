import React from 'react';
import timeFormatter from '../services/timeFormatter';
import Comment from '../models/Comment';
import fb from '../config/fireBase';
import { Link } from 'react-router-dom';

interface Props {
  comment: Comment,
  index: number,
}

const PostCommentSection: React.SFC<Props> = (props) => {
  return(
    <div key={props.index} className='post-box'>
      <div className='comment'>
        <div className='commentAuthor'>
          <img alt='profile' src={props.comment.photoURL}/>
          <Link to={`/user/${props.comment.userId}`}>
            <span>{props.comment.author}</span>
          </Link>
          {props.comment.author === fb.auth().currentUser?.displayName && 
            <span id='post-author-badge'>Post author</span>
          }
        </div>
        <div className="comment--content">
          <span>{props.comment.content}</span>
        </div>
        <span id="commentTime">{timeFormatter(props.comment.timeCreated)}</span>
      </div>
    </div>
  )
}

export default PostCommentSection;