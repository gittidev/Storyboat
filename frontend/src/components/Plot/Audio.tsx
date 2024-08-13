// src/components/Audio.tsx

import { useImperativeHandle, useRef, forwardRef, useState } from 'react';

interface AudioProps {
    onStreamReady?: (stream: MediaStream) => void;
}

const Audio = forwardRef((props: AudioProps, ref) => {
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);

    useImperativeHandle(ref, () => ({
        startCall: () => {
            // Create RTCPeerConnection
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });

            setPeerConnection(pc);

            // Log peer connection state changes
            pc.oniceconnectionstatechange = () => {
                console.log('ICE Connection State:', pc.iceConnectionState);
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('ICE Candidate:', event.candidate);
                    // Send candidate to remote peer (example code, replace with actual signaling)
                }
            };

            pc.ontrack = (event) => {
                console.log('Remote Track Received:', event.streams);
                if (event.streams[0]) {
                    remoteStreamRef.current = event.streams[0];
                    if (props.onStreamReady) {
                        props.onStreamReady(event.streams[0]);
                    }
                }
            };

            // Create local media stream
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    console.log('Local Stream:', stream);
                    localStreamRef.current = stream;
                    // Add local stream tracks to peer connection
                    stream.getTracks().forEach(track => pc.addTrack(track, stream));
                })
                .catch((error) => {
                    console.error('Error getting local media stream:', error);
                });

            // Create and send offer
            pc.createOffer()
                .then((offer) => {
                    console.log('Creating Offer:', offer);
                    return pc.setLocalDescription(offer);
                })
                .then(() => {
                    console.log('Local Description Set:', pc.localDescription);
                    // Send offer to remote peer (example code, replace with actual signaling)
                })
                .catch((error) => {
                    console.error('Error creating offer:', error);
                });
        },
        stopCall: () => {
            // Clean up media streams and peer connection
            if (peerConnection) {
                console.log('Stopping peer connection');
                peerConnection.close();
                setPeerConnection(null);
            }

            if (localStreamRef.current) {
                console.log('Stopping local stream tracks');
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }

            if (remoteStreamRef.current) {
                console.log('Stopping remote stream tracks');
                remoteStreamRef.current.getTracks().forEach(track => track.stop());
                remoteStreamRef.current = null;
            }
        }
    }));

    return (
        <div>
            {/* UI for Audio component (if any) */}
        </div>
    );
});

export default Audio;
