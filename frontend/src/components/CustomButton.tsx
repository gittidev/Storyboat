import React from "react";
import { styled } from "@mui/system";

interface ButtonProps {
  content?: string;
  action?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  bgcolor?: string;
  hoverBgColor?: string;
}

const StyledButton = styled('button')`
  background-color: ${(props: ButtonProps) => props.bgcolor || 'black'};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  writing-mode: horizontal-tb; /* 텍스트를 가로로 표시 */
  :hover {
    background-color: ${(props: ButtonProps) => props.hoverBgColor || 'darkgray'};
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
