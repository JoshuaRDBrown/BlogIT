import React from 'react';
import { RecentlyViewedPosts } from '../models/RecentlyViewedPosts';
import timeFormatter from '../services/timeFormatter';
import { Link } from 'react-router-dom'

interface Props {
  posts: RecentlyViewedPosts[]
}

const RecentlyViewed: React.SFC<Props> = (props) => {
  return(
    <>
      <span>Recently Viewed</span>
      {props.posts ? 
        props.posts.reverse().map((post: RecentlyViewedPosts) => {
          return(
            <Link to={`/posts/${post.postId}`} key={post.postId} style={{textDecoration: 'none', color: 'black'}}>
              <div key={post.postId} className='recentlyViewedItem'>
                <div className='field'>
                  <img alt="post name" src={process.env.PUBLIC_URL + "/assets/post.svg"}/>
                  <p id='title'><b>{post.postTitle}</b></p>
                </div>
                <div className='field'>
                  <img alt="author" src={process.env.PUBLIC_URL + "/assets/user.svg"}/>
                  <p>{post.author}</p>
                </div>
                <div className='field'>
                  <img alt="time viewed" src={process.env.PUBLIC_URL + "/assets/time.svg"}/>
                  <p>{timeFormatter(post.timeViewed/1000)}</p>
                </div>
              </div>
            </Link>
          )
        }) : <p id='disclaimer'>When you look at posts, recently viewed ones will appear here.</p>
      }
    </>
  )
}

export default RecentlyViewed;