import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Drawer, Box, AppBar, Toolbar, Typography, IconButton, Button, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';
import QuillCursors from 'quill-cursors';
import Quill from 'quill';
import { useParams } from 'react-router-dom';
import 'quill/dist/quill.snow.css';
import axios from 'axios';
// import { useRecoilState } from 'recoil';
// import { editorContentState } from '../../recoil/atoms/editorAtom';


interface TextEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  initialData: {text : string , label : string, content : string, isMain? : boolean}
  // onSave: (text:string)=>void;
}

Quill.register('modules/cursors', QuillCursors)

const TextEditForm: React.FC<TextEditFormProps> = ({ isOpen, onClose, nodeId, initialData }) => {
  const { storyId } = useParams<{ storyId: string }>();
  const roomId = nodeId + storyId;
  const providerRef = useRef<WebrtcProvider | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [drawerWidth, ] = useState(900);
  const setEditorRef = useCallback((node: HTMLDivElement | null) => {

    if (node) {
      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;

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

      node.addEventListener('keydown', async (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
          event.preventDefault();
          setSaveMessage('Saving...');

          try {
            const content = editor.getContents();
            const response = await axios.post('/api/save', {
              storyId,
              nodeId,
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
    }
  }, [roomId, storyId, nodeId]);

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


  //  // 크기 조절 핸들러
  //  const handleMouseDown = (e: React.MouseEvent) => {
  //   const startX = e.clientX;
  //   const startWidth = drawerWidth;

  //   const onMouseMove = (e: MouseEvent) => {
  //     const newWidth = startWidth - (e.clientX - startX);
  //     setDrawerWidth(Math.max(newWidth, 300)); // 최소 너비 300px 설정
  //   };

  //   const onMouseUp = () => {
  //     document.removeEventListener('mousemove', onMouseMove);
  //     document.removeEventListener('mouseup', onMouseUp);
  //   };

  //   document.addEventListener('mousemove', onMouseMove);
  //   document.addEventListener('mouseup', onMouseUp);
  // };



  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: drawerWidth, padding: 2 } }}
    >
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            공동 소설 작성: {initialData.label}
          </Typography>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="body1">
            {saveMessage ? saveMessage : 'Ctrl+S to save your changes'}
          </Typography>
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
    </Drawer>
  );
};

export default TextEditForm;
