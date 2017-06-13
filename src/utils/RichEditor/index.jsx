import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  convertFromHTML,
  AtomicBlockUtils,
  Entity
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "./index.css";
import VCon from "../VCon/VCon";
import {BLOCK_TYPES, INLINE_STYLES, RCONS, STYLEMAP} from "./index.json";
const { Camera } = VCon;
const styleMap = STYLEMAP;
function label(name){
  let View = VCon[name];
  if(!View){
    View = Camera
  }
  return (
    <View />
  )
}
function explainStyle(map){
  let inlineStyles = {};
  for(name in map){
    inlineStyles[name] = {
      style:{
        ...map[name]
      }
    };
  }
  return {inlineStyles:inlineStyles};
}
function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: RCon,
      editable: false
    };
  }
  return null;
}
const RCon = ({contentState,block}) => {
  const entity = contentState.getEntity(block.getEntityAt(0))
  const {src} = entity.getData();
  return (
    <img src={src} />
  )
}

const options = explainStyle(styleMap);
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {label(this.props.label)}
      </span>
    );
  }
}
const RichTools = ({ editorState, onToggle, thas }) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const currentStyle = editorState.getCurrentInlineStyle();
  const contentState = editorState.getCurrentContent();
  return (
    <div className="RichEditor-tools">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle[1]}
          style={type.style}
        />
      ))}
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle[0]}
          style={type.style}
        />
      ))}
      {RCONS.map(type => {
        const onclick = e => {
          const entitiy = contentState.createEntity('image','IMMUTABLE',{src: type.src});
          const entityKey = entitiy.getLastCreatedEntityKey();
          thas.setState(
            { editorState: AtomicBlockUtils.insertAtomicBlock(
                  editorState,
                  entityKey,
                  "<img src='"+type.src+"' />"
                )}
          );
        }
        return (
          <span key={type.label} onClick={onclick} className="RichEditor-styleButton">
            {label(type.label)}
          </span>
        )
      })}
    </div>
  );
};
class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    const { onChange } = this.props;
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => {
      const contentState = editorState.getCurrentContent();
      if (onChange) onChange(stateToHTML(contentState, options));
      return this.setState({ editorState });
    };
    this.handleKeyCommand = command => this._handleKeyCommand(command);
    this.onTab = e => this._onTab(e);
    this.toggleBlockType = type => this._toggleBlockType(type);
    this.toggleInlineStyle = style => this._toggleInlineStyle(style);
  }
  componentWillMount() {
    const { value } = this.props;
    this.updataValue(value);
  }
  updataValue(value){
    let initState = null;

    if (!value) {
      initState = EditorState.createEmpty();
    } else {
      const blocks4HTML = convertFromHTML(value);
      initState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocks4HTML.contentBlocks,
          blocks4HTML.entityMap
        )
      );
    }
    // const entityKey = Entity.create('light','IMMUTABLE',{src: '/images/light.png'});
    this.state = { editorState: initState};
  }
  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }
  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }
  getBlockStyle(block) {
    switch (block.getType()) {
      case "blockquote":
        return "RichEditor-blockquote";
      default:
        return null;
    }
  }
  render() {
    const { editorState } = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    const contentState = editorState.getCurrentContent();

    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }
    return (
      <div className="RichEditor">
        <RichTools
          thas={this}
          editorState={editorState}
          onToggle={[this.toggleBlockType, this.toggleInlineStyle]}
        />
        <div className={className + " flag"} onClick={this.focus}>
          <Editor
            blockRendererFn={mediaBlockRenderer}
            customStyleMap={styleMap}
            blockStyleFn={this.getBlockStyle}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}
export default RichEditor;
