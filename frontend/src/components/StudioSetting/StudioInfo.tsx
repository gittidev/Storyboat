import React from 'react';
import { useRecoilValue } from 'recoil';
import { selectedStudioState } from '../../stores/studioAtom';
import { Box, Typography } from '@mui/material';

const StudioInfo: React.FC = () => {
  const selectedStudio = useRecoilValue(selectedStudioState);

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h6">선택된 스튜디오 정보</Typography>
      <Typography variant="body1">
        {selectedStudio ? `선택된 스튜디오: ${selectedStudio}` : '스튜디오가 선택되지 않았습니다.'}
      </Typography>
    </Box>
  );
};

export default StudioInfo;
