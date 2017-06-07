import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Route } from "react-router-dom";
import configureStore from "./redux/reducer";

import HomeView from "./views/HomeView";
import EditorView from "./views/EditorView";
import ListView from "./views/ListView";
import "./main.css";

const store = configureStore();
export default class MainView extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <div id="main-view">
            <ListView />
            <div className="left-content">
              <Route exact path="/" component={HomeView} />
              <Route exact path="/editor" component={EditorView} />
            </div>
          </div>
        </HashRouter>
      </Provider>
    );
  }
}
