import React, { useState } from 'react';
import AccountPreferences from './settingsComponents/AccountPreferences';
import AccountPrivacy from './settingsComponents/AccountPrivacy';
import AccountSettings from './settingsComponents/AccountSettings';

interface Props {
  toggleDarkMode: ((theme: boolean) => void),
  darkMode: boolean,
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
      <div className='settings-box'>
      <span id='title'>Settings</span><br/>
      <span id='secondary-text'>Preferences and settings</span>
      {settings_menu.map((setting)=> {
        const isActiveTab = currentSettingView === setting.name;
        return(
          <div
            onClick={()=> setCurrentSettingView(setting.name)}
            className='settings-box_item'
            style={{ borderBottom: isActiveTab ? '2px solid #d9271a' : '2px solid #dcdcdc' }}
          >
            <div className='setting-box--label'>
              <span>{setting.label}</span><br/>
              <span id='description'>{setting.description}</span>
            </div>
            <div className='setting-box--value'>
              <button> > </button>
            </div>
          </div>
        )
      })}
      </div>
      <div className='right-container'>
        {currentSettingView === 'ACCOUNT' ?
          <AccountSettings userObj={props.userObj} /> :
        currentSettingView === 'PREFERENCES' ?
          <AccountPreferences /> :
        currentSettingView === 'PRIVACY' ?
          <AccountPrivacy /> : null
        }
      </div>
    </div>
  )
}

export default Settings;
