import React, {useCallback, useState, useMemo, useEffect, useRef} from 'react';
import {ReactFlow, MiniMap, Controls, Background, Panel, Node, Edge} from '@xyflow/react';
import type { XYPosition, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useParams} from 'react-router-dom';
import {saveFlowToIndexedDB} from '../../utils/indexedDBUtils';
import {myStudioState} from '../../recoil/atoms/studioAtom';
import {accessTokenState} from '../../recoil/atoms/authAtom';
import {useRecoilValue} from 'recoil';
import api from '../../apis/api';
import {useYjsReactFlowSync} from '../../hooks/useYjsReactFlowSync';
import CustomNode from '../Plot/CustomNode';
import CustomEdge from '../Plot//CustomEdge';
import HistoryDropdown from '../Plot//HistoryDropdown';
import {styled} from '@mui/system';
import { IconButton, Tooltip, Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import {useRecoilState} from 'recoil';
import {isMainNodeModeState} from '../../recoil/atoms/storyAtom';
import {setMainNodes, updateMainNodesOnDeletion, updateMainNodesOnEdgeDeletion} from "../../utils/plotUtils.ts";
import Audio from '../Plot/Audio.tsx';
const flowKey = 'Story';

const createEdgeTypes = (handleDeleteEdge: any) => ({
  custom: (props: any) => (
      <CustomEdge
          {...props}
          deleteEdge={handleDeleteEdge}
      />
  ),
});


const StyledButton = styled(Button)`
  margin: 0px 2px;
  padding: 2px;
  background-color: ${(props) => {
    switch (props.className) {
      case 'primary':
        return '#4ee956';
      case 'secondary':
        return '#ff6a7b';
      case 'third':
        return '#6a9cff';
      case 'tertiary':
        return '#8f8fff';
      default:
        return '#c5ffbd';
    }
  }};
  color: white;
`;

const MyOverviewFlow: React.FC = () => {
  const {storyId} = useParams<{ storyId: string }>();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const roomId = storyId || `default_room_${Date.now()}`;
  const [isMainNodeMode, setIsMainNodeMode] = useRecoilState(isMainNodeModeState);
  const studioId = useRecoilValue(myStudioState)
  const token = useRecoilValue(accessTokenState)

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    addNode,
    onEdgesChange,
    onConnect,
    deleteNode,
    deleteEdge,
    onNodeDragStop,
    onDrop,
    setViewport,
    yNodesMapRef,
    yEdgesMapRef,
    ydocRef,
    users,
    // providerRef,
    updateNode,
  } = useYjsReactFlowSync(roomId);

  // 음성회의와 관련된 상태와 참조
  const [isCallActive, setIsCallActive] = useState(false);
  const audioRef = useRef<any>(null);

// 음성회의 시작/중단 핸들러
const handleCallToggle = () => {
  if (isCallActive) {
      audioRef.current.stopCall();
  } else {
      audioRef.current.startCall();
  }
  setIsCallActive(!isCallActive);
};

  const fetchStory = async () => {
    try {
      const response = await api.get(`/api/studios/${studioId}/stories/${storyId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // 응답 데이터 구조 확인을 위해 콘솔에 출력
      const temp = JSON.parse(response.data.data);
      const flowData = JSON.parse(temp.flowData);
      console.log(flowData);

      if (flowData) {
        const {nodes, edges, viewport} = flowData;

        console.log(nodes, edges, viewport);


        const updatedNodes = nodes.map((node : Node) => ({
          ...node,
          draggable: true,  // 노드를 드래그 가능하게 설정
          dragging: false,  // 초기 상태로 설정
        }));

        // 노드와 엣지 상태를 설정
        setNodes(updatedNodes);
        setEdges(edges);
        setViewport(viewport || {x: 0, y: 0, zoom: 1});

        // Yjs 문서에 트랜잭션으로 동기화
        ydocRef.current?.transact(() => {
          // 기존 Yjs 맵을 초기화
          yNodesMapRef.current?.clear();
          yEdgesMapRef.current?.clear();

          // Yjs 맵에 새 데이터를 추가
          nodes.forEach((node : Node) => {
            yNodesMapRef.current?.set(node.id, node);
          });
          edges.forEach((edge : Edge) => {
            yEdgesMapRef.current?.set(edge.id, edge);
          });
        });
      } else {
        console.error('flowData가 존재하지 않습니다:', response.data);
        // 예상치 못한 데이터가 올 경우 빈 배열로 설정
        setNodes([]);
        setEdges([]);
      }
    } catch (error) {
      console.error('스토리 데이터를 가져오지 못했습니다:', error);
    }
  };

  useEffect(() => {
    fetchStory();
    // loadDummyData();
  }, []);

  const deleteAllNodes = useCallback(() => {
    ydocRef.current?.transact(() => {
      yNodesMapRef.current?.clear();
      yEdgesMapRef.current?.clear();
    });

    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges, ydocRef, yNodesMapRef, yEdgesMapRef]);

  // 노드 클릭 핸들러
  const onNodeClick = useCallback((nodeId: string) => {
    if (isMainNodeMode) {
      const updatedNodes = setMainNodes(nodeId, nodes, edges);
      try {
        setNodes(updatedNodes);
        // Yjs를 통해 모든 클라이언트에 변경사항을 동기화합니다.
        ydocRef.current?.transact(() => {
          updatedNodes.forEach(node => {
            const existingNode = yNodesMapRef.current?.get(node.id);
            if (existingNode) {
              yNodesMapRef.current?.set(node.id, {
                ...existingNode,
                data: {...existingNode.data, isMain: node.data.isMain}
              });
            }
          });
        });
        console.log("MyOverviewFlow - onNodeClick", nodeId, updatedNodes.find(n => n.id === nodeId)?.data.isMain);
      } catch (error) {
        console.log("setNodes 실패", error);
      }
    }
  }, [isMainNodeMode, nodes, edges, setNodes, yNodesMapRef, ydocRef]);

  const handleDeleteNode = useCallback((id: string) => {
    const updatedNodes = updateMainNodesOnDeletion(id, nodes, edges);
    setNodes(updatedNodes);
    deleteNode(id);
    // Yjs를 통해 변경사항 동기화
    updatedNodes.forEach(node => {
      updateNode(node.id, {data: {...node.data, isMain: node.data.isMain}});
    });
  }, [deleteNode, nodes, edges, setNodes, updateNode]);

  const handleDeleteEdge = useCallback((id: string) => {
    const edge = edges.find(e => e.id === id);
    if (edge) {
      const updatedNodes = updateMainNodesOnEdgeDeletion(edge, nodes, edges);
      setNodes(updatedNodes);
      // Yjs를 통해 변경사항 동기화
      updatedNodes.forEach(node => {
        updateNode(node.id, {data: {...node.data, isMain: node.data.isMain}});
      });
    }
    deleteEdge(id);
  }, [deleteEdge, nodes, edges, setNodes, updateNode]);

  //메모이제이션 타입 추가
  const nodeTypes = useMemo(() => ({
    custom: (props: any) => (
        <CustomNode
            {...props}
            id={props.id}
            data={{
              ...props.data,
              onDelete: handleDeleteNode,
              onNodeClick: onNodeClick,
              isMain: props.data.isMain
            }}
            deleteNode={handleDeleteNode}
        />
    ),
  }), [handleDeleteNode, onNodeClick]);

  const edgeTypes = useMemo(() => createEdgeTypes(handleDeleteEdge), [handleDeleteEdge]);

  const addCustomNode = useCallback(() => {
    const position: XYPosition = {x: Math.random() * 500, y: Math.random() * 500};
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position,
      data: {
        label: `플롯`,
        content: '플롯 작성',
        text: '소설 작성',
      },
    };
    addNode(newNode);
  }, [addNode]);

  const onTemporarySave = useCallback(async () => {
    if (rfInstance) {
      const flow = {
        nodes,
        edges,
        viewport: rfInstance.getViewport(),
      };
      await saveFlowToIndexedDB(flowKey, flow);
    }
  }, [rfInstance, nodes, edges]);

  const handleSave = useCallback(async () => {
    if (rfInstance) {
      const updatedNodes = nodes.map(node => ({
        ...node,
        dragging: true,
      }));
      const flowData = {
        nodes: updatedNodes,
        edges,
        viewport: rfInstance.getViewport(),
      };
      const timestamp = new Date().toISOString();

      const storyData = {
        storyNumber: storyId || '',
        timestamp: timestamp,
        flowData: JSON.stringify(flowData), // 저장 시 JSON 문자열로 변환
      };

      try {
        const response = await api.put(`/api/studios/${studioId}/stories/${storyId}`, storyData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response) {
          console.log(response.data.data)
          console.log('Story 저장 완료');
          fetchStory();
          // loadData();
        } else {
          console.error('Failed to save story');
        }
      } catch (error) {
        console.error('Error saving story:', error);
      }
    }
  }, [storyId, studioId, token, rfInstance, nodes, edges]);

  const handleLoadHistory = useCallback((historyData: any) => {
    if (historyData && rfInstance) {
      const parsedData = JSON.parse(historyData.flowData);
      setNodes(parsedData.nodes);
      setEdges(parsedData.edges);
      setViewport(parsedData.viewport);
    }
  }, [rfInstance, setNodes, setEdges, setViewport]);

  const toggleMainNodeMode = useCallback(() => {
    setIsMainNodeMode((prev) => !prev);
  }, [setIsMainNodeMode]);

  return (
      <div style={{height: '100vh', width: '100%'}}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={setRfInstance}
        >
          <Background/>
          <Controls/>
          <MiniMap nodeStrokeColor={"transparent"} nodeColor={"#e2e2e2"} maskStrokeColor={"none"} pannable
                   zoomable nodeStrokeWidth={3} maskColor={"rgb(240, 240, 240, 0.6)"}/>
          <Panel position="top-right" style={{display: 'flex', justifyContent: 'space-between', width: '95%'}}>
            <div>
              <HistoryDropdown studioId={studioId} storyId={storyId || ''} onLoadHistory={handleLoadHistory}/>
            </div>
            <div>
              <StyledButton className="primary" onClick={handleSave}>저장하기</StyledButton>
              <StyledButton className="third" onClick={onTemporarySave}>임시저장</StyledButton>
              <StyledButton className="tertiary" onClick={addCustomNode}>플롯추가</StyledButton>
              <StyledButton className="secondary" onClick={deleteAllNodes}>전체삭제</StyledButton>
              {/* 음성회의와 관련된 UI */}
              <Tooltip title={isCallActive ? "음성 회의 중단" : "음성 회의 시작"}>
                    <IconButton
                        color={isCallActive ? "error" : "primary"}
                        onClick={handleCallToggle}
                        sx={{
                            backgroundColor: isCallActive ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)',
                            borderRadius: '50%',
                            p: 1,
                            '&:hover': {
                                backgroundColor: isCallActive ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 255, 0.2)',
                            }
                        }}
                    >
                        {isCallActive ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                </Tooltip>
                {/* 음성회의와 관련된 UI */}

              <StyledButton
                  variant="contained"
                  color={isMainNodeMode ? "success" : "primary"}
                  onClick={toggleMainNodeMode}
              >
                {isMainNodeMode ? "메인 노드 선택 모드 켜짐" : "메인 노드 선택 모드 꺼짐"}
              </StyledButton>

              <div className="user-list">
                {users.map((user) => (
                    <div key={user.clientId} className="user-list-item" style={{color: user.cursorColor}}>
                      {user.name}
                    </div>
                ))}
              </div>
            </div>
          </Panel>
        </ReactFlow>
        <Audio ref={audioRef} />
      </div>
  );
};

export default MyOverviewFlow;