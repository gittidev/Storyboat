import { styled } from "@mui/system";
import { Card } from "@mui/material";

const StyledCard = styled(Card)`
  width: 300px;
  height: 300px;
`


export const EachTag = styled('span')`
width : 50px;
border : 1px solid black;
border-radius : 10px;
`

const CustomCard = () => {

  return (
    <>
    <StyledCard>
      카드 영역
    </StyledCard>
    </>
  );
}

export default CustomCard
