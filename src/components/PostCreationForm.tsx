import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormTypes } from '../enums/FormTypes';

interface Props {
  formTitle: string,
  postHeaderDefaultValue?: string,
  postBodyDefaultValue?: string,
  formType: FormTypes,
  createNewPost?: ((title: string, body: string) => void),
  editNewPost?: ((title: string, body: string) => void),
  cancelPostCreation(): void
}

const PostCreationForm: React.SFC<Props> = (props) => {

  const [title, setPostTitle] = useState('');
  const [body, setPostBody] = useState('');
  const [formHasError, setFormHasError] = useState(false)

  const validateInput = () => {

    if((title === "" || body === "") && props.formType !== FormTypes.edit) {
      setFormHasError(true)
      return
    }

    if(props.formType === FormTypes.create) {
      //@ts-ignore 
      props.createNewPost(title, body)
    } else {
      //@ts-ignore 
      props.editNewPost(title, body)
    }
  }

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
          <div className="post-creation-footer">
            {formHasError &&
              <p>Post creation failed: Please ensure you have added a title and description to your post.</p>
            }

            {props.formType === FormTypes.create ? 
              <Link to="/home" style={{all: "unset"}}>
                <button onClick={()=> validateInput()}>Post</button>
              </Link> : <button onClick={()=> validateInput()}>Edit</button>
            }
            
            <button onClick={()=> props.cancelPostCreation()}>Cancel</button>
          </div>
        </div>
    </>
  )
}

export default PostCreationForm;