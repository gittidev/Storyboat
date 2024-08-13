import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Panel, Node, Edge } from '@xyflow/react';
import type { XYPosition, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useParams } from 'react-router-dom';
import { saveFlowToIndexedDB } from '../../utils/indexedDBUtils';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { useRecoilValue } from 'recoil';
import api from '../../apis/api';
import { useYjsReactFlowSync } from '../../hooks/useYjsReactFlowSync';
import CustomNode from '../Plot/CustomNode';
import CustomEdge from '../Plot/CustomEdge';
import { styled } from '@mui/system';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useRecoilState } from 'recoil';
import { selectedStudioState } from '../../recoil/atoms/studioAtom';
import { isMainNodeModeState } from '../../recoil/atoms/storyAtom';
import { setMainNodes, updateMainNodesOnDeletion, updateMainNodesOnEdgeDeletion } from "../../utils/plotUtils.ts";
import { SelectChangeEvent } from '@mui/material';
import type { History } from '../Plot/HistoryDropdown.tsx';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import { IconButton } from '@mui/material';

const svURL = import.meta.env.VITE_SERVER_URL;
const flowKey = 'Story';

const UserContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row', // 세로 정렬
  alignItems: 'center', // 중앙 정렬
  // gap: '2px', // 아이콘 사이의 간격
});

const IconWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column', // 세로 정렬
  alignItems: 'center', // 중앙 정렬
  position: 'relative',
});

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
        return '#4ee956'; // 기본 색상
      case 'secondary':
        return '#ff6a7b'; // 다른 색상
      case 'third':
        return '#6a9cff'; // 또 다른 색상
      case 'tertiary':
        return '#8f8fff'; // 또 다른 색상
      default:
        return '#c5ffbd'; // 기본 색상
    }
  }};
  color: white;
