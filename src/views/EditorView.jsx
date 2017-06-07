import React from "react";
import R2Factory from "../utils/R2/R2Factory";
import { loadReadme, saveReadme } from "../redux/action/store";

class Stage extends React.Component {
  componentWillMount() {
    this.props.loadReadme();
    this.state = {
      value: null,
      isChange: false
    };
  }

  get store() {
    return this.props.getState();
  }

  get value() {
    switch (this.store.status.readmeStatus) {
      case 0:
        return "Loading..";
      case 1:
        return !this.state.value ? this.store.readme : this.state.value;
      case 2:
        return "LoadError!";
    }
  }

  onChange(e) {
    this.setState(
      Object.assign({}, this.state, { value: e.target.value, isChange: true })
    );
  }

  onClick(e) {
    this.setState(Object.assign({}, this.state, { isChange: false }));
    this.props.saveReadme(this.state.value);
  }

  render() {
    return (
      <div id="editor-view">
        <textarea
          onChange={this.onChange.bind(this)}
          value={this.value || ""}
        />
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
