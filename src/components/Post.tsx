import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import fb from '../config/fireBase';

interface PostParams {
  id: string,
}

function Post(props: RouteComponentProps<PostParams>) {

  const [data, setPostData] = useState({ title: '', body: '', author: '', time: '', photoURL: '' })

  const db = fb.firestore();
  const ref = db.doc(`posts/${props.match.params.id}`)
  ref.get().then((doc: any) => {
    if(doc.exists) {
      setPostData(doc.data().content);
    }
  })

  return (
    <div className='post-container'>
      <span>{data.title}</span>
    </div>
  )
}


export default Post;