import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound: React.SFC = () => {

  document.title = "404 - Page not found";

  return(
    <div className="pnf-container">
      <div className="error-message">
        <img src={process.env.PUBLIC_URL + '/assets/404.svg'}/>
        <h1>404 - Page not found.</h1>
        <h2>Unfortunately, the page you were looking for does not exist.</h2>
        <p>Why does this happen?</p>
        <p>1) You have searched using an incorrect URL</p>
        <p>2) The owner of this post has deleted it</p>
        <p>3) The post was removed because it violated <a href="/404">community guidelines</a></p>
        <Link to='/home' style={{offset: 'all'}}>
          <button>Back to safety</button>
        </Link>
      </div>
    </div>
  )
}

export default PageNotFound;