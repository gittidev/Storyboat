import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';
import Quill from 'quill';
import { useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { SelectChangeEvent } from '@mui/material';
import { TextHistory } from '../Plot/HistoryDropdown';
import { myStudioState } from '../../recoil/atoms/studioAtom';

Quill.register('modules/cursors', QuillCursors);
const svURL = import.meta.env.VITE_SERVER_URL;

const TextEditPage: React.FC = () => {
  const { storyId } = useParams(); // useParams를 사용하여 storyId를 추출
  const roomId = storyId?.toString() + "edit";
  const providerRef = useRef<WebrtcProvider | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const editorRef = useRef<Quill | null>(null); // Quill 인스턴스를 저장하는 ref
  const nodeRef = useRef<HTMLDivElement | null>(null); // Editor node를 저장하는 ref
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const isComposingRef = useRef(false); // IME 입력 상태를 추적하기 위한 Ref
  const studioId = useRecoilValue(myStudioState);
  const token = useRecoilValue(accessTokenState);

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
      const response = await axios.get(`${svURL}/api/studios/${studioId}/stories/${storyId}/text/${textId}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      const script = JSON.parse(response.data.data);
      if (editorRef.current) {
        editorRef.current.clipboard.dangerouslyPasteHTML(script.text);
      }
    } catch (error) {
      console.error('히스토리 불러오기 실패', error)
    }
  }

  const saveDocument = async () => {
    if (editorRef.current) {
      setSaveMessage('Saving...');
      const content = editorRef.current.getContents().ops[0].insert;
      const data = {
        studioId: studioId,
        storyId: storyId,
        text: content
      };
      try {
        const response = await axios.put(`${svURL}/api/studios/${studioId}/stories/${storyId}/text`, data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          fetchTextHistories()
          setSaveMessage('Document saved successfully!');
        } else {
          setSaveMessage('Failed to save document.');
        }
      } catch (error) {
        setSaveMessage('Error saving document.');
      }

      setTimeout(() => setSaveMessage(null), 3000); // 메시지 3초 후 사라짐
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
      const script = JSON.parse(response.data.data);
      console.log(script)
      if (editorRef.current) {
        editorRef.current.clipboard.dangerouslyPasteHTML(script.text);
      }
    } catch (error) {
      console.error('원고를 가져오지 못하였습니다:', error);
    }
  }, [studioId, storyId, token]);

  const setEditorRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        nodeRef.current = node;
        const ydoc = new Y.Doc();
        const editor = new Quill(node, {
          modules: {
            cursors: true,
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              ['image', 'code-block'],
            ],
            history: {
              userOnly: true,
            },
          },
          placeholder: '집필 영역',
          theme: 'snow',
        });
        ydocRef.current = ydoc;
        editorRef.current = editor; // Save editor instance in ref

        const provider = new WebrtcProvider(roomId, ydoc, {
          signaling: ['wss://i11c107.p.ssafy.io/signal'],
        });
        providerRef.current = provider;

        const type = ydoc.getText('quill');
        new QuillBinding(type, editor, provider.awareness);

        editor.root.addEventListener('compositionstart', () => {
          isComposingRef.current = true;
        });

        editor.root.addEventListener('compositionend', () => {
          isComposingRef.current = false;
          provider.awareness.setLocalStateField('selection', editor.getSelection());
        });

        node.addEventListener('keydown', async (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            await saveDocument(); // Call saveDocument function on Ctrl+S
          }
        });

        node.addEventListener('input', (event) => {
          if (isComposingRef.current) {
            event.stopImmediatePropagation(); // IME 조합 중인 상태에서는 전송 방지
          } else{
            provider.awareness.setLocalStateField('selection', editor.getSelection());
          }
        });

        fetchText(); // Initial fetch text on editor setup
        fetchTextHistories();
      }
    },
    [storyId, roomId, studioId, fetchText] // Add dependencies for the callback
  );

  useEffect(() => {
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
  }, []);

  const handleHistoryChange = (event: SelectChangeEvent<string>) => {
    const selectedTextId = event.target.value as string;
    setSelectedTextHistory(selectedTextId);
    fetTextHistoryData(selectedTextId)
  };

  return (
    <>
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            공동 소설 작성:
          </Typography>
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
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="body1">{saveMessage ? saveMessage : 'Ctrl+S to save your changes'}</Typography>
          <Tooltip title="Save Document">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={saveDocument} // 버튼 클릭 시 saveDocument 함수 호출
            >
              Save
            </Button>
          </Tooltip>
        </Box>
        <Box
          ref={setEditorRef}
          sx={{
            flexGrow: 1,
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: 2,
            backgroundColor: '#f9f9f9',
            overflowY: 'auto',
          }}
        />
      </Box>
    </>
  );
};

export default TextEditPage;
