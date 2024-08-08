import { styled } from "@mui/system";
import { Card, CardContent, Typography, Box } from "@mui/material";
import LongMenu, {Option} from "../Commons/LongMenu";
interface MyIdeaBoxProps {
  ideaId?: number;
  title?: string;
  content?: string;
  onClick?: () => void;
  width?: string;
  height?: string;
  menuOptions?: Option[];
  onMenuClick?: (action: string, ideaId: number) => void;
}

const StyledCard = styled(Card) <MyIdeaBoxProps>`
  border-radius: 8px;
  border :  1px solid #D1D5DB;
  margin:5px;
  cursor: pointer;
  width: ${(props) => props.width || '260px'};
  height: ${(props) => props.height || '100px'};
  :hover {
    transform : translateX(10px) ;
    transition: transform 0.1s ease-in-out;
  }
`;



const MyIdeaBox: React.FC<MyIdeaBoxProps> = (props) => {
  const { title, content, onClick, ideaId, menuOptions=[], onMenuClick } = props
  // const menuOptions = ['move to Studio', 'delete']
  const handleMenuClick = (value: string) => {
    if (onMenuClick && ideaId !== undefined) {
      onMenuClick(value, ideaId);
    } else {
      console.warn('onMenuClick is undefined or ideaId is missing');
    }
  };
  return (
    <StyledCard {...props} onClick={onClick}>


      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

        {ideaId &&
          // <RouterLink to={`/storyboat/mystory/${storyId}`} style={{ textDecoration: 'none', color: 'black' }}>
            <Typography variant="h5" component="div">
              {title || 'Default Title'}
            </Typography>
          // </RouterLink>
          }
        <LongMenu options={menuOptions} onClick={handleMenuClick} />
        </Box>

        {/* content가 있는 경우에만 렌더링 */}
        {content &&
          (<Typography variant="body2">
            {content}
          </Typography>)}
      </CardContent>
    </StyledCard>
  );
}

export default MyIdeaBox;
