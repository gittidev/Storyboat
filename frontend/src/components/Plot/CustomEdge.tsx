import React, { useState } from 'react';
import { EdgeProps, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import { Button, Tooltip } from '@mui/material';

export interface CustomEdgeProps extends EdgeProps {
  markerEnd?: string;
  deleteEdge: (id: string) => void;
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  deleteEdge,
  markerEnd,
}) => {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false); // Edge 선택 상태 관리

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const handleEdgeClick = () => setSelected((prevSelected) => !prevSelected); // 클릭 시 선택 상태 변경

  return (
    <>
      <g 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onClick={handleEdgeClick} // Edge 클릭 시 상태 변경
      >
        <Tooltip title="Click to delete" open={hovered && !selected} arrow>
          <path
            id={id}
            d={edgePath}
            markerEnd={markerEnd}
            style={{ stroke: hovered || selected ? 'red' : 'black', strokeWidth: '5px', fill: 'none' }}
          />
        </Tooltip>
        {selected && ( // Edge가 선택된 상태일 때만 버튼을 렌더링
          <EdgeLabelRenderer>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: 'all',
                backgroundColor: 'red',
                color: 'white',
                fontWeight: 'bold',
                padding: '4px 8px',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              }}
              className="nodrag nopan"
              onClick={(e) => {
                e.stopPropagation(); // 부모 g 요소로의 이벤트 버블링을 방지
                deleteEdge(id);
              }}
            >
              Delete
            </Button>
          </EdgeLabelRenderer>
        )}
      </g>
    </>
  );
};

export default CustomEdge;
