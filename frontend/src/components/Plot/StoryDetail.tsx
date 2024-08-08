import React, { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap, Connection,
  NodeChange, EdgeChange, XYPosition, ReactFlowInstance, NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { ReactFlowProvider } from '@reactflow/core';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { useYjsRecoilSync } from '../../hooks/useYjsRecoilSync';
import {
  nodesState, edgesState, isMainNodeModeState, reactFlowInstanceState,
} from '../../recoil/atoms/storyAtom';
import { PlotNode, PlotEdge } from '../../types/PlotType';
import { FlowData, StoryData } from '../../types/PlotType';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import api from '../../apis/api';
import { myStudioState } from '../../recoil/atoms/studioAtom';
import PlotEditForm from './PlotEditForm';

const nodeTypes: NodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

const flowKey: string = "myFlowKey";

const StoryDetail: React.FC = () => {
  const { storyid } = useParams<{ storyid: string }>();
  const roomId = storyid || `default_room_${Date.now()}`;
  
  const { updateNode, addNode, deleteNode, addEdge, deleteEdge } = useYjsRecoilSync(roomId);

  const [nodes, setNodes] = useRecoilState(nodesState);
  const [edges, setEdges] = useRecoilState(edgesState);
  const token = useRecoilValue(accessTokenState);
  const studioId = useRecoilValue(myStudioState);
  const [selectedNode, setSelectedNode] = useState<PlotNode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMainNodeMode, setIsMainNodeMode] = useRecoilState(isMainNodeModeState);
  const setReactFlowInstanceGlobal = useSetRecoilState(reactFlowInstanceState);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // 디버깅을 위한 useEffect
  useEffect(() => {
    // console.log('노드 상태 변경:', nodes);
    console.log('현재 roomId:', roomId);
    console.log('엣지 상태 변경:', edges);
    console.log(reactFlowInstance);
    // console.log(studioId);
  }, [nodes, edges, roomId, reactFlowInstance, studioId]);

  // 초기화
  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
    setReactFlowInstanceGlobal(instance);
  }, [setReactFlowInstance, setReactFlowInstanceGlobal]);

  // 노드 위치 변경
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    changes.forEach(change => {
      if (change.type === 'position' && 'position' in change && change.dragging) {
        // console.log(`노드 위치 변경: ${change.id}`, change.position);
        updateNode(change.id, { position: change.position as XYPosition });
      }
    });
  }, [updateNode]);

  // 엣지 연결
  const onConnect = useCallback((params: Connection) => {
    const newEdge: PlotEdge = {
      id: `e${params.source}-${params.target}`,
      source: params.source || '',
      target: params.target || '',
      type: 'customEdge'
    };
    console.log('새 엣지 연결:', newEdge);
    addEdge(newEdge);
  }, [addEdge]);

  // 엣지 삭제
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    changes.forEach(change => {
      if (change.type === 'remove') {
        console.log(`엣지 삭제: ${change.id}`);
        deleteEdge(change.id);
      }
    });
  }, [deleteEdge]);

  // 노드 삭제
  const onDeleteNode = useCallback((nodeId: string) => {
    console.log(`노드 삭제: ${nodeId}`);
    deleteNode(nodeId);
  }, [deleteNode]);

  // 드롭하여 노드 추가
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: PlotNode = {
        id: `node_${Date.now()}`,
        type: 'customNode',
        position,
        resizing: true,
        data: {
          label: `플롯`,
          content: '기본 데이터',
          text :'기본 텍스트',
          isMain: false,
          onDelete: onDeleteNode,
          onEdit: updateNode,
        },
      };
      addNode(newNode);
    },
    [nodes.length, addNode, onDeleteNode, updateNode, reactFlowInstance]
  );

  // 화면 초기화
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) || 'null');

      if (flow && reactFlowInstance) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        reactFlowInstance.setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setNodes, setEdges, reactFlowInstance]);

  //메인 노드 선택하기
  const toggleMainNodeMode = useCallback(() => {
    setIsMainNodeMode((prev) => {
      console.log(`메인 노드 선택 모드 ${!prev ? '켜짐' : '꺼짐'}`);
      return !prev;
    });
  }, [setIsMainNodeMode]);

  // 노드 클릭
  const onNodeClick = (_event: React.MouseEvent, node: PlotNode) => {
    setSelectedNode(node);
    setIsDialogOpen(true);
  };


// 노드 저장
const handleNodeSave = (updatedNode: PlotNode) => {
  setNodes((nds) =>
    nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
  );

  // reactFlowInstance에 업데이트된 노드 반영
  if (reactFlowInstance) {
    reactFlowInstance.setNodes((nds) =>
      nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
  }
};


  // 저장 => PlotNode 상태값, Plot Edge 상태값, 작업일시, 스토리 아이디값
  const handleSave = async () => {
    if (reactFlowInstance) {
      const flowData = reactFlowInstance.toObject() as FlowData;
      const timestamp = new Date().toISOString();

      const storyData: StoryData = {
        storyNumber: storyid || '',
        timestamp: timestamp,
        flowData: flowData,
      };

      console.log("Story Data :", storyData);

      try {
        const response = await api.put(`/api/studios/${studioId}/stories/${storyid}`, storyData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (response) {
          console.log('Story 저장완료');
        } else {
          console.error('Failed to save story');
        }
      } catch (error) {
        console.error('Error saving story:', error);
      }
    }
  };

  return (
    <ReactFlowProvider>
      <Box sx={{ width: '100%', height: '100vh' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={(event) => event.preventDefault()}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
        <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'customNode');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            드래그하여 노드 추가
          </Button>
          <Button
            variant="contained"
            color={isMainNodeMode ? "success" : "primary"}
            onClick={toggleMainNodeMode}
          >
            {isMainNodeMode ? "메인 노드 선택 모드 켜짐" : "메인 노드 선택 모드 꺼짐"}
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            저장하기
          </Button>
          <Button variant="contained" color="primary" onClick={onRestore}>
            화면 초기화
          </Button>
        </Box>
      </Box>

      {selectedNode && (
        <PlotEditForm
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          selectedNode={selectedNode}
          onSave={handleNodeSave}
        />
      )}
    </ReactFlowProvider>
  );
};

export default StoryDetail;
