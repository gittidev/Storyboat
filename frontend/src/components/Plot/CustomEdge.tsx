import React, { useState, useCallback } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { Button, Tooltip } from '@mui/material';
import { PlotEdge } from '../../types/PlotType';

const CustomEdge: React.FC<EdgeProps<PlotEdge['data']>> = ({
                                                               id,
                                                               sourceX,
                                                               sourceY,
                                                               targetX,
                                                               targetY,
                                                               sourcePosition,
                                                               targetPosition,
                                                               markerEnd,
                                                               data
                                                           }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = useCallback((evt: React.MouseEvent<SVGPathElement, MouseEvent>) => {
        evt.stopPropagation();
        setIsSelected(prev => !prev);
    }, []);

    //패스 삭제
    const handleDelete = useCallback((evt : React.MouseEvent) => {
        evt.stopPropagation();
        if (data) {
            data.onDelete(id);
        } else {
            console.error("onDelete 함수가 제공되지 않았습니다.");
        }
    }, [data, id]);


    return (
        <>
            <Tooltip
                title="클릭 시 삭제할 수 있습니다"
                open={showTooltip}
                arrow
                placement="top">
            <path
                id={id}
                style={{ strokeWidth: '10px' }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                onClick={onEdgeClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            </Tooltip>
            {isSelected && (
                <foreignObject
                    width={60}
                    height={30}
                    x={(sourceX + targetX) / 2 - 30}
                    y={(sourceY + targetY) / 2 - 15}
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: '4px'
                    }}>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={handleDelete}
                            style={{ minWidth: '50px', padding: '2px 8px' }}
                        >
                            Delete
                        </Button>
                    </div>
                </foreignObject>
            )}
        </>
    );
};

export default CustomEdge;