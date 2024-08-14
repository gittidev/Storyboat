import type { Node, Edge } from '@xyflow/react';


export interface History {
  storyId: string;
  dateTime: string;
  penName:string;
  flowData: {
    nodes: Node[];
    edges: Edge[];
    viewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };
}

export interface TextHistory {
  textId: string;
  penName: string;
  dateTime: string;
  text : string;
}


