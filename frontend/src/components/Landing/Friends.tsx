import React, { useRef, useEffect } from 'react';
import team from '../../images/team.png';
import whitee2 from '../../images/whitee2.png';
import './friends.css';

// Define the options for IntersectionObserver
const options: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

// Function to create an IntersectionObserver
const createObserver = (elementClass: string, imageClass: string, container: React.RefObject<HTMLDivElement>) => {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const elements = container.current?.querySelectorAll(elementClass);
      const images = container.current?.querySelectorAll(imageClass);
      if (entry.isIntersecting) {
        elements?.forEach(element => {
          (element as HTMLElement).classList.add('show');
        });
        images?.forEach(image => {
          (image as HTMLElement).classList.add('show');
        });
      } else {
        elements?.forEach(element => {
          (element as HTMLElement).classList.remove('show');
        });
        images?.forEach(image => {
          (image as HTMLElement).classList.remove('show');
        });
      }
    });
  }, options);
};

const Friends: React.FC = () => {
  const container1 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container1.current) return;

    // Create the observer
    const observer = createObserver('.my-element1', '.my-image1', container1);

    // Observe the container
    if (container1.current) {
      observer.observe(container1.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (container1.current) {
        observer.unobserve(container1.current);
      }
    };
  }, []);

  return (
    <div>
      <div className="bodycontent2">
        <br />
        <br />
      </div>
      <div className="move_container1_parent">
        <div className="move_container1" ref={container1}>
          <div className="my-element1">
            <br/>
            <br/>
            <h2>당신이 원하던 소설 제작 사이트</h2>
            <h2>동료들과 함께 <b style={{ color: 'rgb(43,126,255)' }}>멋진 스토리</b>를 작성해보세요</h2>

            <div className="my-image1">
              <img src={team} alt="team" style={{ width: 'auto', height: 'auto' }} />
            </div>
            <br />
          </div>
        </div>
      </div>
      <img src={whitee2} alt="team" style={{ width: 'auto', height: 'auto' }} />
    </div>
  );
};

export default Friends;
