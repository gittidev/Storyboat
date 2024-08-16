import React, { useEffect, useRef, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { Box, AppBar, Toolbar, Typography, TextField, IconButton, Chip, Button, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as Y from 'yjs';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { WebrtcProvider } from 'y-webrtc';
import { useParams } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { selectedStudioState } from '../../recoil/atoms/studioAtom';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { nameState } from '../../recoil/atoms/userAtom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';
import { TextHistory } from './HistoryDropdown';
import DownloadIcon from '@mui/icons-material/Download';

const svURL = import.meta.env.VITE_SERVER_URL;

interface Sentence {
  id: string;
  text: string;
  author: string;
  lastEditor: string;
  lastEditTime: number;
  isEditing?: boolean; // 다른 사용자가 작성 중인지 표시
}

const TextEditPage: React.FC = () => {
  const { storyId } = useParams();
  const roomId = storyId?.toString() + 'edit';
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebrtcProvider | null>(null);
  const [content, setContent] = useState<Sentence[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isViewerMode, setIsViewerMode] = useState<boolean>(false);
  const [isCheckMode, setIsCheckMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [fullText, setFullText] = useState<string>('');

  const studioId = useRecoilValue(selectedStudioState);
  const token = useRecoilValue(accessTokenState);
  const userName = useRecoilValue(nameState);
  // const [epubUrl, setEpubUrl] = useState<string | null>(null);
  // const viewerRef = useRef<any>(null);

  const [Texthistories, setTextHistories] = useState<TextHistory[]>([])
  const [selectedTextHistory, setSelectedTextHistory] = useState<string | null>(null)



  const fetchTextHistories = async () => {
    try {
      const response = await axios.get(`${svURL}/api/studios/${studioId}/stories/${storyId}/text/histories`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      console.log(response.data.data.content)
      setTextHistories(response.data.data.content);
    } catch (error) {
      console.error(error)
    }
  }

  const fetTextHistoryData = async (textId: string) => {
    try {
      const response = await axios.get(`${svURL}/api/studios/${studioId}/stories/${storyId}/text/${textId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      const script: Sentence[] = JSON.parse(response.data.data);
      if (ydocRef.current) {
        // ydocRef.current.clipboard.dangerouslyPasteHTML(script.text);
        const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
        ydocRef.current.transact(() => {
          sharedArray.delete(0, sharedArray.length);
          sharedArray.insert(0, script);
        });
      }
    } catch (error) {
      console.error('히스토리 불러오기 실패', error)
    }
  }

  useEffect(() => {
    // const ydoc = new Y.Doc();
    // ydocRef.current = ydoc;

    if (!ydocRef.current) {
      ydocRef.current = new Y.Doc();
    }

    const ydoc = ydocRef.current

    if (!providerRef.current) {
      providerRef.current = new WebrtcProvider(roomId, ydocRef.current, {
        signaling: ['wss://i11c107.p.ssafy.io/signal'],
      });
    } else {
      providerRef.current.connect();
    }
    const provider = providerRef.current;

    const sharedArray = ydoc.getArray<Sentence>('sentences');

    sharedArray.observe(() => {
      setContent(sharedArray.toArray());
    });

    provider.awareness.setLocalStateField('user', { name: userName });
    provider.awareness.on('change', () => {
      const users = Array.from(provider.awareness.getStates().values())
        .map((state: any) => state.user?.name)
        .filter((name): name is string => !!name);
      setActiveUsers(users);
      // console.log(users)
    });

    return () => {
      if (providerRef.current) {
        providerRef.current.disconnect();
        providerRef.current = null;
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
        ydocRef.current = null;
      }
    };
  }, [roomId, userName]);

  const handleAddNewSentenceAtBottom = () => {
    if (ydocRef.current) {
      const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
      const newSentence: Sentence = {
        id: Date.now().toString(),
        text: '',
        author: userName,
        lastEditor: userName,
        lastEditTime: Date.now(),
        isEditing: true,
      };
      sharedArray.push([newSentence]); // 맨 밑에 추가
      setEditingId(newSentence.id);
    }
  };

  const handleAddNewSentenceBelow = (index: number) => {
    if (ydocRef.current) {
      const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
      const newSentence: Sentence = {
        id: Date.now().toString(),
        text: '',
        author: userName,
        lastEditor: userName,
        lastEditTime: Date.now(),
        isEditing: true,
      };
      sharedArray.insert(index + 1, [newSentence]); // 현재 줄 아래에 추가
      setEditingId(newSentence.id);
    }
  };

  const handleDelete = (id: string) => {
    if (ydocRef.current) {
      const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
      const index = sharedArray.toArray().findIndex(s => s.id === id);
      if (index !== -1) {
        sharedArray.delete(index, 1);
      }
    }
  };

  const handleBulkDelete = () => {
    if (ydocRef.current) {
      const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
      setContent((prevContent) => {
        const newContent = prevContent.filter((sentence) => !selectedIds.has(sentence.id));
        sharedArray.delete(0, sharedArray.length);
        sharedArray.insert(0, newContent);
        return newContent;
      });
      setSelectedIds(new Set()); // 선택된 항목 초기화
    }
  };

  const handleLineClick = (id: string) => {
    if (!isCheckMode) {
      setEditingId(id);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSave = (id: string, newText: string) => {
    if (ydocRef.current) {
      const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
      const index = sharedArray.toArray().findIndex(s => s.id === id);
      if (index !== -1) {
        const updatedSentence: Sentence = {
          ...sharedArray.get(index),
          text: newText,
          lastEditor: userName,
          lastEditTime: Date.now(),
          isEditing: false,
        };
        sharedArray.delete(index, 1);
        sharedArray.insert(index, [updatedSentence]);
      }
      setEditingId(null);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(content);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    if (ydocRef.current) {
      const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
      ydocRef.current.transact(() => {
        sharedArray.delete(0, sharedArray.length);
        sharedArray.insert(0, items);
      });
    }
  };

  // Add new sentence by Enter key
  const handleKeyPress = (event: React.KeyboardEvent, id: string, index: number, newText: string) => {
    if (event.key === 'Enter') {
      handleSave(id, newText);
      handleAddNewSentenceBelow(index); // 현재 줄 아래에 새 문장 추가
    }
  };

  const toggleViewerMode = () => {
    setIsViewerMode(!isViewerMode);
  };

  const toggleCheckMode = () => {
    setIsCheckMode(!isCheckMode);
    setSelectedIds(new Set()); // 체크모드가 변경될 때 선택된 항목 초기화
  };

  const handleSelectAll = () => {
    if (selectedIds.size === content.length) {
      setSelectedIds(new Set()); // 모든 선택 해제
    } else {
      const allIds = new Set(content.map((sentence) => sentence.id));
      setSelectedIds(allIds); // 모든 항목 선택
    }
  };

  const handleSaveToList = async () => {
    if (ydocRef.current) {
      const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
      const data = sharedArray.toArray();

      try {
        const response = await axios.put(`${svURL}/api/studios/${studioId}/stories/${storyId}/text`, data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log(response.data)
          console.log('저장성공')
          fetchTextHistories()
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  const makeEpub = async () => {
    try {
      const response = await axios.get(`${svURL}/api/studios/${studioId}/stories/${storyId}/text`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const script: Sentence[] = JSON.parse(response.data.data);
      console.log(script)
      const combinedText = script.map(sentence => sentence.text).join(' ');

      // Store the combined text in state
      setFullText(combinedText);

      console.log(combinedText);
    } catch (error) {
      console.error()
    }
  }

  const generateEpub = () => {
    makeEpub()
    const text = fullText
    // generatePdf (text)
    const blob = new Blob([text], { type: 'text/plain' })

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a')
    a.href = url;
    a.download = 'file.txt'

    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }


  // const makeFile = () => {
  //   // makeEpub()
  //   generateEpub()
  // }

  const fetchText = async () => {
    try {
      const response = await axios.get(`${svURL}/api/studios/${studioId}/stories/${storyId}/text`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const script: Sentence[] = JSON.parse(response.data.data);
      if (ydocRef.current) {
        const sharedArray = ydocRef.current.getArray<Sentence>('sentences');
        ydocRef.current?.transact(() => {
          while (sharedArray.length > 0) {
            sharedArray.delete(sharedArray.length - 1, 1);
          }
          // sharedArray.delete(0, sharedArray.length);
          sharedArray.insert(0, script);
        });
      }
      console.log(script)
      // if (ydocRef.current) {
      //   ydocRef.current.clipboard.dangerouslyPasteHTML(script.text);
      // }
    } catch (error) {
      console.error('원고를 가져오지 못하였습니다:', error);
    }
  };

  const handleHistoryChange = (event: SelectChangeEvent<string>) => {
    const selectedTextId = event.target.value as string;
    setSelectedTextHistory(selectedTextId);
    fetTextHistoryData(selectedTextId)
  };

  useEffect(() => {
    // fetchText()
    // fetchTextHistories()
    async function initialize() {
      if (ydocRef.current) {
        const ydoc = ydocRef.current;

        // sharedArray 초기화 대기
        const sharedArray = await waitForSharedArrayInitialization(ydoc);

        if (sharedArray) {
          await fetchText(); // sharedArray 초기화 후 fetchText 실행
          fetchTextHistories();
        } else {
          console.error("sharedArray 초기화 실패");
        }
      }
    }

    initialize();
  }, [studioId, storyId]);

  async function waitForSharedArrayInitialization(ydoc: Y.Doc): Promise<Y.Array<Sentence>> {
    return new Promise((resolve) => {
      const sharedArray = ydoc.getArray<Sentence>('sentences');

      // sharedArray가 초기화되었는지 확인
      if (sharedArray.length > 0) {
        resolve(sharedArray);
      } else {
        // 옵저버를 사용하여 sharedArray가 초기화될 때까지 대기
        sharedArray.observe(() => {
          if (sharedArray.length > 0) {
            resolve(sharedArray);
          }
        });
      }
    });
  }

return (
  <>
    <AppBar position="relative" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          공동 소설 작성
        </Typography>
        <Box sx={{ ml: 2 }}> {/* Adds left margin */}
          <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
            <InputLabel id="history-select-label">History</InputLabel>
            <Select
              labelId="history-select-label"
              value={selectedTextHistory || ''}
              onChange={handleHistoryChange}
              label="History"
            >
              {Texthistories.map((textHistory) => (
                <MenuItem key={textHistory.textId} value={textHistory.textId}>
                  {`${textHistory.dateTime} - ${textHistory.penName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="저장">
            <IconButton
              onClick={handleSaveToList}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {activeUsers.map((user, index) => (
          <Chip key={index} label={user} color="primary" variant="outlined" />
        ))}
        <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="새로고침">
          <IconButton onClick={fetchText}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="txt로 내보내기">
          <IconButton onClick={generateEpub}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={isViewerMode ? '편집모드' : '뷰어모드'}>
          <IconButton
            onClick={toggleViewerMode}
          >
            {isViewerMode ? <VisibilityOffIcon /> : <VisibilityIcon />}
            {/* {isViewerMode ? 'Edit Mode' : 'Viewer Mode'} */}
          </IconButton>

        </Tooltip>
        <Tooltip title={isCheckMode ? '취소' : '체크모드'} >
          <IconButton
            onClick={toggleCheckMode}
          // Tooltip text
          >
            {isCheckMode ? <CancelIcon /> : <CheckBoxIcon />}
          </IconButton>

        </Tooltip>
        {/* <Button
            startIcon={isCheckMode ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            variant="contained"
            color="secondary"
            onClick={toggleCheckMode}
          >
            {isCheckMode ? 'Cancel' : 'Check Mode'}
          </Button> */}
        {isCheckMode && (
          <Tooltip title="모두 선택">
            <IconButton onClick={handleSelectAll}>
              <SelectAllIcon />
            </IconButton>

          </Tooltip>
          // <Button
          //   variant="contained"
          //   color="warning"
          //   startIcon={<SelectAllIcon />}
          //   onClick={handleSelectAll}
          //   sx={{ ml: 1 }}
          // >
          //   {selectedIds.size === content.length ? 'Deselect All' : 'Select All'}
          // </Button>
        )}
        {isCheckMode && selectedIds.size > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleBulkDelete}
            sx={{ ml: 1 }}
          >
            Delete Selected
          </Button>
        )}
      </Toolbar>
    </AppBar>
    <Box sx={{ padding: 2, flexGrow: 1, overflowY: 'auto' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sentences">
          {(provided: any) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                marginTop: 2,
                padding: 2,
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
              }}
            >
              {content.map((sentence, index) => (
                <Draggable key={sentence.id} draggableId={sentence.id} index={index}>
                  {(provided: any) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        position: 'relative',
                        '&:hover .action-icons, &:hover .drag-icon': { opacity: 1 }
                      }}
                      onClick={() => handleLineClick(sentence.id)}
                    >
                      {!isViewerMode && (
                        <Box
                          {...provided.dragHandleProps}
                          className="drag-icon"
                          sx={{
                            mr: 1,
                            color: 'lightgray',
                            fontSize: '20px',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                          }}
                        >
                          <DragIndicatorIcon />
                        </Box>
                      )}
                      {isCheckMode && (
                        <Checkbox
                          checked={selectedIds.has(sentence.id)}
                          onClick={(e) => e.stopPropagation()} // 이벤트 전파를 막음
                          onChange={() => toggleSelect(sentence.id)}
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                      )}
                      {editingId === sentence.id && !isViewerMode ? (
                        <TextField
                          fullWidth
                          variant="outlined"
                          defaultValue={sentence.text}
                          onBlur={(e) => handleSave(sentence.id, e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, sentence.id, index, (e.target as HTMLInputElement).value)}
                          autoFocus
                          sx={{ fontSize: '0.875rem' }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ flexGrow: 1, fontSize: '0.875rem' }}>
                          {sentence.text
                            ? sentence.text
                            : sentence.isEditing
                              ? <em>작성 중...</em>
                              : ""}
                        </Typography>
                      )}
                      {!isViewerMode && !isCheckMode && (
                        <Box
                          className="action-icons"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            position: 'absolute',
                            right: 0
                          }}
                        >
                          <Chip label={sentence.lastEditor} size="small" sx={{ mr: 1 }} />
                          <IconButton size="small" onClick={() => handleDelete(sentence.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {!isViewerMode && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <IconButton onClick={handleAddNewSentenceAtBottom}>
                    <AddIcon />
                  </IconButton>

                </Box>
              )}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  </>
);
};

export default TextEditPage;
