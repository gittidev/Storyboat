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
}

const StyledButton = styled('button')<ButtonProps>`
  background-color: ${(props) => props.bgcolor || 'black'};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
  min-height: 32px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  writing-mode: horizontal-tb; /* 텍스트를 가로로 표시 */
  :hover {
    background-color: ${(props) => props.hoverBgColor || 'darkgray'};
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
