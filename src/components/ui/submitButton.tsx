import React from 'react';

interface Props {
  content: string,
}

const submitButton: React.SFC<Props> = (props) => {
  return <button>{props.content}</button>

}