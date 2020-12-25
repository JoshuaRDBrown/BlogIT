import React from 'react';

interface Props {
  filterPosts(filterBy: string): void
}

const PostFilters: React.SFC<Props> = (props) => {

  const filterOptions = [
    {id: 1, name: "newest", labelName: "Newest"},
    {id: 2, name: "popular", labelName: "Popular"},
    {id: 3, name: "something", labelName: "Something"},
  ]

  const applyPostFilter = (event: any) => {
    props.filterPosts(event.target.value)
  }

  return(
    <div className="post-filters">
      <span>Sort Posts</span>
      {filterOptions.map((option) => {
        return(
          <div key={option.id} onChange={applyPostFilter}>
            <input 
              type="radio" 
              id={option.name} 
              defaultChecked={option.name === "newest"} 
              value={option.name} 
              name="post-filter" 
            />
            <label htmlFor={option.name}>{option.labelName}</label><br/>
          </div>
        )
      })}
    </div>
  )

}

export default PostFilters;
