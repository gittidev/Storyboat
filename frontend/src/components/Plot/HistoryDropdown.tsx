import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { Node, Edge } from '@xyflow/react';

interface HistoryDropdownProps {
  studioId: string | number;
  storyId: string;
  onLoadHistory: (historyData: any) => void;
}

interface History {
  _id: string;
  timestamp: string;
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

const HistoryDropdown: React.FC<HistoryDropdownProps> = ({ studioId, storyId, onLoadHistory }) => {
  const [histories, setHistories] = useState<History[]>([]);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const response = await axios.put(`/api/studios/${studioId}/stories/${storyId}/histories/${storyId}`);
        setHistories(response.data);
      } catch (error) {
        console.error('Failed to fetch histories:', error);
      }
    };

    fetchHistories();
  }, [studioId, storyId]);

  const handleHistoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const historyId = event.target.value;
    const selectedHistory = histories.find(history => history._id === historyId);

    if (selectedHistory) {
      onLoadHistory(selectedHistory);
    }
  };

  return (
    <div>
      <label htmlFor="history-select">버전 선택</label>
      <select id="history-select" onChange={handleHistoryChange}>
        <option value="">버전 선택하기</option>
        {histories.map(history => (
          <option key={history._id} value={history._id}>
            {new Date(history.timestamp).toLocaleString()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HistoryDropdown;
