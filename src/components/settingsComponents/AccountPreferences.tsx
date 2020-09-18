import React from 'react';

const AccountPreferences: React.SFC = (props) => {
  return(
    <div className="account-fields">
      <label htmlFor='lang-select'>LANGUAGE</label>
      <select id='lang-select'>
        <option>English</option>
      </select>
      <label htmlFor='theme-select'>THEME</label>
      <select id='theme-select'>
        <option>Light</option>
        <option>Dark</option>
      </select>
      <button>Save changes</button>
    </div>
  )
}

export default AccountPreferences;
