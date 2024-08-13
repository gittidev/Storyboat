import { Node, Edge, XYPosition } from 'reactflow';
import * as Y from 'yjs';
import { WebrtcProvider, } from 'y-webrtc';

// 커스텀 노드 데이터 인터페이스
export interface CustomNodeData {
    label: string;
    content : string;
    text : string;
    isMain?: boolean;
    position?: XYPosition;
    onDelete: (id: string) => void;
    onNodeClick?: (id: string) => void;
    onEdit: (id: string, data: Partial<CustomNodeData>) => void;
}


export interface CustomEdgeData {
  onDelete: (id: string) => void;
}

// 플롯 노드와 엣지 타입 정의
export type PlotNode = Node<CustomNodeData>;
export type PlotEdge = Edge<CustomEdgeData>;

// Yjs 관련 타입
export type YMap<T = unknown> = Y.Map<T>;
export type YArray<T> = Y.Array<T>;

// WebRTC 프로바이더 타입
export type WebRTCProvider = WebrtcProvider;

// 플롯 상태 인터페이스
export interface PlotState {
    nodes: PlotNode[];
    edges: PlotEdge[];
    ydoc: Y.Doc | null;
    provider: WebRTCProvider | null;
}

// 플롯 조작을 위한 함수 타입들
export type UpdateNodeFunction = (updatedNode: PlotNode) => void;
export type AddNodeFunction = (newNode: PlotNode) => void;
export type DeleteNodeFunction = (nodeId: string) => void;
export type AddEdgeFunction = (newEdge: PlotEdge) => void;
export type DeleteEdgeFunction = (edgeId: string) => void;

// useYjsRecoilSync 훅의 반환 타입
export interface YjsRecoilSyncHook {
    updateNodeInYjs: UpdateNodeFunction;
    addNodeToYjs: AddNodeFunction;
    deleteNodeFromYjs: DeleteNodeFunction;
    addEdgeToYjs: AddEdgeFunction;
    deleteEdgeFromYjs: DeleteEdgeFunction;
}


//서버로 데이터 전송을 위한 타입

export interface Viewport {
    x: number;
    y: number;
    zoom: number;
  }
export interface FlowData {
    nodes: PlotNode[];
    edges: PlotEdge[];
    viewport: Viewport;
  }

export interface StoryData {
    storyNumber: string | undefined;
    timestamp: string;
    flowData: FlowData
  }