import { Box } from "@mui/material";
import { styled } from "@mui/system";
import "../../assets/stylesheets/custom-scrollbar.css";

export const BorderBox = styled(Box)`
  border-radius : 10px;
  padding: 1px;
  min-height: 80vh ;
  height: auto;
  border:1px solid transparent;
  background-image:linear-gradient(#fff, #fff),linear-gradient(0deg, #ebffde 0%, #cde4ff 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  overflow: auto;

  /* padding: 1rem;
  background: linear-gradient(0deg, #ebffde 0%, #cde4ff 100%);
  padding: 3px; */

  
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
  &::-webkit-scrollbar-thumb {
    background: #4d4f7f;
    border-radius: 15px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #888;
  }
  
`
