import { atom } from 'recoil';
import { ReactFlowInstance } from 'reactflow';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

// export const nodesState = atom<PlotNode[]>({
//   key: 'nodesState',
//   default: [],
// });
//
// export const edgesState = atom<PlotEdge[]>({
//   key: 'edgesState',
//   default: [],
// });

export const isMainNodeModeState = atom<boolean>({
  key: 'isMainNodeModeState',
  default: false,
});

export const reactFlowInstanceState = atom<ReactFlowInstance | null>({
  key: 'reactFlowInstanceState',
  default: null,
});

export const ydocState = atom<Y.Doc | null>({
  key: 'ydocState',
  default: null,
});

export const yProviderState = atom<WebrtcProvider | null>({
  key: 'yProviderState',
  default: null,
});


// //클릭했을때 선택한 플롯값, 편집 영역 생성을 위함(plotId, 내부 데이터 필요)
// export const selectedNodeState = atom<PlotNode | null>({
//   key: 'selectedNodeState',
//   default: null,
// });
//
//
// //셀렉터 기능으로 현재 선택된 node의 ID값 반환
// export const selectedNodeIdState = selector({
//   key: 'selectedNodeIdState',
//   get: ({ get }) => {
//     const selectedNode = get(selectedNodeState);
//     return selectedNode ? selectedNode.id : null;
//   },
// });