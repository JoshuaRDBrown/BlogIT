import React, { useState } from 'react';
import fb from '../../config/fireBase';
import ReactTooltip from 'react-tooltip';
import getAndSetLocalStorage from '../../services/getAndSetLocalStorage'

interface Props {
  userObj: any,
}

interface updatedSettingsObj {
  displayName: string,
  email: string,
  phoneNumber: string,
  oldPassword: string,
  newPassword: string,
}

const AccountSettings: React.SFC<Props> = (props) => {

  const accountInfo = [
    {name: 'displayName', label: 'Username', value: props.userObj.displayName, isEditing: false},
    {name: 'email', label: 'Email Address', value: props.userObj.email, isEditing: false},
    {name: 'phoneNumber', label: 'Phone Number', value: props.userObj.phoneNumber || 'N/A', isEditing: false},
    {name: 'oldPassword', label: 'Change password', value: '', isEditing: false},
    {name: 'newPassword', label: '', value: '', isEditing: false},
  ]

  const [updatedSettings, setUpdatedSettings] = useState({
    displayName: props.userObj.displayName,
    email: props.userObj.email,
    phoneNumber: props.userObj.phoneNumber,
    oldPassword: '',
    newPassword: '',
  });

  const [canChangeUserName, setChangeUserName] = useState(false);

  const { displayName, email, phoneNumber, oldPassword, newPassword } = updatedSettings;

  const updateAccountInfo = ():void => {
    const user = fb.auth().currentUser;
    const coolDown = getAndSetLocalStorage('get', 'userNameCoolDown')

    if(coolDown) {
      if(parseInt(coolDown) < Date.now()) {
        setChangeUserName(true)
      }
    }

    if(canChangeUserName && displayName !== props.userObj.displayName) {
      user?.updateProfile({
        displayName: displayName, 
      });
    }

    const currentDate = new Date();
    const coolDownDate = currentDate.setDate(currentDate.getDate() + 30); //sets a cool down of 30 days in which a user can change their username. 

    getAndSetLocalStorage('set', 'userNameCoolDown', coolDownDate.toString())

    if(email !== props.userObj.email) {
      user?.updateEmail(email).then(() => {
        console.log("email changed")
      }).catch((err) => {
        console.log(err)
      });
    }

    if(newPassword !== '' && newPassword !== oldPassword) {
      user?.updatePassword(newPassword).then(()=> {
        console.log('updated password');
      }).catch((err) => {
        console.log(err);
      })
    }
  }
  return(
    <>
      <div className="account-fields">
        {accountInfo.map((field) => {
          return(
            <React.Fragment key={field.name}>
              <label htmlFor='userInfoInput'>
                {field.label.toUpperCase()}
              </label>
              <input 
                data-tip='You may only change this information once every 30 days to reduce confusion.'
                data-type='info'
                data-place='right'
                data-effect='solid'
                type={field.name.includes('Password') ? 'password' : 'text'}
                onChange={(e)=> {e.persist(); setUpdatedSettings((prevState) => ({//e.persist() - Tells react not to wipe event for reuse (https://stackoverflow.com/questions/61870886/reactjs-typeerror-cannot-read-property-value-of-null)
                  ...prevState,
                  [field.name]: e.target.value
                }))}}
                id='userInfoInput' 
                placeholder={field.name === 'oldPassword' ? 'Old Password' : field.name.includes('Password') ? 'New Password' : ''} 
                defaultValue={field.value === '' ? null : field.value}
              />
              <ReactTooltip />
            </React.Fragment>
          )
        })
        }
      </div>
      <button onClick={()=> updateAccountInfo()}>Save changes</button>
    </>
  )
}

export default AccountSettings;
