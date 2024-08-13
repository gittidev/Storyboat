import React, { useState, useRef, useEffect } from 'react';
import AIpageheader from './MyChar/AIpageheader';
import robotPainting from '../images/robotpainting.png'; 
import { Container, CssBaseline, Typography } from '@mui/material';
// import whitee2 from '../images/whitee.png';
import writting from '../images/writting.png';
import './MyChar/AIPaintingPage.css';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/ArrowDownward'; 
import Carouselai from './MyChar/Carouselai';

// Intersection Observer options
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

// Utility function to create and return an IntersectionObserver
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

const AIPaintingPage: React.FC = () => {
  // const [isAIImageVisible, setAIImageVisible] = useState(false);
  const [isHowGeneratedVisible, setHowGeneratedVisible] = useState(false);
  const [isGoodGeneratorVisible, setGoodGeneratorVisible] = useState(false);
  const [isCopyright1Visible, setCopyright1Visible] = useState(false);
  const [isCopyright2Visible, setCopyright2Visible] = useState(false);
  const [isCopyright3Visible, setCopyright3Visible] = useState(false);

  const container1 = useRef<HTMLDivElement | null>(null);
  const container2 = useRef<HTMLDivElement | null>(null);
  const container3 = useRef<HTMLDivElement | null>(null);
  const container4 = useRef<HTMLDivElement | null>(null);
  const container5 = useRef<HTMLDivElement | null>(null);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observers = [
      createObserver('.my-element1', '.my-image1', container1),
      createObserver('.my-element2', '.my-image2', container2),
      createObserver('.my-element3', '.my-image3', container3),
      createObserver('.my-element4', '.my-image4', container4),
      createObserver('.my-element5', '.my-image5', container5),
    ];

    const elementsToObserve = [
      { container: container1, observer: observers[0] },
      { container: container2, observer: observers[1] },
      { container: container3, observer: observers[2] },
      { container: container4, observer: observers[3] },
      { container: container5, observer: observers[4] },
    ];

    elementsToObserve.forEach(({ container, observer }) => {
      if (container.current) observer.observe(container.current);
    });

    // Add a delayed class to bodycontent1 and the new section
    setTimeout(() => {
      const bodycontent1 = document.querySelector('.bodycontent1');
      bodycontent1?.classList.add('show');
      
      const initialContent = document.querySelector('.initial-hide');
      initialContent?.classList.add('show');
    }, 1000);

    // Cleanup observers on component unmount
    return () => {
      elementsToObserve.forEach(({ container, observer }) => {
        if (container.current) observer.unobserve(container.current);
      });
    };
  }, []);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev);
  };

  const scrollToNextSection = () => {
    if (!scrollContainer.current) return;

    // Get the height of the scroll container
    const containerHeight = scrollContainer.current.clientHeight;

    // Calculate 80% of the container height
    const scrollAmount = containerHeight * 0.85;

    // Scroll by 80% of the container height
    scrollContainer.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div style={{ overflow: 'hidden', height: '100vh', margin: '0' }}>
      {/* AIpageheader Component */}
      <AIpageheader />

      {/* Scroll Container */}
      <div 
        ref={scrollContainer} 
        style={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 100px)', // Adjust the height as needed
          padding: '20px',
        }}
      >
        <div>
          <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '40px auto' }}>
            <div className="totalbody">
              <div className="bodycontent0"><br /></div>
              <div className="caro-item-text">
                

                
                <div className="bodycontent1 glowbody">
                  <div
                    className="v-carousel"
                    style={{ overflow: 'hidden', height: '600px' }}
                  >
                    <div className="v-carousel-item">
                      <div className="caro-item-text initial-hide">
                      <div className="glowing">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                      <div className="glowing">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                      <div className="glowing2">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                      <div className="glowing2">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                      <div className="glowing">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                        <div className="title">
                          <p>&nbsp;&nbsp;<span className="pink-text">AI 기반 삽화 생성</span></p>
                          <p><span className="color">&nbsp;&nbsp;<span className="pink-text">스토리보트</span></span>에서 창의적인 삽화를 만들어보세요.</p>
                        </div>
                        <br/>
                        <div className="glowing">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                      <div className="glowing2">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                      <div className="glowing2">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                      <div className="glowing">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                      <div className="glowing">
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                        <span style={{ '--i': 3 } as React.CSSProperties}></span>
                      </div>
                        &nbsp;&nbsp;
                        {/* <a href="Article" className="btn btn-block custom-btn zindex initial-hide">
                          AI 그림 생성기 바로가기
                        </a> */}
                        
                        {/* <div className="scroll-arrow" onClick={scrollToNextSection} /> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <br /> */}
                <br/><br/>
                <img src={robotPainting} alt="AI 그림 예시" className="back1-image" />
              </div>






              <div className="bodycontent2"><br /><br /></div>
              <div className="move_container1_parent">
                <div className="move_container1" ref={container1}>
                  <div className="my-element1">
                    <h2>AI를 통해 상상하던 캐릭터를 시각화하세요.</h2>
                    <h2>AI의 도움으로 당신의 이야기를 그림으로 변환해 보세요,</h2>
                    <h2><span className="pink-text2">스토리보트</span>와 함께 더 멋진 세상을 만들어보세요.</h2>
                  </div>
                  <br/>
                </div>
              </div>
              <div className="bodycontent5">
                <div>
                  <div className="first">
                    <div>
                      <div className="container2"><br /><br /></div>
                      <div className="move_container2" ref={container2}>
                        {/* <img className="my-image2" src={whitee2} alt="AI 그림" /> */}
                        <div className="my-element2">
                          {/* <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;★ 설명이 자세할 수록 정확한 이미지 생성 ★</h3> */}
                          {/* <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AI를 사용해 스토리의 비주얼을 더욱 풍부하게</h2> */}
                          {/* <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;디자인과 창의성을 결합해 보세요,</h2>
                          <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;당신의 상상력에 날개를 달아드립니다.</h2> */}
                              <Container>
                              <CssBaseline />
                              <Typography variant="h4" gutterBottom>
                        
                              </Typography>
                              <Carouselai />
                            </Container>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <br/>
                        <br/>
                        <div className="container4">
                          <h3 style={{ color: 'rgb(39, 44, 47)', fontWeight: 'bold', fontSize: '24px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </h3>
                          <br/><br/><br/><br/><br/><br/><br/><br/>
                          <h1>자유롭게 꿈꾸고</h1>
                          <h1>실현하는 세상</h1>
                          <h1>우리가 꿈꾸는 <span className="pink-text" style={{ fontWeight: 'bold', fontSize: '48px' }}>스토리보트</span></h1>
                          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        </div>
                        <div className="move_container4" ref={container4}>
                          <div className="my-element4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br/><br/>
              <div className="bodycontent6">
                <div className="container3"><br /><br /></div>
                <div className="move_container3" ref={container3}>
                  <div className="my-element3">
                    <h2 style={{ fontWeight: 'bold', fontSize: '32px' }}>
                      <span className="blue-text">AI</span>를 통해 상상의 세계를<br />
                      시각적으로 구현해보세요
                    </h2>
                  </div>
                </div>
              </div>
              <div className="bodycontent7">
                <img src={writting} alt="AI 그림" />
              </div>
              <div className="bodycontent8">
                <br /><br />
                <div className="move_container5" ref={container5}>
                  <div className="my-element5">
                    <div className="container5">


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br/><br/>
          <div style={{ padding: '0px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FAQ</h2>
          </div>


          <div className='togg'>
            <div>
              <hr />
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '10px 0',
                  lineHeight: '1.8',
                }}
                onClick={() => handleToggle(setHowGeneratedVisible)}
              >
                {isHowGeneratedVisible
                  ? 'Q1. 이미지는 어떻게 생성되나요?'
                  : 'Q1. AI 이미지는 어떻게 생성되나요? ▼'}
              </h4>
              {isHowGeneratedVisible && (
                <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  AI 기술이 급속도로 발전하면서, AI가 이미지를 생성하는 과정은 매우 복잡하고 다단계적인 절차를 거치게 됩니다. AI 이미지 생성 과정은 머신러닝 모델을 기반으로 하여, 대규모 데이터셋을 활용하여 이루어집니다. 이 데이터셋에는 수백만 개의 이미지와 그에 대응하는 텍스트 설명이 포함되어 있어, AI는 이 데이터를 통해 이미지와 텍스트 간의 깊은 상관관계를 학습하게 됩니다. 예를 들어, AI는 특정 텍스트 설명을 입력받으면, 그 텍스트에 적합한 이미지가 어떤 모습일지 예측하게 됩니다. 이러한 학습 과정을 반복하면서, AI는 점점 더 정확하고 정교한 이미지를 생성할 수 있는 능력을 갖추게 됩니다.

                  <br/>이후, 사용자가 특정 텍스트 설명을 입력하면, AI는 학습된 데이터를 기반으로 해당 설명에 부합하는 이미지를 생성합니다. 이 과정에서 AI는 사용자가 원하는 이미지의 스타일, 색상, 구도 등을 고려하여, 가장 적합한 이미지를 만들어냅니다. 예를 들어, StoryBoat는 Stable Diffusion XL(SDXL) 모델을 활용하여, 고해상도의 이미지를 생성하는데, 이 모델은 특히 복잡하고 세부적인 이미지 표현에 강점을 지니고 있습니다. 이를 통해 사용자는 다양한 스타일의 삽화를 생성할 수 있으며, 이는 사용자의 창의적인 요구를 충족시킬 수 있는 유연한 도구로 활용될 수 있습니다.

                  <br/>더 나아가, AI 이미지 생성 과정은 사용자가 입력하는 텍스트의 상세도에 따라 결과가 크게 달라질 수 있습니다. 보다 구체적이고 세부적인 텍스트 설명은 AI가 보다 정확하고 사용자의 의도에 부합하는 이미지를 생성하는 데 도움을 줍니다. 예를 들어, '푸른 하늘 아래 펼쳐진 드넓은 초원에 서 있는 고요한 오두막집'이라는 설명은 '오두막집'이라는 단순한 설명보다 훨씬 더 정교하고 세밀한 이미지를 생성할 수 있게 합니다. 이처럼 AI는 사용자가 입력하는 텍스트를 바탕으로, 가장 적합한 이미지를 생성하며, 이는 사용자에게 큰 창작적 자유를 제공합니다.

                  결론적으로, AI 이미지 생성은 단순한 이미지 생성 이상의 과정을 포함합니다. 이는 대규모 데이터 학습과 정교한 알고리즘의 결합으로, 사용자가 상상하는 거의 모든 이미지를 현실화할 수 있는 강력한 도구로 자리 잡고 있습니다. 앞으로 AI 기술이 더욱 발전함에 따라, 이미지 생성 과정 역시 더욱 정교하고 다양한 가능성을 제공하게 될 것입니다.
                </p>
              )}
            </div><br/>

            <hr />

            <div>
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '10px 0',
                  lineHeight: '1.8',
                }}
                onClick={() => handleToggle(setGoodGeneratorVisible)}
              >
                {isGoodGeneratorVisible
                  ? 'Q2. 좋은 AI 이미지 생성기란? '
                  : 'Q2. 좋은 AI 이미지 생성기란? ▼'}
              </h4>
              {isGoodGeneratorVisible && (
                <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  좋은 AI 이미지 생성기란, 사용자가 원하는 이미지를 쉽고 빠르게 생성할 수 있는 도구를 의미합니다. 이 도구는 사용자가 복잡한 기술적 지식 없이도 텍스트-이미지 변환 기능을 통해 자신이 상상하는 이미지를 직관적으로 시각화할 수 있게 합니다. 이는 단순한 이미지 생성 도구 이상으로, 사용자의 창의성을 증진시키고, 상상력을 자유롭게 표현할 수 있는 강력한 플랫폼이 되어야 합니다.

                  예를 들어, StoryBoat는 사용자가 입력한 설명에 따라 다양한 스타일의 삽화를 생성하는 기능을 제공하며, 이는 블로그 포스트나 소셜 미디어 게시물에 쉽게 활용될 수 있습니다. 이처럼 좋은 AI 이미지 생성기는 다양한 분야에서 활용 가능하며, 사용자가 상상하는 거의 모든 이미지를 실시간으로 생성할 수 있는 유연성을 갖추고 있어야 합니다. 이는 특히 비전문가에게도 창의적 작업을 수행할 수 있는 기회를 제공하며, 복잡한 디자인 도구를 사용할 필요 없이 직관적인 방법으로 결과를 얻을 수 있도록 도와줍니다.

                  <br/>더 나아가, 좋은 AI 이미지 생성기는 사용자 친화적인 인터페이스를 제공하여, 누구나 쉽게 사용할 수 있어야 합니다. 이는 단순한 사용성을 넘어서, 사용자가 필요로 하는 다양한 선택 옵션과 기능을 갖추고 있어야 하며, 사용자가 원하는 이미지를 생성하기 위한 모든 도구와 설정을 손쉽게 접근할 수 있도록 구성되어야 합니다. 예를 들어, 다양한 스타일, 색상, 구도 선택이 가능하며, 필요한 경우 세부적인 조정도 쉽게 할 수 있어야 합니다.

                  마지막으로, 좋은 AI 이미지 생성기는 신뢰성과 정확성 또한 필수적인 요소입니다. 사용자가 기대하는 결과물을 안정적으로 생성할 수 있어야 하며, AI가 생성한 이미지가 사용자의 요구와 일치하는지 확인할 수 있는 피드백 메커니즘도 제공되어야 합니다. 이는 사용자가 반복적인 시도 없이 원하는 결과를 얻을 수 있도록 도와주며, 사용자의 시간을 절약하고 창의적인 과정에 더욱 집중할 수 있게 해줍니다. 이러한 모든 요소를 갖춘 AI 이미지 생성기만이 진정한 의미에서 '좋은' 도구로 평가될 수 있을 것입니다.
                </p>
              )}
            </div><br/>

            <hr />

            <div>
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '10px 0',
                  lineHeight: '1.8',
                }}
                onClick={() => handleToggle(setCopyright1Visible)}
              >
                {isCopyright1Visible
                  ? 'Q3. AI가 생성한 이미지의 저작권은 누구에게 있나요? '
                  : 'Q3. AI가 생성한 이미지의 저작권은 누구에게 있나요? ▼'}
              </h4>
              {isCopyright1Visible && (
                <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  AI가 생성한 이미지의 저작권 문제는 매우 복잡하고, 국가와 플랫폼에 따라 다양한 해석이 존재할 수 있습니다. 일반적으로 AI가 생성한 이미지에 대한 저작권은 명확하게 정의되지 않은 경우가 많으며, 이는 AI의 학습 과정에서 사용된 데이터나 알고리즘의 소유권에 따라 크게 달라질 수 있습니다. 이 때문에 AI가 생성한 이미지의 저작권은 아직도 법적 논의가 진행 중인 분야로, 다양한 관점에서 접근이 이루어지고 있습니다.

                  예를 들어, 일부 국가에서는 AI가 생성한 이미지에 대해 저작권을 인정하지 않는 경우가 있습니다. 이는 AI가 창의적인 주체로 간주되지 않기 때문인데, 이러한 관점에서는 AI가 생성한 이미지는 누구의 소유도 아니며, 공공 영역에 속한다고 볼 수 있습니다. 반면, 다른 국가에서는 AI가 생성한 이미지에 대해 일정 부분 저작권을 인정할 수 있다는 입장을 취하고 있습니다. 이는 AI를 통해 생성된 이미지라도 그 기저에 있는 알고리즘이나 데이터셋이 특정 개인이나 기관의 소유이기 때문에, 그 결과물 역시 소유권이 있을 수 있다는 논리입니다.

                  <br/>StoryBoat의 경우, 사용자가 AI를 통해 생성한 이미지는 사용자에게 소유권이 부여됩니다. 이는 사용자가 자신의 창작물에 대한 권리를 보유할 수 있도록 하는 중요한 정책으로, 사용자에게 창의적인 작업에 대한 법적 보호를 제공합니다. 동시에, StoryBoat는 사용자가 생성한 이미지를 플랫폼에서 호스팅하고, 마케팅에 사용할 수 있는 권리를 함께 부여받습니다. 이는 사용자가 자신의 이미지를 효과적으로 관리하고 활용할 수 있도록 하며, 플랫폼 역시 사용자의 창작물을 통해 더 나은 서비스를 제공할 수 있게 합니다.

                  이러한 접근 방식은 사용자와 플랫폼 간의 명확한 권리 관계를 설정하여, AI 이미지 생성 과정에서 발생할 수 있는 법적 문제를 사전에 예방하는 데 큰 도움이 됩니다. 또한, 사용자가 생성한 이미지에 대한 소유권을 명확히 함으로써, 창작물에 대한 보호와 함께 사용자가 자신의 작품을 자유롭게 활용할 수 있는 권리를 보장합니다. 이처럼 AI가 생성한 이미지의 저작권 문제는 복잡하지만, 적절한 정책과 규정을 통해 사용자에게 공정하고 명확한 권리 보호가 이루어질 수 있습니다.
                </p>
              )}
            </div><br/>

            <hr />

            <div>
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '10px 0',
                  lineHeight: '1.8',
                }}
                onClick={() => handleToggle(setCopyright2Visible)}
              >
                {isCopyright2Visible
                  ? 'Q4. 어떤 인공지능 모델을 사용했나요? '
                  : 'Q4. 어떤 인공지능 모델을 사용했나요? ▼'}
              </h4>
              {isCopyright2Visible && (
                <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  StoryBoat는 AI 이미지 생성에 있어서, Stable Diffusion XL(SDXL) 모델을 사용하여 고해상도의 이미지를 생성합니다. SDXL은 확장된 Diffusion 모델로, 일반적인 Diffusion 모델보다 더욱 향상된 성능을 자랑합니다. 이 모델은 특히 큰 해상도의 이미지를 생성하는 데 최적화되어 있으며, 이는 복잡하고 세부적인 이미지 표현에 있어 탁월한 결과를 제공합니다. Diffusion 모델은 이미지의 픽셀을 점진적으로 변형시키면서 노이즈를 제거해 나가는 방식으로 이미지를 생성합니다.

                  이러한 방식은 기존의 이미지 생성 모델들과 비교하여 매우 세밀하고 정교한 이미지를 만들어낼 수 있는 장점을 가지고 있습니다. StoryBoat는 이 SDXL 모델을 활용하여 사용자가 입력한 설명에 기반한 다양한 스타일의 고퀄리티 이미지를 생성할 수 있습니다. 사용자는 자신의 필요에 따라 다양한 스타일과 해상도의 이미지를 선택할 수 있으며, 이를 통해 자신이 상상하는 거의 모든 이미지를 현실화할 수 있습니다.

                  <br/>더 나아가, StoryBoat는 Segmind API를 활용하여 모델을 학습시켰습니다. Segmind API는 강력한 AI 모델 학습 도구로, 다양한 데이터셋을 사용하여 AI 모델을 보다 효율적으로 학습시킬 수 있습니다. 이를 통해 StoryBoat는 일반적인 도메인 지식뿐만 아니라, 특정한 도메인에 특화된 지식까지 학습할 수 있었습니다. 예를 들어, Grit과 Midjourney 데이터셋을 사용하여, 다양한 분야에 걸친 지식과 이미지를 학습함으로써, 더욱 다채롭고 다양한 이미지를 생성할 수 있는 능력을 갖추게 되었습니다.

                  결론적으로, StoryBoat가 사용하는 Stable Diffusion XL(SDXL) 모델은 고해상도 이미지 생성에 있어 최고의 성능을 자랑하며, Segmind API와 결합된 학습 과정은 이 모델의 성능을 극대화하는 데 기여하고 있습니다. 이러한 기술적 기반 위에서, StoryBoat는 사용자가 상상하는 거의 모든 이미지를 고품질로 생성할 수 있는 강력한 도구로 자리 잡고 있습니다.
                </p>
              )}
            </div><br/>

            <hr />

            <div>
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '10px 0',
                  lineHeight: '1.8',
                }}
                onClick={() => handleToggle(setCopyright3Visible)}
              >
                {isCopyright3Visible
                  ? 'Q5. 각각의 화풍의 원리는 어떻게 되나요? '
                  : 'Q5. 각각의 화풍의 원리는 어떻게 되나요? ▼'}
              </h4>
              {isCopyright3Visible && (
                <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  StoryBoat에서 사용되는 알고리즘들은 각각 다른 스타일의 이미지를 생성하는 데 최적화되어 있습니다. 예를 들어, Euler 방법은 단순한 이미지 생성에 적합하며, 특히 초상화 같은 정적인 이미지에 효과적입니다. 이 알고리즘은 복잡한 계산 과정을 거치지 않고도, 깔끔하고 명확한 이미지를 생성할 수 있어, 빠르고 효율적인 이미지 생성이 가능합니다. 이는 특히 초상화와 같은 단순하고 직관적인 이미지 스타일에 잘 맞습니다.

                  LMS 알고리즘은 보다 복잡한 구조의 이미지, 예를 들어 건축적 표현이나 복잡한 구도를 가진 이미지에 적합합니다. 이 알고리즘은 이미지의 세부 구조와 형태를 정교하게 다룰 수 있는 능력을 가지고 있어, 복잡한 이미지에서도 높은 퀄리티를 유지할 수 있습니다. 이와 같은 특성 때문에, LMS 알고리즘은 건축물이나 복잡한 자연 경관을 표현하는 데 특히 유용합니다.

                  <br/>Heun 방법은 이미지에서의 조명과 그림자 표현에 탁월한 성능을 발휘합니다. 이 알고리즘은 세밀한 빛의 변화와 그에 따른 그림자의 위치를 정교하게 계산하여, 현실감 넘치는 이미지를 생성할 수 있습니다. Heun 방법은 특히 풍경화나 정교한 조명 효과가 중요한 이미지 스타일에서 그 진가를 발휘합니다. 이러한 이미지들은 사용자에게 현실적인 느낌을 주며, 자연스럽고 생생한 이미지를 만들어냅니다.

                  마지막으로, DDPM(딥 디노이징 디퓨전 모델)은 실사와 같은 현실적인 이미지를 생성하는 데 최적화되어 있습니다. 이 알고리즘은 이미지의 모든 세부 사항을 고려하여, 매우 현실적인 결과물을 만들어낼 수 있습니다. 이는 특히 사진과 같은 정밀한 디테일이 중요한 이미지에서 뛰어난 성능을 발휘합니다. DDPM은 실사 이미지를 생성하는 데 있어서, 매우 정밀하고 자연스러운 결과를 제공하여, 사용자에게 사실적인 이미지를 제공합니다.

                  <br/>이러한 알고리즘들은 각기 다른 방식으로 이미지를 점진적으로 생성하며, 사용자는 자신의 요구에 맞는 스타일을 선택하여 원하는 이미지를 생성할 수 있습니다. 예를 들어, 사용자가 보다 단순하고 직관적인 이미지를 원할 경우 Euler 방법을 선택할 수 있으며, 보다 복잡한 구조나 세밀한 조명 효과를 원할 경우 LMS 또는 Heun 방법을 선택할 수 있습니다. 그리고 실사에 가까운 이미지를 원할 경우 DDPM을 선택하는 것이 좋습니다.

                  이러한 다양한 알고리즘 선택은 사용자가 자신의 창의적 목표를 달성하는 데 큰 도움이 되며, 각기 다른 스타일의 이미지를 생성할 수 있는 유연성을 제공합니다. StoryBoat는 이러한 다양한 알고리즘을 통해, 사용자가 원하는 거의 모든 스타일의 이미지를 생성할 수 있는 강력한 도구로 자리 잡고 있습니다.
                </p>
              )}
            </div><br/>

            <hr />
            <br /><br /><br /><br /><br /><br /> <br /><br /><br /><br /><br /><br />
          </div>



        </div>
      </div>

      {/* Scroll to Bottom Button */}
      <button 
        onClick={scrollToNextSection} 
        style={{
          position: 'fixed',
          bottom: '40px', // Adjust as needed
          left: '55%',
          transform: 'translateX(-50%)',
          width: '150px', // Adjust width to be 3 times larger
          height: '75px', // Adjust height to be 1.5 times larger
          padding: '10px',
          backgroundColor: 'transparent', // Change background to transparent
          // color: 'rgba(0, 0, 0, 0.5)', // Set icon color to light gray
          border: '2px solid rgba(0, 0, 0, 0)',
          // borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <KeyboardDoubleArrowDownIcon style={{ fontSize: '60px' }} />
      </button>
    </div>
  );
};

export default AIPaintingPage;
