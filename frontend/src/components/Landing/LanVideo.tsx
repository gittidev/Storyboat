import React, { useRef, useEffect, useState } from 'react';

const Compo2: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHeight, setVideoHeight] = useState('50vh'); // 비디오 높이 상태

  const handleEnded = () => {
    // 동영상이 끝나면 비디오를 다시 처음으로 되돌립니다.
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // 비디오를 처음으로 되돌립니다.
    }
  };

  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.innerHeight * 0.5; // 사용자가 보는 화면의 50% 계산
      setVideoHeight(`${newHeight}px`); // 상태 업데이트
    };

    updateHeight(); // 컴포넌트가 마운트될 때 높이 업데이트
    window.addEventListener('resize', updateHeight); // 창 크기 변경 시 높이 업데이트

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('ended', handleEnded);
    }

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleEnded);
      }
      window.removeEventListener('resize', updateHeight); // 리사이즈 이벤트 리스너 제거
    };
  }, []);

  return (
    <div style={{ height: videoHeight, overflow: 'hidden'}}>
      <video
        ref={videoRef}
        style={{ width: 'auto', height: '100%', objectFit: 'cover', borderRadius: '15px' }} // 너비 100% 차지 및 화면에 맞게 조정
        src="/library.mp4" // 비디오 파일 경로
        autoPlay
        muted
        loop // 비디오가 끝나면 다시 처음부터 재생
        controls={false} // 비디오 컨트롤을 숨기고 싶으면 false로 설정
      />
    </div>
  );
};

export default Compo2;
