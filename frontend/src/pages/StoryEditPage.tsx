import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Pagination,
  Box,
  Divider,
} from "@mui/material";
import dayjs from "dayjs"; // 날짜 포맷을 위한 라이브러리
import SubTopBar from "../components/Commons/SubTopBar";
import CustomButton from "../components/Commons/CustomButton";
import { BorderBox } from "../components/Commons/BorderBox";

// 더미 데이터 생성
const generateDummyData = (num: number) => {
  return Array.from({ length: num }, (_, index) => ({
    id: index + 1,
    title: `스토리 ${index + 1}`,
    description: `스토리 ${index + 1}의 설명입니다.`,
    createdDate: dayjs().subtract(index, "day").format("YYYY-MM-DD"), // 생성일자
  }));
};

const dummyData = generateDummyData(100); // 총 100개의 더미 데이터

const StoryEditPage: React.FC = () => {
  // 페이지네이션 상태 관리
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  // 현재 페이지에 해당하는 데이터 추출
  const currentItems = dummyData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // 페이지 변경 핸들러
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    console.log(event);
  };

  return (
    <>
    
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0px 20px 20px 20px"}}>
        <Box sx={{ flexGrow: 1 }}>
          <SubTopBar
            title={"스튜디오 STORY 집필하기"}
            content="작성된 story의 메인플롯을 집필해보세요"
          />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <CustomButton
            content="+ 생성하기"
            bgcolor="#77E4C8" hoverBgColor="#4C3BCF"
          />
        </Box>
      </Box>

      {/* 화면에 들어갈 내역 */}
      <BorderBox>
        {/* 스토리 보관함 스토리 리스트  */}
        <List>
          {currentItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemText sx={{display : "flex"}}
                  primary={item.title}
                  secondary={
                    <>
                      <span>{item.description}</span>
                      <span>생성일: {item.createdDate}</span>
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
      </BorderBox>
    </>
  );
};

export default StoryEditPage;
