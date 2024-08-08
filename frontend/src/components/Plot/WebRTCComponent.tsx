import { useEffect, useRef, useState } from 'react';
import { Button, TextField, Box, Typography, Chip } from '@mui/material';

const WebRTCComponent = () => {
    const [messages, setMessages] = useState<string[]>(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [inputMessage, setInputMessage] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<string>('연결 중...');
    const [connectedUsers, setConnectedUsers] = useState<number>(1);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const sessionIdRef = useRef<string | null>(null);

    const connectWebSocket = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            console.log("WebSocket already connected");
            return;
        }

        const wsUrl = `ws://${window.location.hostname}:8080/api/signaling`;
        console.log("Attempting to connect to WebSocket:", wsUrl);

        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            console.log("WebSocket connection opened");
            setConnectionStatus('서버 연결됨');
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (sessionIdRef.current) {
                socketRef.current?.send(JSON.stringify({
                    type: 'reconnect',
                    sessionId: sessionIdRef.current
                }));
            }
        };

        socketRef.current.onmessage = (event) => {
            console.log("Received WebSocket message:", event.data);
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'user-count') {
                    setConnectedUsers(message.count);
                } else if (message.type === 'chat') {
                    setMessages(prev => {
                        const newMessages = [...prev, message.message];
                        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
                        return newMessages;
                    });
                } else if (message.type === 'session-id') {
                    sessionIdRef.current = message.sessionId;
                    localStorage.setItem('sessionId', message.sessionId);
                } else if (message.type === 'history') {
                    setMessages(message.messages);
                    localStorage.setItem('chatMessages', JSON.stringify(message.messages));
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        socketRef.current.onclose = (event) => {
            console.log("WebSocket connection closed");
            setConnectionStatus('연결 끊김');
            if (!event.wasClean) {
                reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
            }
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    useEffect(() => {
        sessionIdRef.current = localStorage.getItem('sessionId');
        connectWebSocket();

        return () => {
            console.log("Component unmounting, cleaning up");
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const sendMessage = () => {
        if (inputMessage.trim() !== '' && socketRef.current?.readyState === WebSocket.OPEN) {
            console.log("Sending message:", inputMessage);
            socketRef.current.send(JSON.stringify({
                type: 'chat',
                message: inputMessage
            }));
            setInputMessage('');
        } else {
            console.warn("WebSocket is not open or message is empty");
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                WebRTC Chat
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Chip
                    label={`상태: ${connectionStatus}`}
                    color={connectionStatus === '서버 연결됨' ? 'success' : 'error'}
                />
                <Chip
                    label={`연결된 사용자: ${connectedUsers}`}
                    color="primary"
                />
            </Box>
            <Box sx={{ height: 300, overflowY: 'auto', border: '1px solid #ccc', p: 2, mb: 2 }}>
                {messages.map((msg, index) => (
                    <Typography key={index}>{msg}</Typography>
                ))}
            </Box>
            <TextField
                fullWidth
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지를 입력하세요"
                margin="normal"
            />
            <Button variant="contained" onClick={sendMessage}>
                전송
            </Button>
        </Box>
    );
};

export default WebRTCComponent;