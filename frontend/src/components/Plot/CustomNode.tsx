import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeResizeControl, useReactFlow } from '@xyflow/react';
import { Button, Card, CardContent, CardHeader, CardActions, TextField } from '@mui/material';
import { styled } from '@mui/system';
import TextEditForm from './TextEditForm';
import { ResizeIcon } from '../../assets/asset';
import { useYjsReactFlowSync } from '../../hooks/useYjsReactFlowSync';
import { useParams } from 'react-router-dom';

export interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    content: string;
    text: string;
    isMain?: boolean;
  };
  deleteNode: (id: string) => void;
  handleSetMain: (id: string) => void;
}

const StyledButton = styled(Button)`
  background-color: #c1f0c1;
  border-radius: 4px;
  padding: 3px 5px;
  margin: 2px;
  min-width: 50px;
  min-height: 16px;
  font-size: small;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(95, 255, 146, 0.1);

  &:hover {
    background-color: #a8d5a8;
  }
`;

const controlStyle = {
  background: 'transparent',
  border: 'none',
  width: '10px',
  height: '10px',
};

const handleStyle = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: '#6a1b9a',
  border: '2px solid #ffffff',
  boxShadow: '0px 4px 8px rgba(106, 27, 154, 0.4)',
};

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, deleteNode }) => {
  const { storyId } = useParams<{ storyId: string }>();
  const roomId = storyId || `default_room_${Date.now()}`;
  const { updateNode } = useYjsReactFlowSync(roomId);
  const { setNodes } = useReactFlow();

  const [isEditingPlot, setEditingPlot] = useState(false);
  const [isTextEditDialogOpen, setTextEditDialogOpen] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [content, setContent] = useState(data.content);
  const [text, setText] = useState(data.text);

  useEffect(() => {
    // data.label이나 data.content가 변경되면 label과 content의 상태를 업데이트
    setLabel(data.label);
    setContent(data.content);
  }, [data.label, data.content]);

  const saveChanges = () => {
    const updatedData = { label, content, text };
    updateNode(id, { data: updatedData }); // Yjs와 React Flow 상태를 업데이트
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            data: updatedData,
          };
        }
        return n;
      })
    );
    setEditingPlot(false);
    setTextEditDialogOpen(false);
  };

  const handleDeleteNode = () => {
    deleteNode(id);
  };

  const handleEditText = () => {
    setTextEditDialogOpen(true);
  };

  const handleTextDialogClose = () => {
    setTextEditDialogOpen(false);
  };

  // const handleTextSave = (newText: string) => {
  //   setText(newText);
  //   updateNode(id, { data: { ...data, text: newText } });
  //   setTextEditDialogOpen(false);
  //   saveChanges(); 
  // };
  const handleTextSave = () => {
    setText('')
  };
  console.log(handleTextSave)

  const handlePlotSave = () => {
    saveChanges(); 
  };

  return (
    <>
      <NodeResizeControl style={controlStyle} minWidth={150} minHeight={150}>
        <ResizeIcon />
      </NodeResizeControl>

      <Card
        variant="outlined"
        style={{
          minWidth: '150px',
          minHeight: '100px',
          width: '100%',
          height: '100%',
          margin: '0px',
          padding: '0px',
          backgroundColor: data.isMain ? '#fff9c4' : 'white',
          border: data.isMain ? '2px solid #ffc107' : '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: data.isMain ? '0 0 10px rgba(255, 193, 7, 0.5)' : 'none',
        }}
      >
        <CardHeader
          title={isEditingPlot ? (
            <TextField
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          ) : (
            label
          )}
          titleTypographyProps={{ variant: 'subtitle1', align: 'center', fontSize: 'small', fontWeight: '600' }}
          style={{ backgroundColor: '#ffc9c9', padding: '2px' }}
        />
        <CardActions
          style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '0',
            WebkitJustifyContent: 'space-evenly',
          }}
        >
          <StyledButton onClick={() => setEditingPlot(!isEditingPlot)}>✒️플롯</StyledButton>
          <StyledButton onClick={handleEditText}>📝집필</StyledButton>
          <StyledButton onClick={handleDeleteNode}>❌삭제</StyledButton>
        </CardActions>

        <CardContent style={{ padding: '10px' }}>
          {isEditingPlot ? (
            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
              size="small"
              multiline
              fullWidth
            />
          ) : (
            <div style={{ padding: '10px' }}>{content}</div>
          )}
        </CardContent>

        {isEditingPlot && (
          <CardActions
            style={{
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              padding: '0',
            }}
          >
            <Button onClick={handlePlotSave} color="primary" variant="contained" size="small">
              Save
            </Button>
            <Button onClick={() => setEditingPlot(false)} color="secondary" variant="contained" size="small">
              Cancel
            </Button>
          </CardActions>
        )}
      </Card>

      <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: '-8px' }} />
      <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: '-8px' }} />

      <TextEditForm
        isOpen={isTextEditDialogOpen}
        onClose={handleTextDialogClose}
        // onSave={handleTextSave(text)}
        initialData={{text : text , label : label , content : content}}
        nodeId={id}
      />
    </>
  );
};

export default memo(CustomNode);
