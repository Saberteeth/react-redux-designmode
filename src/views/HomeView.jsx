import React from "react";
import R2Factory from "../utils/R2/R2Factory";
import { loadReadme } from "../redux/action/store";

function IRouter({ value, status }) {
  switch (status) {
    case 0:
      return <div>Loading...</div>;
    case 1:
      return <div id="screen" dangerouslySetInnerHTML={{ __html: value }} />;
    case 2:
      return <div>Error!</div>;
  }
}

class Stage extends React.Component {
  componentWillMount() {
    this.props.loadReadme();
  }

  get store() {
    return this.props.getState();
  }

  render() {
    return (
      <div>
        <IRouter
          value={this.store.readme}
          status={this.store.status.readmeStatus}
        />
      </div>
    );
  }
}
const HomeView = R2Factory.connect(Stage, state => state.store, { loadReadme });
export default HomeView;
