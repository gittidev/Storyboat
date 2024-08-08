// import { useState } from 'react';
// import styled from 'styled-components';

// export const TagsInput = styled.div`

//   display: flex;
//   align-items: flex-start;
//   flex-wrap: wrap;
//   min-height: 48px;
//   width: 480px;
//   padding: 0 8px;
//   border: 1px solid rgb(1, 186, 138);
//   border-radius: 6px;

//   > ul {
//     display: flex;
//     flex-wrap: wrap;
//     padding: 0;
//     margin: 8px 0 0 0;

//     > .tag {
//       width: auto;
//       height: 32px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: rgb(1, 186, 138);
//       padding: 0 8px;
//       font-size: 14px;
//       list-style: none;
//       border-radius: 6px;
//       margin: 0 8px 8px 0;
//       background: rgb(242,243,244);
//       border-radius: 15px;

//       > .tag-close-icon {
//         display: block;
//         width: 16px;
//         height: 16px;
//         line-height: 16px;
//         text-align: center;
//         font-size: 14px;
//         margin-left: 8px;
//         color: rgb(1, 186, 138);
//         border-radius: 50%;
//         background: #fff;
//         cursor: pointer;
//       }
//     }
//   }

//   > input {
//     flex: 1;
//     border: none;
//     height: 46px;
//     font-size: 14px;
//     padding: 4px 0 0 0;
//     :focus {
//       outline: transparent;
//     }
//   }

//   &:focus-within {
//     border: 1px solid rgb(1, 186, 138);
//   }
// `;

// export const Tag = () => {
//   const initialTags = ['판타지', '공포'];

//   const [tags, setTags] = useState(initialTags);
//   const removeTags = (indexToRemove : number) => {
//     // 태그를 삭제하는 메소드
//     const filter = tags.filter((el : string ,index : number) => index !== indexToRemove);
//     setTags(filter);
//   };

//   const addTags = (event : React.KeyboardEvent<HTMLInputElement>) => {
//     // tags 배열에 새로운 태그를 추가하는 메소드 

//     // console.log(event.target.value)

//     // const inputVal = event.target.value;
//     const inputElement = event.target as HTMLInputElement;
//     const inputVal = inputElement.value;
//     // 이미 입력되어 있는 태그인지 검사하여 이미 있는 태그라면 추가하지 말기 
//     // 아무것도 입력하지 않은 채 Enter 키 입력시 메소드 실행하지 말기
//     // 태그가 추가되면 input 창 비우기 
//     if(event.key === "Enter" && inputVal !== '' && !tags.includes(inputVal)){
//       setTags([...tags,inputVal]);
//       inputElement.value = '';
//     }
//   };

//   return (
//     <>
//       <TagsInput>
//         <ul id="tags">
//           {tags.map((tag, index) => (
//             <li key={index} className="tag">
//               <span className="tag-title">{tag}</span>
//             {/* tag-close-icon이 tag-title 오른쪽에 x로 표시, 삭제 아이콘을 click 했을 때 removeTags 메소드가 실행 */}
//               <span className="tag-close-icon" onClick={ () => removeTags(index)}>
//               x</span>
//             </li>
//           ))}
//         </ul>
//         <input
//           className="tag-input"
//           type="text"
// 		//키보드의 Enter 키에 의해 addTags 메소드가 실행
//           onKeyUp={(e) => {
//             { addTags(e)
//             }
//           }}
//           placeholder="Press enter to add tag"
//         />
//       </TagsInput>
//     </>
//   );
// };


//build 위해 수정된 코드
import React, { useState } from 'react';
import { styled } from '@mui/system';

const TagsInput = styled('div')`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 48px;
  width: 480px;
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
    padding: 4px 0 0 0;
    :focus {
      outline: transparent;
    }
  }

  &:focus-within {
    border: 1px solid rgb(1, 186, 138);
  }
`;

const Tag = () => {
  const initialTags = ['판타지', '공포'];
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
        placeholder="Press enter to add tag"
      />
    </TagsInput>
  );
};

export default Tag;
