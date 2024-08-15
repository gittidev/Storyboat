import React from "react";
import { styled } from "@mui/system";

interface ButtonProps {
  content?: string;
  action?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  bgcolor?: string;
  hoverBgColor?: string;
  width? :string;
  height? : string;
  disabled? : boolean;
  open ? : boolean; 
  fontWeight ? : string;
  padding ? : string;
}

const StyledButton = styled('button')<ButtonProps>`
  background-color: ${(props) => props.bgcolor || 'black'};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0px;
  width: ${(props) => props.width || '150px'};
  height: ${(props) => props.height || '20px'};
  padding : ${(props) => props.padding || '10px'};
  transition: 'width 0.5s ease-in-out';
  min-height: 32px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  background-color: ${(props) => props.bgcolor || '#4053ff'};
  writing-mode: horizontal-tb; /* 텍스트를 가로로 표시 */

  font-family: 'Roboto', sans-serif;
  font-weight: ${(props) => props.fontWeight || '700'};
  
  :hover {
    background-color: ${(props) => props.hoverBgColor || 'lightgreen'};

  }

  :disabled {
    cursor: not-allowed;
    background-color: lightgray;
  }
`;



const CustomButton: React.FC<ButtonProps> = (props) => {
  const { content, action, onClick, type } = props;

  return (
    <StyledButton type={type} className={`Button Button${action}`} onClick={onClick} {...props}>
      {content}
    </StyledButton>
  );
};

export default CustomButton;
