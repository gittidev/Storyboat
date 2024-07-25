// import React from 'react';
import Paper from '@mui/material/Paper';
import { Table as MuiTable } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LongMenu from '../LongMenu'; // LongMenu 컴포넌트 임포트
import "../../assets/stylesheets/custom-scrollbar.css"


interface Column {
  id: 'name' | 'role' | 'date' | 'invitation' | 'setting';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: '멤버', minWidth: 100 },
  { id: 'role', label: '권한관리', minWidth: 100 },
  { id: 'date', label: '참여 날짜', minWidth: 150 },
  { id: 'invitation', label: '초대 여부', minWidth: 170 },
  { id: 'setting', label: '설정', minWidth: 170 },
];

interface Data {
  name: string;
  role: string;
  date: string;
  invitation: string;
}

function createData(
  name: string,
  role: string,
  date: string,
  invitation: string,
): Data {
  return { name, role, date, invitation };
}

const rows = [
  createData('Alice', '팀장', '2024-01-01', '참여'),
  createData('Bob', '개발자', '2023-12-01', '참여'),
  createData('Charlie', '디자이너', '2023-11-01', '초대 대기'),
  createData('David', '마케터', '2023-10-01', '참여'),
  createData('Eve', '팀원', '2023-09-01', '참여'),
  createData('Frank', '팀원', '2023-08-01', '참여'),
  createData('Grace', '팀원', '2023-07-01', '초대 대기'),
  createData('Hannah', '팀원', '2023-06-01', '참여'),
  createData('Ivy', '팀원', '2023-05-01', '참여'),
  createData('Jack', '팀원', '2023-04-01', '초대 대기'),
];

export default function TeamTable() {
  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }} >
        <TableContainer sx={{ maxHeight: 440 }} className='custom-scrollbar'>
          <MuiTable stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof Data];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'setting' ? <LongMenu /> : (
                            column.format && typeof value === 'number'
                              ? column.format(value)
                              : value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </Paper>
    </>
  );
}
