import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Panel } from '@xyflow/react';
import type { Node, XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useParams } from 'react-router-dom';
import { saveFlowToIndexedDB } from '../../utils/indexedDBUtils';
import { myStudioState } from '../../recoil/atoms/studioAtom';
import { accessTokenState } from '../../recoil/atoms/authAtom';
import { useRecoilValue } from 'recoil';
import api from '../../apis/api';
import { useYjsReactFlowSync } from '../../hooks/useYjsReactFlowSync';
import CustomNode from '../Plot/CustomNode';
import CustomEdge from '../Plot//CustomEdge';
import HistoryDropdown from '../Plot//HistoryDropdown';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { useRecoilState } from 'recoil';
import { isMainNodeModeState } from '../../recoil/atoms/storyAtom';
import axios from 'axios';
import { dummyData } from '../Plot/dummyStory';

const svURL = import.meta.env.VITE_SERVER_URL;
const flowKey = 'Story';

const createNodeTypes = (handleDeleteNode: any) => ({
  custom: (props: any) => (
    <CustomNode
      {...props}
      id={props.id}
      data={props.data}
      deleteNode={handleDeleteNode}
    />
  ),
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
  const { storyId } = useParams<{ storyId: string }>();
  const [rfInstance, setRfInstance] = useState<any>(null);
  const roomId = storyId || `default_room_${Date.now()}`;
  const [isMainNodeMode, setIsMainNodeMode] = useRecoilState(isMainNodeModeState);
  const studioId = useRecoilValue(myStudioState)
  const token = useRecoilValue(accessTokenState)

  // const [nodes, setNodes] = useState([]);
  // const [edges, setEdges] = useState([]);
  // const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

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
    providerRef,
  } = useYjsReactFlowSync(roomId);

  const onInit = useCallback((instance) => {
    setRfInstance(instance);
  }, []);

  // const loadDummyData = useCallback(() => {
  //   const { nodes: dummyNodes, edges: dummyEdges, viewport } = dummyData.flowData;

  //   setNodes(dummyNodes);
  //   setEdges(dummyEdges);

  //   if (rfInstance) {
  //     rfInstance.setNodes(dummyNodes);
  //     rfInstance.setEdges(dummyEdges);
  //     rfInstance.setViewport(viewport);
  //   }
  // }, [rfInstance, setNodes, setEdges]);



  // const loadData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${svURL}/api/studios/${studioId}/stories/${storyId}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       }
  //     });
  //     // console.log(response);

  //     const flowData = JSON.parse(response.data.data.flowData); // JSON 문자열을 객체로 변환
  //     const { nodes: loadedNodes, edges: loadedEdges, viewport } = flowData;
  //     console.log(flowData)
  //     setNodes(loadedNodes);
  //     setEdges(loadedEdges);
  //     setViewport(viewport);
  //   } catch (error) {
  //     console.error('데이터 불러오기 실패', error);
  //   }
  // };

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
            // nodes, edges, viewport를 추출
            let { nodes, edges, viewport } = flowData;

            // 각 노드의 id 값을 +1하여 업데이트
            // nodes = nodes.map(node => {
            //     const idNumberMatch = node.id.match(/(\d+)$/); // id에서 숫자 부분만 추출
            //     if (idNumberMatch) {
            //         const newIdNumber = parseInt(idNumberMatch[0], 10) + 100; // 숫자 부분을 +1
            //         const newId = node.id.replace(idNumberMatch[0], newIdNumber); // 새로운 id로 대체
            //         return { ...node, id: newId }; // 새 id로 노드 업데이트
            //     }
            //     return node; // 숫자가 없는 경우는 그대로 유지
            // });

            console.log(nodes, edges, viewport);

            // 노드와 엣지 상태를 설정
            setNodes(nodes);
            setEdges(edges);
            setViewport(viewport || { x: 0, y: 0, zoom: 1 });
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

  const updateNodeIds = () => {
    const updatedNodes = nodes.map(node => {
        const idNumberMatch = node.id.match(/(\d+)$/); // id에서 숫자 부분만 추출
        if (idNumberMatch) {
            const newIdNumber = parseInt(idNumberMatch[0], 10) - 100; // 숫자 부분을 +100
            const newId = node.id.replace(idNumberMatch[0], newIdNumber); // 새로운 id로 대체
            return { ...node, id: newId }; // 새 id로 노드 업데이트
        }
        return node; // 숫자가 없는 경우는 그대로 유지
    });

    setNodes(updatedNodes); // 업데이트된 노드로 상태 설정
};

  const deleteAllNodes = useCallback(() => {
    ydocRef.current?.transact(() => {
      yNodesMapRef.current?.clear();
      yEdgesMapRef.current?.clear();
    });

    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges, ydocRef, yNodesMapRef, yEdgesMapRef]);

  const handleDeleteNode = useCallback(
    (id: string) => {
      deleteNode(id);
    },
    [deleteNode]
  );

  const handleDeleteEdge = useCallback(
    (id: string) => {
      deleteEdge(id);
    },
    [deleteEdge, setEdges]
  );

  const nodeTypes = useMemo(() => createNodeTypes(handleDeleteNode), [handleDeleteNode]);
  const edgeTypes = useMemo(() => createEdgeTypes(handleDeleteEdge), [handleDeleteEdge]);

  // const addCustomNode = useCallback(() => {
  //   updateNodeIds();
  //   const position: XYPosition = { x: Math.random() * 500, y: Math.random() * 500 };
  //   const newNode: Node = {
  //     id: `node_${Date.now()}`,
  //     type: 'custom',
  //     position,
  //     data: {
  //       label: `플롯`,
  //       content: '플롯 작성',
  //       text: '소설 작성',
  //     },
  //   };
  //   addNode(newNode);
  //   // fetchStory();
  // }, [addNode]);

  const addCustomNode = useCallback(() => {
    updateNodeIds(); // 기존 노드들의 ID 업데이트 함수
    console.log(nodes)
    const position: XYPosition = { x: Math.random() * 500, y: Math.random() * 500 };
    const newNode: Node = {
      id: `node_${Date.now()}`, // 현재 시간을 이용해 고유한 ID 생성
      type: 'custom',
      position,
      data: {
        label: `플롯`,
        content: '플롯 작성',
        text: '소설 작성',
      },
    };

    // 기존 노드에 새로운 노드를 추가하는 방식
    setNodes(prevNodes => [...prevNodes, newNode]);
  }, [setNodes]);

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
        nodes : updatedNodes,
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
          <div>
            <HistoryDropdown studioId={studioId} storyId={storyId || ''} onLoadHistory={handleLoadHistory} />
          </div>
          <div>
            <StyledButton className="primary" onClick={handleSave}>저장하기</StyledButton>
            <StyledButton className="third" onClick={onTemporarySave}>임시저장</StyledButton>
            <StyledButton className="tertiary" onClick={addCustomNode}>플롯추가</StyledButton>
            <StyledButton className="secondary" onClick={deleteAllNodes}>전체삭제</StyledButton>
            <button onClick={updateNodeIds}>편집시작</button>
            <StyledButton
              variant="contained"
              color={isMainNodeMode ? "success" : "primary"}
              onClick={toggleMainNodeMode}
            >
              {isMainNodeMode ? "메인 노드 선택 모드 켜짐" : "메인 노드 선택 모드 꺼짐"}
            </StyledButton>

            <div className="user-list">
              {users.map((user) => (
                <div key={user.clientId} className="user-list-item" style={{ color: user.cursorColor }}>
                  {user.name} - {user.clientId}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default MyOverviewFlow;
