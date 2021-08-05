import React, { useState } from 'react';
import styled, {css} from "styled-components";
import {KeyCode} from "../utils/constants";

const StyledTab = styled.button`
  :focus {
    outline: none;
  }
  ${props => props.isSelected && css`
    outline: none;
    border: 1px solid #e5e8ea;
    border-bottom: 1px solid #ffffff;
  `}
  position: relative;
  bottom: -1px;
  padding: 7px;
  cursor: pointer;
  button.destroy {
    margin: 0 0 0 10px;
    cursor: pointer;
  }
`
function Tab ({ label, onDelete, onUpdate, deletable = false, editable = false, ...rest}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const submitText = () => {
    const name = editText.trim();
    if (name) {
      onUpdate(name);
      setIsEditing(false);
    } else {
      onDelete();
    }
  };
  const onInputChange = event => {
    setEditText(event.target.value);
  };
  const onKeyDown = event => {
    if (event.which === KeyCode.Escape) {
      setIsEditing(false);
    } else if (event.which === KeyCode.Enter) {
      submitText();
    }
  }
  const intoEdit = () => {
    setIsEditing(true);
    setEditText(label);
  }
  return (
    <StyledTab
      {...rest}
      onDoubleClick={intoEdit}
    >
      {(editable && isEditing) ?
        <input
          autoFocus
          value={editText}
          onBlur={submitText}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        /> :
        <>
          {label}
          {deletable ?  <button className='destroy' onClick={onDelete}>
            ×
          </button>: null}
        </>
      }
    </StyledTab>
  )
}

export default Tab;
