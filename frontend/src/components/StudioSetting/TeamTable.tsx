import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LongMenu from '../Commons/LongMenu'; // LongMenu 컴포넌트 임포트
import "../../assets/stylesheets/custom-scrollbar.css";
import { MemberType } from '../../types/StudioType';
import axios from 'axios';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { useRecoilValue } from 'recoil';

const svURL = import.meta.env.VITE_SERVER_URL;

interface Column {
  id: 'penName' | 'role' | 'regDate' | 'setting';
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: any) => string; // format이 함수일 경우 타입 정의
}

const columns: readonly Column[] = [
  { id: 'penName', label: '멤버', minWidth: 100 },
  { id: 'role', label: '권한관리', minWidth: 100 },
  { id: 'regDate', label: '참여 날짜', minWidth: 150 },
  { id: 'setting', label: '설정', minWidth: 170 },
];

// interface Data {
//   penName: string;
//   role: string;
//   regDate: string;
// }

interface TeamTableProps {
  rows: MemberType[];
  setRows: React.Dispatch<React.SetStateAction<MemberType[]>>;
  studioId: string | number;
  handleMenuClick: (rowIndex: number, value: string) => void;
}

const TeamTable: React.FC<TeamTableProps> = ({ rows, studioId, handleMenuClick }) => {
  const [userRole, setUserRole] = useState<string>('');
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${svURL}/api/studios/${studioId}/my`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setUserRole(response.data.data);
      } catch (error) {
        console.error('사용자 역할을 불러오는 데 실패했습니다:', error);
      }
    };

    fetchUserRole();
  }, [studioId, accessToken]);

  // 팀원인 경우
  const teamOptions = [
    { label: '편집자 설정', value: 'editor' },
    { label: '팀에서 내보내기', value: 'expel', color: 'red' },
  ];

  // 편집자인 경우
  const teamOptionEditor = [
    { label: '팀원 설정', value: 'member' },
    { label: '팀에서 내보내기', value: 'expel', color: 'red' },
  ];

  // 팀 초대 요청인 경우
  const teamRequestOptions = [
    { label: '수락하기', value: 'accept' },
    { label: '거절하기', value: 'reject', color: 'red' },
  ];

  return (
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
            {rows.map((row, rowIndex) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'setting' ? (
                        userRole === 'ROLE_OWNER' && row.role !== '팀장' && (
                          <LongMenu
                            options={
                              row.role === '팀원' ? teamOptions
                                : row.role === '편집자' ? teamOptionEditor
                                : teamRequestOptions
                            }
                            onClick={(menuValue) => handleMenuClick(rowIndex, menuValue)}
                          />
                        )
                      ) : (
                        column.format ? column.format(value) : value
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
}

export default TeamTable;
