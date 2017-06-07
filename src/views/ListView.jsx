import React from 'react';
import {Link} from 'react-router-dom'
export function ListView(props) {
  return (
    <div className="right-content">
      <h1>List</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/editor">Editor</Link>
        </li>
      </ul>
    </div>
  )
}
export default ListView;