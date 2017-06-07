import React from 'react';
import {Link} from 'react-router-dom'
export function ListView(props) {
  const who = window.location.href.split("#")[1];
  return (
    <div className="right-content">
      <h1>List</h1>
      <ul>
        <li className={who=="/"?"active":""}>
          {who == '/'? "Home":<Link to="/">Home</Link>}
        </li>
        <li className={who=="/editor"?"active":""}>
          {who == '/editor'? "Editor":<Link to="/editor">Editor</Link>}
        </li>
      </ul>
    </div>
  )
}
export default ListView;