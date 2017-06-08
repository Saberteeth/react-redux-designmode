import React from "react";
import R2Factory from "../utils/R2/R2Factory";
import { loadReadme, saveReadme } from "../redux/action/store";
import Editor from "../utils/RichEditor/index";

class Stage extends React.Component {
  componentWillMount() {
    this.props.loadReadme();
    this.state = {
      isChange: false
    };
  }

  get store() {
    return this.props.getState();
  }

  _router() {
    switch (this.store.status.readmeStatus) {
      case 0:
        return "Loading..";
      case 1:
        //return !this.state.value ?  : this.state.value;
        return <Editor value={this.store.readme || ""} onChange={this.onChange.bind(this)}/>;
      case 2:
        return "LoadError!";
    }
  }

  onChange(html) {
    this.setState(
      Object.assign({}, this.state, { value: html, isChange: true })
    );
  }

  onClick(e) {
    this.setState(Object.assign({}, this.state, { isChange: false }));
    this.props.saveReadme(this.state.value);
  }

  render() {
    return (
      <div id="editor-view">
        {this._router()}
        <br />
        <button
          disabled={!this.state.isChange ? "disable" : ""}
          onClick={this.onClick.bind(this)}
        >
          Save
        </button>
      </div>
    );
  }
}

const EditorView = R2Factory.connect(Stage, state => state.store, {
  loadReadme,
  saveReadme
});
export default EditorView;
