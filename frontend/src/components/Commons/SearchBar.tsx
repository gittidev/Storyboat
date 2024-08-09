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
            <FormControl sx={{ minWidth: 120, marginRight: "10px" }}>
                <InputLabel>카테고리</InputLabel>
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as string)}
                    label="카테고리"
                >
                    <MenuItem value="title">제목</MenuItem>
                    <MenuItem value="category">카테고리</MenuItem>
                </Select>
            </FormControl>
            <TextField
                variant="outlined"
                label="검색어 입력"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                sx={{ marginRight: "10px" }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                검색
            </Button>
        </Box>
    );
};
