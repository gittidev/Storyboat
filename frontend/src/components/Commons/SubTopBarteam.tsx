import { styled } from '@mui/system';
import { Box, Typography } from '@mui/material';

interface SubTopBarProps {
  title?: string;
  content?: string;
}

const StyledSubBar = styled(Box)`
  width: 100%;
  height: 50px;
  line-height: 60px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    flex-direction: column;
    line-height: 1.5;
    height: auto;
    padding: 8px;
  }

  .subbar-title {
    word-break: break-word;
  }

  .subbar-content {
    color: gray;
    margin-left: 8px;
    word-break: break-word;

    @media (max-width: 600px) {
      margin-left: 0;
    }
  }
`;

const SubTopBarteam = (props: SubTopBarProps) => {
  return (
    <StyledSubBar>
      <Typography variant="h5" component="span" className="subbar-title">
        {props.title}
      </Typography>
      <Typography variant="body2" component="span" className="subbar-content">
        {props.content}
      </Typography>
    </StyledSubBar>
  );
};

export default SubTopBarteam;
