import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  convertFromHTML,
  AtomicBlockUtils,
  Entity,
  Modifier
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "./index.css";
import VCon from "../VCon/VCon";
import DEFAULT from "./index.json";
const { Camera } = VCon;
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

  let inlinetools = DEFAULT.inline;
  let blocktools = DEFAULT.block;
  let rcontools = DEFAULT.rcon;
  let emojitools = DEFAULT.emoji;

  if(thas.props.tools){
    const {inline = [],block = [],rcon = [], emoji=[]} = thas.props.tools;
    inlinetools = inline;
    blocktools = block;
    rcontools = rcon;
    emojitools = emoji;
  }
  return (
    <div className="RichEditor-tools">
      {inlinetools.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle[1]}
          style={type.style}
        />
      ))}
      {blocktools.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle[0]}
          style={type.style}
        />
      ))}
      {rcontools.map(type => {
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
      {emojitools.map(type=>{
        const onclick = e => {
          thas._addEmoji(type.emoji);
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
    const { onChange, tools } = this.props;
    let options = null;

    if(tools){
      const {inlineStyle = {}} = tools;
      options = explainStyle(inlineStyle);
      this.styleMap = inlineStyle;
    }else{
      explainStyle(DEFAULT.inlineStyle);
      this.styleMap = DEFAULT.inlineStyle;
    }

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
  _addEmoji(text) {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const txt = text;
    let nextEditorState = EditorState.createEmpty();
    if (selection.isCollapsed()) {
      const nextContentState = Modifier.insertText(contentState, selection, txt);
      nextEditorState = EditorState.push(
        editorState,
        nextContentState,
        'insert-characters'
      );
    } else {
      const nextContentState = Modifier.replaceText(contentState, selection, text);
      nextEditorState = EditorState.push(
        editorState,
        nextContentState,
        'insert-characters'
      );
    }
    this.onChange(nextEditorState);
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
            placeholder={this.props.placeholder}
            blockRendererFn={mediaBlockRenderer}
            customStyleMap={this.styleMap}
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
