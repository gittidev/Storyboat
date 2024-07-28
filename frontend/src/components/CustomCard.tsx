import { styled } from "@mui/system";
import { Card, CardContent, Typography } from "@mui/material";

interface CustomCardProps {
  story_id?: number;
  note_id?: number;
  title?: string;
  content?: string;
  onclick? : ()=> void;
  lastCollectedBy?: string;
  lastDateEdited?: string;
}

const StyledCard = styled(Card)<CustomCardProps>`
  width: 300px;
  height: 100px;
  border-radius: 10px;
  border :  1px solid #D1D5DB;
  margin:5px;
`;

const CustomCard: React.FC<CustomCardProps> = ({ title, content }) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="div">
          {title || 'Default Title'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {content || 'Default content goes here.'}
        </Typography>
      </CardContent>
    </StyledCard>
  );
}

export default CustomCard;