`;

const StudioOverviewFlow: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const roomId = storyId || `default_room_${Date.now()}`;

  const [isMainNodeMode, setIsMainNodeMode] = useRecoilState(isMainNodeModeState);

  const studioId = useRecoilValue(selectedStudioState)
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
    updateNode
  } = useYjsReactFlowSync(roomId);

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
        const { nodes, edges, viewport } = flowData;

        console.log(nodes, edges, viewport);


        const updatedNodes = nodes.map((node: Node) => ({
          ...node,
          draggable: true,  // 노드를 드래그 가능하게 설정
          dragging: false,  // 초기 상태로 설정
        }));

        // 노드와 엣지 상태를 설정
        setNodes(updatedNodes);
        setEdges(edges);
        setViewport(viewport || { x: 0, y: 0, zoom: 1 });

        // Yjs 문서에 트랜잭션으로 동기화
        ydocRef.current?.transact(() => {
          // 기존 Yjs 맵을 초기화
          yNodesMapRef.current?.clear();
          yEdgesMapRef.current?.clear();

          // Yjs 맵에 새 데이터를 추가
          nodes.forEach((node: Node) => {
            yNodesMapRef.current?.set(node.id, node);
          });
          edges.forEach((edge: Edge) => {
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

  const [histories, setHistories] = useState<History[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const fetchHistories = async () => {
    try {
      const response = await axios.get(`${svURL}/api/studios/${studioId}/stories/${storyId}/histories`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setHistories(response.data.data.content);
      console.log(response.data.data.content)
    } catch (error) {
      console.error('Failed to fetch histories:', error);
    }
  };

  useEffect(() => {
    fetchStory();
    fetchHistories();
    // loadDummyData();
  }, [studioId, storyId]);

  const fetchHistoryData = async (historyId: string) => {
    try {
      const response = await axios.get(`${svURL}/api/studios/${studioId}/stories/${storyId}/histories/${historyId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const temp = JSON.parse(response.data.data);
      const flowData = JSON.parse(temp.flowData);
      console.log('History Data:', flowData); // 응답 데이터 출력
      if (flowData) {
        const { nodes, edges, viewport } = flowData;

        console.log(nodes, edges, viewport);


        const updatedNodes = nodes.map((node: Node) => ({
          ...node,
          draggable: true,  // 노드를 드래그 가능하게 설정
          dragging: false,  // 초기 상태로 설정
        }));

        // 노드와 엣지 상태를 설정
        setNodes(updatedNodes);
        setEdges(edges);
        setViewport(viewport || { x: 0, y: 0, zoom: 1 });

        // Yjs 문서에 트랜잭션으로 동기화
        ydocRef.current?.transact(() => {
          // 기존 Yjs 맵을 초기화
          yNodesMapRef.current?.clear();
          yEdgesMapRef.current?.clear();

          // Yjs 맵에 새 데이터를 추가
          nodes.forEach((node: Node) => {
            yNodesMapRef.current?.set(node.id, node);
          });
          edges.forEach((edge: Edge) => {
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
      console.error('Failed to fetch history data:', error);
    }
  };

  const handleHistoryChange = (event: SelectChangeEvent<string>) => {
    const selectedStoryId = event.target.value as string;
    setSelectedHistory(selectedStoryId);
    console.log(selectedStoryId)
    // 선택된 storyId에 따라 다른 동작 수행 가능
    fetchHistoryData(selectedStoryId)
  };

  //전체 영역 노드 삭제
  const deleteAllNodes = useCallback(() => {
    ydocRef.current?.transact(() => {
      yNodesMapRef.current?.clear();
      yEdgesMapRef.current?.clear();
    });

    setNodes([]);
    setEdges([]);

    // if (rfInstance) {
    //   rfInstance.setNodes([]);
    //   rfInstance.setEdges([]);
    // }
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
                data: { ...existingNode.data, isMain: node.data.isMain }
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
      updateNode(node.id, { data: { ...node.data, isMain: node.data.isMain } });
    });
  }, [deleteNode, nodes, edges, setNodes, updateNode]);

  const handleDeleteEdge = useCallback((id: string) => {
    const edge = edges.find(e => e.id === id);
    if (edge) {
      const updatedNodes = updateMainNodesOnEdgeDeletion(edge, nodes, edges);
      setNodes(updatedNodes);
      // Yjs를 통해 변경사항 동기화
      updatedNodes.forEach(node => {
        updateNode(node.id, { data: { ...node.data, isMain: node.data.isMain } });
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
  //노드 추가
  const addCustomNode = useCallback(() => {
    const position: XYPosition = { x: Math.random() * 500, y: Math.random() * 500 };
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
          fetchHistories();
          // loadData();
        } else {
          console.error('Failed to save story');
        }
      } catch (error) {
        console.error('Error saving story:', error);
      }
    }
  }, [storyId, studioId, token, rfInstance, nodes, edges]);


  const toggleMainNodeMode = useCallback(() => {
    setIsMainNodeMode((prev) => !prev);
  }, [setIsMainNodeMode]);


  return (
    <div style={{ height: '100vh', width: '100%' }}>
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
        <Background />
        <Controls />
        <MiniMap nodeStrokeColor={"transparent"} nodeColor={"#e2e2e2"} maskStrokeColor={"none"} pannable zoomable nodeStrokeWidth={3} maskColor={"rgb(240, 240, 240, 0.6)"} />

        <Panel position="top-right" style={{ display: 'flex', justifyContent: 'space-between', width: '95%' }}>
          <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
            <InputLabel id="history-select-label">History</InputLabel>
            <Select
              labelId="history-select-label"
              value={selectedHistory || ''}
              onChange={handleHistoryChange}
              label="History"
            >
              {histories.map((history) => (
                <MenuItem key={history.storyId} value={history.storyId}>
                  {/* {history.storyId} */}
                  {`${history.dateTime} - ${history.penName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <StyledButton className="primary" onClick={handleSave}>저장하기</StyledButton>
            <StyledButton className="third" onClick={onTemporarySave}>임시저장</StyledButton>
            <StyledButton className="tertiary" onClick={addCustomNode}>플롯추가</StyledButton>
            <StyledButton className="secondary" onClick={deleteAllNodes}>전체삭제</StyledButton>
            <StyledButton
              variant="contained"
              color={isMainNodeMode ? "success" : "primary"}
              onClick={toggleMainNodeMode}
            >
              {isMainNodeMode ? "메인 노드 선택 모드 켜짐" : "메인 노드 선택 모드 꺼짐"}
            </StyledButton>

            <div className="user-list">
            <UserContainer>
              {users.map((user) => (
                <IconWrapper key={user.clientId}>
                {/* 사람 아이콘 */}
                <IconButton
                  style={{ color: user.cursorColor, marginRight: '8px' }}
                >
                  <PersonIcon />
                </IconButton>
              </IconWrapper>
                // <div key={user.clientId} className="user-list-item" style={{ color: user.cursorColor }}>
                //   {user.name}
                // </div>
              ))}
            </UserContainer>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default StudioOverviewFlow;
