import React from 'react';
import { useLocation } from 'react-router';

interface Props {
  searchPosts: ((input: string) => void),
}

const SearchBox: React.SFC<Props> = (props) => {

  const location = useLocation();

  if(location.pathname === "/home") {
    return(
      <input 
        id='post-search-box' 
        onChange={(e)=> props.searchPosts(e.target.value)} 
        placeholder="Search BlogIT..."
        autoComplete="off"
      />
    )
  }

  return null;
}

export default SearchBox;