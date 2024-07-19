import styled from "styled-components";

export const Card = styled.div`
border-radius : 6px;
border : 1px solid rgb(1, 186, 138);
width: 327px;
height: 129px;
flex-shrink: 0;
fill: #FFF;

filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`

export const EachTag = styled.span`
width : 50px;
border : 1px solid black;
border-radius : 10px;
`
export const tags : Array<string> = ['판타지', '장편']
export const ex1 : string = 'sub작가 분 모집합니다!'
export const writer : string = '김싸피'

// export const tagList : Array<string> = [] 

export default function BasicCard() {
  return (
    <>
    <Card>
        <div>
        {ex1}
        </div>
        {tags.map((tag,index)=>(

        <EachTag key={index}>
            {tag}
        </EachTag>
        ))}
        {writer}
    </Card>
    </>
  );
}
