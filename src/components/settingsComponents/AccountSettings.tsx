import React, { useState } from 'react';

interface Props {
  userObj: any,
}

const AccountSettings: React.SFC<Props> = (props) => {

  const [isEditing, setIsEditing] = useState(false);

  return(
    <>
      <span>My Account</span>
      <span><p>Username:</p> {props.userObj.displayName}</span>
      <span><p>Email Address:</p> {props.userObj.email}</span>
      <span><p>Phone Number</p> number</span>
      <span><p>Reset Password:</p><input placeholder='Old password'/><input placeholder='New password'/></span>
      <button>Save changes</button>
    </>
  );
}

export default AccountSettings;
