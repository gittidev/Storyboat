import React from "react";
import { styled } from  "@mui/system";
interface ButtonProps {
    content?: string;
    action?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    bgcolor? : string;
}

const Button: React.FC<ButtonProps> = (props) => {
    const { content, action, onClick, type, bgcolor } = props;
   
    const StyledButton = styled('button')`
        background-color : ${bgcolor};
        border-radius : 5px;

        :hover {
            border: 2px solid black;
        }
    `

    return (
        <StyledButton type={type} className={`Button Button${action}`} onClick={onClick}>
            {content}
        </StyledButton>
    );
};

export default Button;
