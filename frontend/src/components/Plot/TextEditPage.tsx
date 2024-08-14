import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';
import Quill from 'quill';
import { useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import axios from 'axios';

Quill.register('modules/cursors', QuillCursors);

const TextEditPage: React.FC = () => {
  const { storyId } = useParams();  // useParams를 사용하여 storyId를 추출
  const roomId = storyId?.toString() + "edit"
  const providerRef = useRef<WebrtcProvider | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const isComposingRef = useRef(false); // IME 입력 상태를 추적하기 위한 Ref

  const setEditorRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const ydoc = new Y.Doc();
        ydocRef.current = ydoc;

        // 추출한 storyId를 WebrtcProvider에 roomId로 사용
        const provider = new WebrtcProvider(roomId, ydoc, {
          signaling: ['wss://i11c107.p.ssafy.io/signal'],
        });
        providerRef.current = provider;

        const type = ydoc.getText('quill');

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

        new QuillBinding(type, editor, provider.awareness);

        editor.root.addEventListener('compositionstart', () => {
          isComposingRef.current = true;
        });

        editor.root.addEventListener('compositionend', () => {
          isComposingRef.current = false;
        });

        node.addEventListener('keydown', async (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            setSaveMessage('Saving...');

            try {
              const content = editor.getContents();
              const response = await axios.post('/api/save', {
                storyId,  // 저장 시에도 storyId 사용
                content,
              });
              if (response.status === 200) {
                setSaveMessage('Document saved successfully!');
              } else {
                setSaveMessage('Failed to save document.');
              }
            } catch (error) {
              setSaveMessage('Error saving document.');
            }

            setTimeout(() => setSaveMessage(null), 3000); // 메시지 3초 후 사라짐
          }
        });

        node.addEventListener('input', (event) => {
          if (isComposingRef.current) {
            event.stopImmediatePropagation(); // IME 조합 중인 상태에서는 전송 방지
          }
        });
      }
    },
    [storyId] // storyId가 변경될 때만 useCallback이 다시 실행되도록 의존성 배열에 추가
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

  return (
    <>
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            공동 소설 작성: 
          </Typography>
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
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }))}
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
