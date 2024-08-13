import { Node, Edge } from "@xyflow/react";

// 노드에서 루트까지의 경로를 찾는 함수
export const findPlotPathToRoot = (nodeId: string, edges: Edge[]): string[] => {
    const path: string[] = [];
    const visited = new Set<string>();
    const findPath = (currentId: string): void => {
        if (visited.has(currentId)) return;
        visited.add(currentId);
        path.push(currentId);
        const parentEdge = edges.find((e) => e.target === currentId);
        if (parentEdge) {
            findPath(parentEdge.source);
        }
    };
    findPath(nodeId);
    return path.reverse();
};

// 노드에서 리프 노드까지의 경로를 찾는 함수
export const findPlotPathToLeaf = (nodeId: string, edges: Edge[]): string[] => {
    const path: string[] = [nodeId];
    const visited = new Set<string>();
    const findPath = (currentId: string): void => {
        if (visited.has(currentId)) return;
        visited.add(currentId);
        const childEdges = edges.filter((e) => e.source === currentId);
        childEdges.forEach((edge) => {
            path.push(edge.target);
            findPath(edge.target);
        });
    };
    findPath(nodeId);
    return path;
};

// 메인 플롯 노드를 설정하는 함수
export const setMainPlotNodes = (
    nodeId: string,
    nodes: Node[],
    edges: Edge[],
): Node[] => {
    const pathToRoot = findPlotPathToRoot(nodeId, edges);
    return nodes.map((node) => ({
        ...node,
        data: {
            ...node.data,
            isMain: pathToRoot.includes(node.id)
        }
    }));
};

// 노드와 연결된 엣지를 가져오는 함수
export const getConnectedEdges = (nodeId: string, edges: Edge[]): Edge[] => {
    return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
};

// 노드가 고립되었는지 확인하는 함수
export const isNodeIsolated = (nodeId: string, edges: Edge[]): boolean => {
    return !edges.some((edge) => edge.source === nodeId || edge.target === nodeId);
};

// 노드의 모든 자손 노드를 가져오는 함수
export const getDescendantNodes = (nodeId: string, nodes: Node[], edges: Edge[]): Node[] => {
    const descendants: Set<string> = new Set();
    const traverse = (currentId: string) => {
        const childEdges = edges.filter((edge) => edge.source === currentId);
        childEdges.forEach((edge) => {
            if (!descendants.has(edge.target)) {
                descendants.add(edge.target);
                traverse(edge.target);
            }
        });
    };
    traverse(nodeId);
    return nodes.filter((node) => descendants.has(node.id));
};

// 노드 삭제 후 노드 위치를 재정렬하는 함수
export const reorganizeNodePositions = (nodes: Node[], deletedNodeId: string): Node[] => {
    const deletedNode = nodes.find((node) => node.id === deletedNodeId);
    if (!deletedNode) return nodes;

    const { x } = deletedNode.position;
    return nodes.map((node) => {
        if (node.position.x > x) {
            return { ...node, position: { x: node.position.x - 200, y: node.position.y } };
        }
        return node;
    });
};

// 루트 노드까지의 경로를 찾는 함수
export const findPathToRoot = (nodeId: string, edges: Edge[]): string[] => {
    const path: string[] = [nodeId];
    let currentId = nodeId;

    while (true) {
        const parentEdge = edges.find(edge => edge.target === currentId);
        if (!parentEdge) break;
        path.push(parentEdge.source);
        currentId = parentEdge.source;
    }

    return path.reverse();
};

// 메인 노드를 설정하는 함수
export const setMainNodes = (
    nodeId: string,
    nodes: Node[],
    edges: Edge[],
): Node[] => {
    const pathToRoot = findPathToRoot(nodeId, edges);
    return nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            isMain: pathToRoot.includes(node.id)
        }
    }));
};

// 노드 삭제 시 메인 노드를 업데이트하는 함수
export const updateMainNodesOnDeletion = (
    deletedNodeId: string,
    nodes: Node[],
    edges: Edge[],
): Node[] => {
    const affectedNodes = getDescendantNodes(deletedNodeId, nodes, edges);
    return nodes.map(node => {
        if (affectedNodes.some(affectedNode => affectedNode.id === node.id)) {
            return { ...node, data: { ...node.data, isMain: false } };
        }
        return node;
    });
};

// 엣지 삭제 시 메인 노드를 업데이트하는 함수
export const updateMainNodesOnEdgeDeletion = (
    deletedEdge: Edge,
    nodes: Node[],
    edges: Edge[],
): Node[] => {
    const affectedNodes = new Set<string>();

    const traverse = (nodeId: string) => {
        if (affectedNodes.has(nodeId)) return;
        affectedNodes.add(nodeId);
        edges.filter(e => e.source === nodeId).forEach(e => traverse(e.target));
    };

    traverse(deletedEdge.target);

    return nodes.map(node => {
        if (affectedNodes.has(node.id)) {
            return { ...node, data: { ...node.data, isMain: false } };
        }
        return node;
    });
};

// 노드 위치 변경 시 메인 노드 상태를 유지하는 함수
export const updateNodePosition = (
    nodeId: string,
    newPosition: { x: number; y: number },
    nodes: Node[],
): Node[] => {
    return nodes.map(node => {
        if (node.id === nodeId) {
            return { ...node, position: newPosition };
        }
        return node;
    });
};