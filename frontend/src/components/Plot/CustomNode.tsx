import React, { memo, useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeResizeControl, useReactFlow } from '@xyflow/react';
import { Button, Card, CardContent, CardHeader, CardActions, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

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
        onNodeClick?: (id: string) => void;
    };
    deleteNode: (id: string) => void;
    handleSetMain: (id: string) => void;
}


const controlStyle = {
    background: 'transparent',
    border: 'none',
    width: '20px',
    height: '20px',
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
    const [label, setLabel] = useState(data.label);
    const [content, setContent] = useState(data.content);
    const [isMain, setIsMain] = useState(data.isMain);

    useEffect(() => {
        setLabel(data.label);
        setContent(data.content);
        setIsMain(data.isMain);
    }, [data.label, data.content, data.isMain]);

    const saveChanges = useCallback(() => {
        const updatedData = { label, content, isMain };
        updateNode(id, { data: updatedData });
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
    }, [id, label, content, isMain, updateNode, setNodes]);

    const handleDeleteNode = useCallback(() => {
        if (typeof deleteNode === 'function') {
            deleteNode(id);
        } else {
            console.error('deleteNode is not a function');
        }
    }, [deleteNode, id]);

    const handleEditText = useCallback(() => {
        setEditingPlot(!isEditingPlot);
    }, [isEditingPlot]);

    const handleClick = () => {
        if (data.onNodeClick) {
            data.onNodeClick(id);
            // console.log(`${id}가 클릭됨, isMain: ${data.isMain}`);
        }
    };

    return (
        <>
            <NodeResizeControl style={controlStyle} minWidth={200} minHeight={200}>
                <ResizeIcon/>
            </NodeResizeControl>

            <Card
                variant="outlined"
                style={{
                    minWidth: '200px',
                    minHeight: '150px',
                    width: '100%',
                    height: '100%',
                    margin: '0px',
                    padding: '0px',
                    // backgroundColor: isMain ? 'rgba(255, 223, 186, 0.9)' : 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    border: isMain ? '2px solid #ff9800' : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: isMain ? '0 4px 30px rgba(255, 152, 0, 0.5)' : '0 4px 30px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                }}
                onClick={handleClick}
            >
                <CardHeader
                    title={isEditingPlot ? (
                        <TextField
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            multiline
                            rows={1}
                            maxRows={3}
                            style={{ transition: 'height 0.2s ease-in-out' }}
                        />
                    ) : (
                        label
                    )}
                    titleTypographyProps={{ variant: 'subtitle1', align: 'center', fontSize: 'small', fontWeight: '600' }}
                    style={{
                        backgroundColor: '#e0f7fa',
                        padding: '8px',
                        borderBottom: '1px solid #b2ebf2',
                    }}
                    action={
                        <>
                            <IconButton onClick={handleEditText} size="small">
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={handleDeleteNode} size="small">
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                />

                <CardContent style={{ padding: '10px', backgroundColor: '#ffffff' }}>
                    {isEditingPlot ? (
                        <TextField
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            variant="outlined"
                            size="small"
                            multiline
                            rows={3}
                            maxRows={6}
                            fullWidth
                            style={{ transition: 'height 0.2s ease-in-out' }}
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
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            padding: '0',
                        }}
                    >
                        <Button onClick={saveChanges} color="primary" variant="contained" size="small">
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
        </>
    );
};

export default memo(CustomNode);
