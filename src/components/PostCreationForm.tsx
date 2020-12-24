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
  const [formHasError, setFormHasError] = useState(false)

  const validateInput = () => {

    if(title === "" || body === "") {
      setFormHasError(true)
      console.log(formHasError)
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

            <button onClick={()=> validateInput()}>{props.formType === FormTypes.create ? "Post" : "Edit"}</button>
            <button>Cancel</button>
          </div>
        </div>
    </>
  )
}

export default PostCreationForm;