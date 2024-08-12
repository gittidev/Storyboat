import { useCallback, useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import {
    useNodesState,
    useEdgesState,
    applyNodeChanges,
    applyEdgeChanges,
    type Node,
    type Edge,
    type OnConnect,
    type OnNodesChange,
    type OnEdgesChange,
    useReactFlow,
} from '@xyflow/react';
import { Awareness } from 'y-protocols/awareness';
import { getRandomColor } from '../utils/getRandomColor';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/atoms/userAtom';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useYjsReactFlowSync = (roomId: string) => {
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);
    const [isInitialized, setIsInitialized] = useState(false);
    const { setViewport } = useReactFlow();
    // const [awareness, setAwareness] = useState<Awareness>();
    const [users, setUsers] = useState<{ clientId: number; name: string; cursorColor: string }[]>([]);
    const [cursors, setCursors] = useState<{ clientId: number; cursor: { x: number; y: number; color: string } }[]>([]);
    const userId = useRecoilValue(userState);

    const ydocRef = useRef<Y.Doc | null>(null);
    const providerRef = useRef<WebrtcProvider | null>(null);
    const yNodesMapRef = useRef<Y.Map<Node> | null>(null);
    const yEdgesMapRef = useRef<Y.Map<Edge> | null>(null);
    const awarenessRef = useRef<Awareness | null>(null);

    useEffect(() => {
        if (!ydocRef.current) {
            ydocRef.current = new Y.Doc();
        }

          // 기존에 방이 연결되어 있지 않으면 WebrtcProvider를 생성합니다.
        if (!providerRef.current) {
        providerRef.current = new WebrtcProvider(roomId, ydocRef.current, {
            signaling: ['wss://i11c107.p.ssafy.io/signal'],
            });
        } else {
            // 이미 연결된 방이 있으면 해당 방을 재사용합니다.
            providerRef.current.connect();
        }

        if (!awarenessRef.current) {
            awarenessRef.current = providerRef.current.awareness;
            const cursorColor = getRandomColor();
            
            const safeUserId: string = typeof userId === 'string' ? userId : 'Unknown';
        
            awarenessRef.current.setLocalStateField('user', {
                userId: safeUserId,
                cursor: { x: 0, y: 0, color: cursorColor },
            });
        
            setUsers((prevUsers) => [
                ...prevUsers,
                { clientId: awarenessRef.current!.clientID, name: safeUserId, cursorColor },  // 타입 단언 사용
            ]);
        }

        yNodesMapRef.current = ydocRef.current.getMap('nodes');
        yEdgesMapRef.current = ydocRef.current.getMap('edges');

        const syncInitialState = () => {
            const initialNodes = Array.from(yNodesMapRef.current!.values());
            const initialEdges = Array.from(yEdgesMapRef.current!.values());
            setNodes(initialNodes);
            setEdges(initialEdges);
            setIsInitialized(true);
        };

        providerRef.current.on('synced', syncInitialState);

        const checkConnection = () => {
            if (providerRef.current && !providerRef.current.connected) {
                console.log('WebRTC 연결 끊김, 재연결 시도 중...');
                providerRef.current.connect();
            }
        };

        const intervalId = setInterval(checkConnection, 30000);
        let inactivityTimeout = setTimeout(checkConnection, 60000);

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(checkConnection, 60000);
        };

        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keydown', resetInactivityTimer);

        // Awareness 상태 변경 핸들러
        const handleAwarenessUpdate = () => {
        const states = Array.from(awarenessRef.current!.getStates().entries());

        const updatedCursors = states.map(([clientId, state]) => ({
            clientId,
            cursor: state.user.cursor,
        }));
        setCursors(updatedCursors);

        const updatedUsers = states.map(([clientId, state]) => {
            const userId = state.user.userId || 'Unknown'; // null을 처리하기 위해 기본값 설정
            return {
                clientId,
                name: userId,
                cursorColor: state.user.cursor.color, // 사용자 커서 색상도 함께 저장
            };
        });
        setUsers(updatedUsers);
    };

    awarenessRef.current.on('change', handleAwarenessUpdate);

    return () => {
        if (providerRef.current) {
        providerRef.current.destroy();
          providerRef.current = null; // 여기에 null 설정
        }
        if (ydocRef.current) {
        ydocRef.current.destroy();
          ydocRef.current = null; // 여기에 null 설정
        }
        clearInterval(intervalId);
        clearTimeout(inactivityTimeout);
        window.removeEventListener('mousemove', resetInactivityTimer);
        window.removeEventListener('keydown', resetInactivityTimer);
    };
    }, [roomId, setNodes, setEdges]);

    useEffect(() => {
        const handleNodesUpdate = () => {
            const updatedNodes = Array.from(yNodesMapRef.current!.values());
            setNodes(updatedNodes);
        };

        const handleEdgesUpdate = () => {
            const updatedEdges = Array.from(yEdgesMapRef.current!.values());
            setEdges(updatedEdges);
        };

        yNodesMapRef.current?.observe(handleNodesUpdate);
        yEdgesMapRef.current?.observe(handleEdgesUpdate);

        return () => {
            yNodesMapRef.current?.unobserve(handleNodesUpdate);
            yEdgesMapRef.current?.unobserve(handleEdgesUpdate);
        };
    }, [setNodes, setEdges]);

    const onNodesChangeWithYjs: OnNodesChange = useCallback(
        (changes) => {
            ydocRef.current?.transact(() => {
                const newNodes = applyNodeChanges(changes, Array.from(yNodesMapRef.current!.values()));
                newNodes.forEach((node) => {
                    yNodesMapRef.current!.set(node.id, node);
                });
            });
        },
        []
    );

    const onEdgesChangeWithYjs: OnEdgesChange = useCallback(
        (changes) => {
            ydocRef.current?.transact(() => {
                const newEdges = applyEdgeChanges(changes, Array.from(yEdgesMapRef.current!.values()));
                newEdges.forEach((edge) => {
                    yEdgesMapRef.current!.set(edge.id, edge);
                });
            });
        },
        []
    );

    const onConnect: OnConnect = useCallback(
        (connection) => {
            ydocRef.current?.transact(() => {
                const newEdge: Edge = {
                    ...connection,
                    type: 'custom',
                    id: `edge_${Date.now()}`,
                };
                yEdgesMapRef.current!.set(newEdge.id, newEdge);
                setEdges((eds) => [...eds, newEdge]);
            });
        },
        [setEdges]
    );

    const addNode = useCallback((newNode: Node) => {
        ydocRef.current?.transact(() => {
            yNodesMapRef.current!.set(newNode.id, newNode);
        });
    }, []);

    const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
        ydocRef.current?.transact(() => {
            const existingNode = yNodesMapRef.current!.get(nodeId);
            if (existingNode) {
                yNodesMapRef.current!.set(nodeId, { ...existingNode, ...updates });
            }
        });
    }, []);

    const deleteNode = useCallback((nodeId: string) => {
        ydocRef.current?.transact(() => {
            yNodesMapRef.current!.delete(nodeId);
            setNodes((nds) => nds.filter((n) => n.id !== nodeId));
            setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
            yEdgesMapRef.current!.forEach((edge, key) => {
                if (edge.source === nodeId || edge.target === nodeId) {
                    yEdgesMapRef.current!.delete(key);
                }
            });
        });
    }, []);

    const deleteEdge = useCallback((id: string) => {
        const doc = ydocRef.current;
        if (!doc) return;
        const yEdgesMap = doc.getMap('edges');
        yEdgesMap.delete(id);
    }, []);

    const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
        updateNode(node.id, { position: node.position });
    }, [updateNode]);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        const reactFlowBounds = event.currentTarget.getBoundingClientRect();
        const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        };

        const newNode: Node = {
            id: `node_${Date.now()}`,
            type: 'default',
            position,
            data: {
                label: '플롯',
                content: '플롯 작성',
                text: '소설 작성',
            },
        };

        addNode(newNode);
    }, [addNode]);

    //노드에 엮인 데이터 수정
    const updateNodeField = useCallback(
        (nodeId: string, field: string, value: any) => {
        ydocRef.current?.transact(() => {
        const node = yNodesMapRef.current?.get(nodeId);
        if (node) {
            const updatedNode = {
            ...node,
            data: {
                ...node.data,
                [field]: value,
            },
            };
            yNodesMapRef.current?.set(nodeId, updatedNode);
            
            // React Flow 상태도 업데이트
            setNodes((nds) =>
            nds.map((n) => (n.id === nodeId ? updatedNode : n))
            );
        }
        });
    },
    [ydocRef, yNodesMapRef, setNodes]
    );


    // 부모 관계를 추적하여 루트까지의 경로를 찾아가는 함수
const findPathToRoot = (nodeId: string, edges: Edge[]) => {
    const path = [nodeId];
    let currentNodeId = nodeId;

    while (true) {
        const parentEdge = edges.find(edge => edge.target === currentNodeId);
        if (!parentEdge) break;
        currentNodeId = parentEdge.source;
        path.push(currentNodeId);
    }

    return path;
};

    return {
        nodes,
        edges,
        onNodesChange: onNodesChangeWithYjs,
        onEdgesChange: onEdgesChangeWithYjs,
        onConnect,
        isInitialized,
        addNode,
        updateNode,
        deleteNode,
        deleteEdge,
        onNodeDragStop,
        onDrop,
        setNodes,
        setEdges,
        setViewport,
        yNodesMapRef,
        yEdgesMapRef,
        ydocRef,
        awareness: awarenessRef.current,
        users,
        updateNodeField,
        cursors,
        providerRef,
        findPathToRoot
    };
};
