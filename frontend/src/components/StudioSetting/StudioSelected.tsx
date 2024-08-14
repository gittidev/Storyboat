import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedStudioState, studioListState } from '../../recoil/atoms/studioAtom';
import IconButton from '@mui/material/IconButton';
import { Diversity2Icon } from '../Commons/Icons';

import { useSetRecoilState } from 'recoil';
import { accessTokenState } from '../../recoil/atoms/authAtom';

import { fetchStudios } from '../../utils/studioUtils';

interface StudioSelectedProps {
  listopen: boolean;
}


const StudioSelected: React.FC<StudioSelectedProps> = ({ listopen }) => {
  const setStudios = useSetRecoilState(studioListState);
  const accessToken = useRecoilValue(accessTokenState)
  console.log('StudioSelected:',accessToken)
  
  useEffect(() => {
    const loadStudios = async () => {
      console.log('Access Token:', accessToken); // 액세스 토큰 확인
      fetchStudios(accessToken, setStudios);
    };

    loadStudios();

  }, [setStudios]); // setStudios가 변경될 때마다 useEffect 실행

  

  const [selectedStudioId, setSelectedStudio] = useRecoilState(selectedStudioState);
  const studios = useRecoilValue(studioListState);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedStudio(event.target.value);
    navigate('/storyboat/storybox')
  };

  useEffect(() => {
    console.log(selectedStudioId);
  }, [selectedStudioId]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {listopen ? (
        <FormControl
          sx={{
            m: 1,
            minWidth: 200,
            transition: 'min-width 0.3s ease-in-out'
          }}
        >
          <InputLabel id="studio-select-label">Studio</InputLabel>
          <Select
            labelId="studio-select-label"
            id="studio-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={selectedStudioId}
            label="Studio"
            onChange={handleChange}
            sx={{
              minWidth: 200,
              transition: 'min-width 0.3s ease-in-out',
            }}
          >
            {studios.map((studio) => (
              <MenuItem key={studio.studioId} value={studio.studioId}>
                {studio.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <IconButton
            onClick={handleOpen}
            sx={{
              m: 1,
              minWidth: 50,
              transition: 'min-width 0.3s ease-in-out'
            }}
          >
            <Diversity2Icon />
          </IconButton>
          {open && (
            <FormControl
              sx={{
                m: 1,
                minWidth: 200,
                transition: 'min-width 0.3s ease-in-out',
                position: 'absolute',
                zIndex: 1000,
                backgroundColor: 'white',
              }}
            >
              <InputLabel id="studio-select-label">Studio</InputLabel>
              <Select
                labelId="studio-select-label"
                id="studio-select"
                open={open}
                onClose={handleClose}
                value={selectedStudioId}
                label="Studio"
                onChange={handleChange}
                sx={{
                  minWidth: 200,
                  transition: 'min-width 0.3s ease-in-out',
                }}
              >
                {studios.map((studio) => (
                  <MenuItem key={studio.studioId} value={studio.studioId}>
                    {studio.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </>
      )}
    </div>
  );
};

export default StudioSelected;
