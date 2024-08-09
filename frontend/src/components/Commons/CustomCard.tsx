import { styled } from "@mui/system";
import { Card, CardContent, Typography, Box } from "@mui/material";
import LongMenu, { Option } from "./LongMenu";
import { Link as RouterLink } from 'react-router-dom';

interface CustomCardProps {
  storyid?: number;
  noteId?: number;
  ideaId?: number;
  title?: string;
  content?: string;
  onClick?: () => void;
  width?: string;
  height?: string;
  menuOptions: Option[];
  onMenuClick?: (action: string, ideaId: number) => void; // action 추가
}

const StyledCard = styled(Card)<CustomCardProps>`
  border-radius: 8px;
  border: 1px solid #D1D5DB;
  margin: 5px;
  cursor: pointer;
  width: ${(props) => props.width || '260px'};
  height: ${(props) => props.height || '100px'};
  :hover {
    transform: translateX(10px);
    transition: transform 0.1s ease-in-out;
  }
`;

const CustomCard: React.FC<CustomCardProps> = (props) => {
  const { title, content, onClick, storyid, noteId, ideaId, menuOptions, onMenuClick } = props;

  const handleMenuClick = (action: string) => {
    if (ideaId && onMenuClick) {
      onMenuClick(action, ideaId); // 액션과 아이디어 ID 전달
    }
  };

  return (
    <StyledCard {...props} onClick={onClick}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {storyid &&
            <RouterLink to={`/storyboat/mystory/${storyid}`} style={{ textDecoration: 'none' }}>
              <Typography variant="h5" component="div">
                {title || 'Default Title'}
              </Typography>
            </RouterLink>
          }
          {noteId &&
            <RouterLink to={`/storyboat/mystory/${storyid}`} style={{ textDecoration: 'none', color: 'black' }}>
              <Typography variant="h5" component="div">
                {title || 'Default Title'}
              </Typography>
            </RouterLink>
          }
          {ideaId &&
            <Typography variant="h5" component="div">
              {title || 'Default Title'}
            </Typography>
          }
          <LongMenu options={menuOptions} onClick={handleMenuClick} />
        </Box>
        {content &&
          <Typography variant="body2">
            {content}
          </Typography>
        }
      </CardContent>
    </StyledCard>
  );
}

export default CustomCard;
