import React, { useState } from 'react';
import { Container, List, ListItem, ListItemText, Pagination, Typography, Box, Divider } from '@mui/material';
import dayjs from 'dayjs'; // 날짜 포맷을 위한 라이브러리
import SubTopBar from '../components/SubTopBar';
import CustomButton from '../components/CustomButton';



// 더미 데이터 생성
const generateDummyData = (num: number) => {
  return Array.from({ length: num }, (_, index) => ({
    id: index + 1,
    title: `스토리 ${index + 1}`,
    description: `스토리 ${index + 1}의 설명입니다.`,
    createdDate: dayjs().subtract(index, 'day').format('YYYY-MM-DD'), // 생성일자
  }));
};

const dummyData = generateDummyData(100); // 총 100개의 더미 데이터

const StoryEditPage: React.FC = () => {
  // 페이지네이션 상태 관리
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  // 현재 페이지에 해당하는 데이터 추출
  const currentItems = dummyData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    console.log(event)
  };

  return (
    <>
   
      <SubTopBar title={'스튜디오 스토리'}/>
            <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green"/>
      <List>
        {currentItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem>
              <ListItemText
                primary={item.title}
                secondary={
                  <>
                    <div>{item.description}</div>
                    <div>생성일: {item.createdDate}</div>
                  </>
                }
              />
            </ListItem>
            {/* Divider 컴포넌트를 사용하여 항목 사이에 선 추가 */}
            {index < currentItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      </>
  );
};

export default StoryEditPage;