import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

interface SearchBarProps {
    onSearch: (category: string, query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("title"); // 기본 카테고리는 title로 설정

    const handleSearch = () => {
        onSearch(category, keyword);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            
            <div className="SearchBarbody " style={{ marginTop: '15px', marginBottom: '15px' }}>

           
            <FormControl 
                sx={{ 
                    minWidth: 120, 
                    marginRight: "10px", 
                    height: "40px" // 버튼과 같은 높이로 설정
                }}>
                <InputLabel>카테고리</InputLabel>
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as string)}
                    label="카테고리"
                    sx={{ height: "100%" }} // FormControl의 높이에 맞추기
                >
                    <MenuItem value="title">제목</MenuItem>
                    <MenuItem value="category">카테고리</MenuItem>
                </Select>
            </FormControl>
            </div>
            <TextField
                variant="outlined"
                label="검색어 입력"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                sx={{ 
              
                    marginRight: "10px", 
                    height: "40px",
                    "& .MuiInputBase-root": { height: "100%" }, // TextField 높이 맞추기
                    "& .MuiInputLabel-root": { 
                        top: "50%", // 레이블을 중앙에 맞추기
                        transform: "translateY(-50%)", // 중앙 정렬을 위한 변환
                        zIndex: 1, // 레이블이 입력 필드 위에 보이도록 설정
                        left: "12px",
                    }
                }}
            />
            <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleSearch}
                sx={{ height: "40px" }} // 버튼 높이 설정
            >
                검색
            </Button>
        </Box>
    );
};
