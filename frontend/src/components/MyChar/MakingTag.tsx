import React, { useState } from 'react';
import { styled } from '@mui/system';

const TagsInput = styled('div')`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 48px;
  width: 100%; /* Set width to 80% of the viewport width */
  max-width: 2000px; /* Optional: Set a maximum width to avoid it becoming too large */
  padding: 0 8px;
  border: 1px solid rgb(1, 186, 138);
  border-radius: 6px;

  > ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 8px 0 0 0;

    > .tag {
      width: auto;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgb(1, 186, 138);
      padding: 0 8px;
      font-size: 14px;
      list-style: none;
      border-radius: 6px;
      margin: 0 8px 8px 0;
      background: rgb(242,243,244);
      border-radius: 15px;

      > .tag-close-icon {
        display: block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        font-size: 14px;
        margin-left: 8px;
        color: rgb(1, 186, 138);
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
      }
    }
  }

  > input {
    flex: 1;
    border: none;
    height: 46px;
    font-size: 14px;
    padding: 4px 0 0 12px; /* Adjust padding-left here */
    :focus {
      outline: transparent;
    }
  }

  &:focus-within {
    border: 1px solid rgb(1, 186, 138);
  }
`;

const Tag = () => {
  const initialTags = ['귀여운', '상냥한'];
  const [tags, setTags] = useState(initialTags);

  const removeTags = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    const inputVal = inputElement.value;
    if (event.key === "Enter" && inputVal !== '' && !tags.includes(inputVal)) {
      setTags([...tags, inputVal]);
      inputElement.value = '';
    }
  };

  return (
    <TagsInput>
      <ul id="tags">
        {tags.map((tag, index) => (
          <li key={index} className="tag">
            <span className="tag-title">{tag}</span>
            <span className="tag-close-icon" onClick={() => removeTags(index)}>x</span>
          </li>
        ))}
      </ul>
      <input
        className="tag-input"
        type="text"
        onKeyUp={addTags}
        placeholder="태그를 입력 후 엔터"
      />
    </TagsInput>
  );
};

export default Tag;
