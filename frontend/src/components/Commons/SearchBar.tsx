import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

interface SearchBarProps {
    onSearch: (category: string, query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("title");
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = () => {
        onSearch(category, keyword);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        if (!keyword) {
            setIsFocused(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <FormControl 
                sx={{ 
                    minWidth: 120, 
                    marginRight: "10px", 
                    height: "40px"
                }}>
                <InputLabel>카테고리</InputLabel>
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as string)}
                    label="카테고리"
                    sx={{ height: "100%" }}
                >
                    <MenuItem value="title">제목</MenuItem>
                    {/* <MenuItem value="category">태그</MenuItem> */}
                </Select>
            </FormControl>

            <TextField
                variant="outlined"
                label={isFocused ? "" : "검색어 입력"}
                value={keyword}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress} 
                sx={{ 
                    marginRight: "10px", 
                    height: "40px",
                    "& .MuiInputBase-root": { height: "100%" },
                    "& .MuiInputLabel-root": { 
                        top: "50%", 
                        transform: "translateY(-50%)", 
                        zIndex: 1,
                        left: "12px",
                    }
                }}
            />
            <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleSearch}
                sx={{ height: "40px" }}
            >
                검색
            </Button>
        </Box>
    );
};
