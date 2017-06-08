import React from "react";
import { Link } from "react-router-dom";
import VCon from "../utils/VCon/VCon";
const { Setting, Camera } = VCon;

export function ListView(props) {
  const who = window.location.href.split("#")[1];
  return (
    <div className="right-content">
      <h1>Menu</h1>
      <ul>
        <li className={who == "/" ? "active" : ""}>
          <Camera />
          {who == "/" ? "Home" : <Link to="/">Home</Link>}
        </li>
        <li className={who == "/editor" ? "active" : ""}>
          <Setting />
          {who == "/editor" ? "Editor" : <Link to="/editor">Editor</Link>}
        </li>
      </ul>
    </div>
  );
}
export default ListView;
