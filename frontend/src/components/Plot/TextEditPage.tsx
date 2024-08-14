import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, AppBar, Toolbar, Typography, TextField, IconButton, Chip, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { selectedStudioState } from '../../recoil/atoms/studioAtom';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { nameState } from '../../recoil/atoms/userAtom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';

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
  const studioId = useRecoilValue(selectedStudioState);
  const token = useRecoilValue(accessTokenState);
  // const userId = useRecoilValue(userState);
  const userName = useRecoilValue(nameState);

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebrtcProvider(roomId, ydoc, {
      signaling: ['wss://i11c107.p.ssafy.io/signal'],
    });
    providerRef.current = provider;

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

  const handleLineClick = (id: string) => {
    setEditingId(id);
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
          // fetchTextHistories()
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  const fetchText = useCallback(async () => {
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
        ydocRef.current.transact(() => {
          sharedArray.delete(0, sharedArray.length);
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
  }, [studioId, storyId, token]);

  useEffect(() => {
    fetchText()
  }, []);

  return (
    <>
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            공동 소설 작성:
          </Typography>
          <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
            {activeUsers.map((user, index) => (
              <Chip key={index} label={user} color="primary" variant="outlined" />
            ))}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            startIcon={isViewerMode ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onClick={toggleViewerMode}
          >
            {isViewerMode ? 'Edit Mode' : 'Viewer Mode'}
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2, flexGrow: 1, overflowY: 'auto' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sentences">
            {(provided : any) => (
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
                    {(provided : any) => (
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
                        {!isViewerMode && (
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
                    <IconButton onClick={handleAddNewSentenceAtBottom} color="primary">
                      <AddIcon />
                    </IconButton>
                    <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveToList}
                          sx={{ ml: 2 }}
                        >
                          저장
                        </Button>
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
