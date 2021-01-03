import React,{ useState } from 'react';
import getAndSetLocalStorage from '../../services/getAndSetLocalStorage';

const AccountPrivacy: React.SFC = (props) => {

  const [showSuccess, setShowSuccess] = useState(false);

  const deleteData = () => {
    getAndSetLocalStorage("remove", "recentlyViewedPosts");
    setShowSuccess(true)
  }

  return(
    <div className="account-fields">
      <span>Delete post data</span>
      <span>By deleting this, you will delete all information we keep on you, such as posts you've viewed.</span>
      <button onClick={deleteData}>Delete data</button>
      {showSuccess &&
        <p id="operation-success">Data successfully deleted.</p>
      }
    </div>
    
  )
}

export default AccountPrivacy;
