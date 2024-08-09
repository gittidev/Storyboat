import React, { memo, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import {
  DriveFileRenameOutlineRounded as EditIcon,
  DeleteForeverRounded as DeleteIcon,
} from "@mui/icons-material";

import StoryEditForm from "./StoryEditForm";
import { useRecoilState } from 'recoil';
import { selectedNodeState, nodesState } from '../../recoil/atoms/storyAtom';

const CustomNodeComponent: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [isStoryEditorOpen, setIsStoryEditorOpen] = useState(false);

  const handleStoryEditorClose = () => {
    setIsStoryEditorOpen(false);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
      const updatedNodes = nodes.filter(node => node.id !== id);
      setNodes(updatedNodes);
    } else {
      console.error("onDelete 함수가 제공되지 않았습니다.");
    }
  };


  const handleOpenStoryDialog = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNode({ id, type: 'custom', position: { x: xPos, y: yPos }, data });
    setIsStoryEditorOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          minWidth: '150px',
          minHeight: '130px',
          borderRadius: '15px',
          backgroundColor: data.isMain ? "#fff9c4" : "white",
          border: data.isMain
            ? "2px solid #ffc107"
            : "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{
                fontWeight: data.isMain ? "bold" : "normal",
                color: data.isMain ? "#f57c00" : "inherit",
              }}
            >
              {data.label}
              <IconButton  sx={{ p: 0 }}>
                <EditIcon fontSize="medium" />
              </IconButton>
            </Typography>

            <Box>
              <IconButton onClick={handleDelete} sx={{ p: 0 }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Typography>{data.content}</Typography>
        </CardContent>
        <Handle
          style={{
            width: "20px",
            height: "40px",
            backgroundColor: "#65B3F2",
            borderRadius: "4px",
          }}
          type="target"
          position={Position.Left}
        />
        <Handle
          style={{
            width: "20px",
            height: "40px",
            backgroundColor: "#65B3F2",
            borderRadius: "4px",
          }}
          type="source"
          position={Position.Right}
        />
        <IconButton onClick={handleOpenStoryDialog} sx={{ p: 0 }}>
          스토리 편집 버튼임
        </IconButton>
      </Card>

      {selectedNode && selectedNode.id === id && (
        <>

          <StoryEditForm
            isOpen={isStoryEditorOpen}
            onClose={handleStoryEditorClose}
            nodeId={selectedNode.id}
            plot={selectedNode}
          />
        </>
      )}
    </>
  );
};

const CustomNode = memo(CustomNodeComponent);
export default CustomNode;
