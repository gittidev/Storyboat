import { PlotNode, PlotEdge } from '../types/PlotType';

// Plot path finding functions
export const findPlotPathToRoot = (nodeId: string, edges: PlotEdge[]): string[] => {
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

export const findPlotPathToLeaf = (nodeId: string, edges: PlotEdge[]): string[] => {
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

// Main node selection logic
export const setMainPlotNodes = (
    nodeId: string,
    nodes: PlotNode[],
    edges: PlotEdge[],
): PlotNode[] => {
    const pathToRoot = findPlotPathToRoot(nodeId, edges);
    return nodes.map((node) => ({
        ...node,
        data: {
            ...node.data,
            isMain: pathToRoot.includes(node.id)
        }
    }));
};

// Helper function to get connected edges for a node
export const getConnectedEdges = (nodeId: string, edges: PlotEdge[]): PlotEdge[] => {
    return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
};

// Helper function to check if a node is isolated (has no connections)
export const isNodeIsolated = (nodeId: string, edges: PlotEdge[]): boolean => {
    return !edges.some((edge) => edge.source === nodeId || edge.target === nodeId);
};

// Helper function to get all descendant nodes
export const getDescendantNodes = (nodeId: string, nodes: PlotNode[], edges: PlotEdge[]): PlotNode[] => {
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

// Helper function to reorganize node positions after deletion
export const reorganizeNodePositions = (nodes: PlotNode[], deletedNodeId: string): PlotNode[] => {
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