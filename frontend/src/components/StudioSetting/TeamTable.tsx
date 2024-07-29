import Paper from '@mui/material/Paper';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LongMenu from '../Commons/LongMenu'; // LongMenu 컴포넌트 임포트
import "../../assets/stylesheets/custom-scrollbar.css";

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
  const handleOptionClick = (option: string) => {
    console.log('Option clicked:', option);
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                        // 권한 여부에 따라 다르게 랜더링 해주기 (추가작업)
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'setting' ? <LongMenu options={['수락하기', '거절하기', '팀에서 제거하기']} onClick={handleOptionClick} /> : (
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
