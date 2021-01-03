import React, { useState } from 'react';
import AccountPreferences from './settingsComponents/AccountPreferences';
import AccountPrivacy from './settingsComponents/AccountPrivacy';
import AccountSettings from './settingsComponents/AccountSettings';

interface Props {
  userObj: any,
}

interface Settings {
  name: string,
  label: string,
  description: string,
}

const Settings: React.SFC<Props> = (props) => {

  const [currentSettingView, setCurrentSettingView] = useState('ACCOUNT');

  const settings_menu: Settings[] = [
    {name: 'ACCOUNT', label: 'My Account', description: 'Email address, password & phone number'},
    {name: 'PREFERENCES', label: 'Preferences', description: 'Language, darkMode & timezone'},
    {name: 'PRIVACY', label: 'Privacy', description: 'Private profiles & your data'},
  ];

  return(
    <div className='settings-container'>
      <span id='title'>Settings</span><br/>
      <span id='secondary-text'>Preferences and settings</span>
      <div className='settings-box'>
        <div className='settings-box_menu'>
          {settings_menu.map((setting) => {
            const isCurrentlyViewing = setting.name === currentSettingView;
            return(
              <div className='settings-box_menu--item'>
                <img 
                  src={process.env.PUBLIC_URL + `/assets/icon-${setting.name}.svg`}
                />
                <button 
                  key={setting.name} 
                  onClick={()=> setCurrentSettingView(setting.name)}
                  style={{fontWeight: isCurrentlyViewing ? 500 : 'normal', color: isCurrentlyViewing ? 'black' : '#6b6b6b'}}
                >
                {setting.label}
                </button>
              </div>
            )
          })
          }
        </div>
        <div className='settings-box_right-view'>
          {currentSettingView === 'ACCOUNT' ?
            <AccountSettings userObj={props.userObj} /> :
          currentSettingView === 'PREFERENCES' ?
            <AccountPreferences /> :
          currentSettingView === 'PRIVACY' ?
            <AccountPrivacy /> : null
          }
        </div>
      </div>
    </div>
  )
}

export default Settings;
