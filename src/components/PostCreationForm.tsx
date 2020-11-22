import React, { useState } from 'react';
import { FormTypes } from '../enums/FormTypes';

interface Props {
  formTitle: string,
  postHeaderDefaultValue?: string,
  postBodyDefaultValue?: string,
  formType: FormTypes,
  createNewPost?: ((title: string, body: string) => void),
  editNewPost?: ((title: string, body: string) => void),
}

const PostCreationForm: React.SFC<Props> = (props) => {

  const [title, setPostTitle] = useState('');
  const [body, setPostBody] = useState('');

  return(
    <>
      <div className='overlay'></div>
        <div className='new-post-form'>
          <span>{props.formTitle}</span>
          <input
            defaultValue={props.postHeaderDefaultValue || undefined}
            placeholder='Post title'
            onChange={e => setPostTitle(e.target.value)}
          />
          <textarea
            defaultValue={props.postBodyDefaultValue || undefined}
            placeholder='Speak your mind...'
            onChange={e => setPostBody(e.target.value)}
          />
          {props.formType === FormTypes.create ?
            //@ts-ignore 
            <button onClick={()=> props.createNewPost(title, body)}>Post</button> : 
            //@ts-ignore 
            <button onClick={()=> props.editNewPost(title, body)}>Edit</button>
          }
        </div>
    </>
  )
}

export default PostCreationForm;