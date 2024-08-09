import React, { useState, useRef, useEffect } from 'react';
import './LandingPage.css';
import { Container, CssBaseline, Typography } from '@mui/material';
import Carousel from './Carousel';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import whitee from '../../images/whitee.png';
import whitee2 from '../../images/whitee2.png';
import team from '../../images/team.png';
import boat from '../../images/boat.png';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'; 
// import BubbleComponent from './BubbleComponent';
import Footer from './footer';


// const GradientBox = styled(Box)<{ whiteBackground?: boolean }>`
//   width: 100%;
//   height: 100vh;
//   position: absolute;
//   top: 0;
//   left: 0;
//   background: ${(props) =>
//     props.whiteBackground
//       ? 'white'
//       : 'linear-gradient(to right, #c2e59c, #64b3f4)'};
//   z-index: -1;
//   overflow: hidden;
//   transition: background 0.5s ease; /* 배경색 변경 애니메이션 */
// `;

const GradientBox = styled(Box, { shouldForwardProp: (prop) => prop !== 'whiteBackground' })<{ whiteBackground?: boolean }>`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: ${(props) =>
    props.whiteBackground
      ? 'white'
      : 'linear-gradient(to right, #c2e59c, #64b3f4)'};
  z-index: -1;
  overflow: hidden;
  transition: background 0.5s ease; /* 배경색 변경 애니메이션 */
`;


const CustomButton = styled(Button)`
  margin: 8px;
  padding: 8px 15px;
  color: white;
  background-color: lightblue;
  min-width: 100px; /* 버튼 너비를 지정하여 일관성 유지 */
  text-align: center; /* 텍스트를 가운데 정렬 */
  &:hover {
    background-color: blue;
  }
`;


const ButtonContainer = styled(Box)`
  position: absolute;
  top: 20px; /* Move buttons to the top */
  right: 20px; /* Move buttons to the right */
  display: flex;
  flex-direction: row; /* Align buttons horizontally */
  align-items: center; /* Center buttons vertically if they have different heights */
  gap: 10px; /* Space between buttons */
`;


const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};


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

const LandingPage: React.FC = () => {
  // const [showTitle, setShowTitle] = useState(false);
  
  const [isHowGeneratedVisible, setHowGeneratedVisible] = useState(false);
  const [isGoodGeneratorVisible, setGoodGeneratorVisible] = useState(false);
  const [whiteBackground, setWhiteBackground] = useState(false); 
  const [isCopyright1Visible, setCopyright1Visible] = useState(false);
  const [isCopyright2Visible, setCopyright2Visible] = useState(false);
  const [isCopyright3Visible, setCopyright3Visible] = useState(false);

 
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowTitle(true);
  //   }, 1000);

  //   return () => clearTimeout(timer); 
  // }, []);


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


    setTimeout(() => {
      const bodycontent1 = document.querySelector('.bodycontent1');
      bodycontent1?.classList.add('show');
      
      const initialContent = document.querySelector('.initial-hide');
      initialContent?.classList.add('show');
    }, 1000);


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
    const containerHeight = scrollContainer.current.clientHeight;
    const scrollAmount = containerHeight*0.9;
    scrollContainer.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    
    setWhiteBackground(true);
  };


  const handleScroll = () => {
    if (!scrollContainer.current) return;
    

    const scrollTop = scrollContainer.current.scrollTop;


    if (scrollTop > (scrollContainer.current.scrollHeight / 2 )) {
      setWhiteBackground(false);
    } else if (scrollTop <= 0) {
      setWhiteBackground(false); 
    } 
    // else {
    //   setWhiteBackground(false);
    // }

    // if (scrollTop <= 0) {
    //   setWhiteBackground(false);
    // }
  };


  useEffect(() => {
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }


    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const createBubble = () => {
      const section = document.querySelector('section');
      if (!section) return;

      const createElement = document.createElement('span');
      const size = Math.random() * 60;

      createElement.style.width = 20 + size + 'px';
      createElement.style.height = 20 + size + 'px';
      createElement.style.left = Math.random() * window.innerWidth + "px";
      createElement.style.position = 'absolute'; // Ensure bubbles are positioned correctly
      section.appendChild(createElement);

      setTimeout(() => {
        createElement.remove();
      }, 4000);
    };

    const intervalId = setInterval(createBubble, 50);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <GradientBox whiteBackground={whiteBackground} />
      <Box className="overlay">
        <ButtonContainer>
          <CustomButton onClick={() => window.location.href = '/login'}>
            로그인
          </CustomButton>
          <CustomButton onClick={() => window.location.href = '/storyboat'}>
            메인으로
          </CustomButton>
        </ButtonContainer>
      </Box>

      <div style={{ overflow: 'hidden', height: '100vh', margin: '0' }}>
        {/* Scroll Container */}
        <div 
          ref={scrollContainer} 
          style={{
            overflowY: 'auto',
            maxHeight: 'calc(120vh - 100px)', 
            padding: '20px',
          }}
        >
          <div>
            <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '40px auto' }}>
              <div className="totalbody">
                <div className="bodycontent0"><br /></div>
                <div className="caro-item-text">
                  
                  
                  
                  {/* <div className="bodycontent1">
                    <div
                      className="v-carousel"
                      style={{ overflow: 'hidden', height: '600px' }}
                    >
                      <div className="v-carousel-item">
                        <div className="caro-item-text initial-hide">
                          <div className="title">
                            
                              <p>&nbsp;&nbsp;환영합니다</p>
                              <p><span className="color">&nbsp;&nbsp;<span className="pink-text">스토리보트</span></span>에 어서오세요</p>

                          </div>
                          <br/>
                          &nbsp;&nbsp;
                          <a href="Article" className="btn btn-block custom-btn zindex initial-hide">
                            AI 그림 생성기 바로가기
                          </a>
                          
                      
                        </div>
                      </div>
                    </div>
                  </div> */}

                    <section className="bubble-section" style={{ position: 'relative',width: '100%', height: '100vh', overflow: 'hidden' }}>
                    <div className="bodycontent1">
                      <div className="v-carousel" style={{ overflow: 'hidden', height: '600px' }}>
                        <div className="v-carousel-item">
                          <div className="caro-item-text initial-hide">
                          <div style={{ paddingLeft: '20px' }}>
                              <p style={{ fontWeight: 'bold',color: 'black', fontSize: '3em'  }}>환영합니다</p>
                              <p style={{ fontWeight: 'bold', color: 'black', fontSize: '3em' }}>
                              <b style={{ color: 'rgb(0,102,0)' }}>스토리보트</b>에 어서오세요
                              </p>
                              {/* rgb(0,102,0) rgb(255,60,72) */}


                            </div>
                            <br/>
                            &nbsp;&nbsp;
                            <a href="Article" className="btn btn-block custom-btn zindex initial-hide">
                              AI 그림 생성기 바로가기
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>



                  <div className="bodycontent2"><br/><br/></div>
                  <div className="move_container1_parent">
                    <div className="move_container1" ref={container1}>
                      <div className="my-element1">
                      <br/><br/><br/><br/>
                      <h2>당신이 원하던 소설 제작 사이트</h2>
                      <h2>동료들과 함께 <b style={{ color: 'rgb(10,120,241)' }}>멋진 스토리</b>를 작성해보세요</h2>

                        <div className="my-image1">
                          <img src={team} alt="team" style={{ width: 'auto', height: 'auto' }} />
                          
                        </div>
                        <br/>
                      </div>
                    </div>
                  </div>
                  <img src={whitee2} alt="team" style={{ width: 'auto', height: 'auto' }} />
                  <div className="bodycontent3">
                    <div className="move_container2" ref={container2}>
                      <div className="my-element2">
                        <br/><br/><br/><br/>
                        {/* <h2>같이 소설 쓰고</h2>
                        <h2>원고의 버전도 관리하자 </h2> */}

                            <Container>
                              <CssBaseline />
                              <Typography variant="h4" gutterBottom>
                        
                              </Typography>
                              <Carousel />
                            </Container>


                        <div className="my-image2">
                          <img src={whitee} alt="Puppy" style={{ width: 'auto', height: 'auto' }} />
                        </div>
                        <img src={whitee2} alt="team" style={{ width: 'auto', height: 'auto' }} />
                      </div>
                    </div>
                  </div>
                  <div className="bodycontent4">
                    <div className="move_container3" ref={container3}>
                      <div className="my-element3">
                      <br/><br/><br/><br/>
                        <h2><b style={{ color: 'rgb(0,102,0)' }}>공동작성, 원고관리, 실시간 통화</b>까지</h2>
                        <h2>함께 소설을 작성하고 싶은 당신을 위한 최고의 서비스</h2>
                        <div className="my-image3">
                          <img src={whitee} alt="Puppy" style={{ width: 'auto', height: 'auto' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bodycontent5">
                    <div className="move_container4" ref={container4}>
                      <div className="my-element4">
                      {/* <h2>함께 쓰는 즐거움</h2>
                      <h2>함께 만드는 이야기</h2>
                      <h2>모든 이야기를 함께</h2> */}
                        <div className="my-image4">
                          {/* <img src={whitee} alt="Puppy" style={{ width: 'auto%', height: 'auto%' }} /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bodycontent6">
                    <div className="move_container5" ref={container5}>
                      <div className="my-element5">
                        {/* <h2>We are 스토리보트</h2> */}
                        <div className="my-image5">
                          <img src={boat} alt="Puppy" style={{ width: 'auto', height: 'auto' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={scrollToNextSection} 
                    style={{
                      position: 'fixed',
                      bottom: '40px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '150px',
                      height: '75px',
                      padding: '10px',
                      backgroundColor: 'transparent',
                      color: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '50%',
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
              </div>
            </div>
          </div>

          <div style={{ padding: '0px' }}>
          
            <img src={whitee2} alt="AI Painting" style={{ width: '100%', height: 'auto' }} /> 
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FAQ</h2>
            {/* <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
              최고의 AI 이미지 생성기를 사용하여 캐릭터의 이름과 특징을 멋진 삽화로 변환하세요. 소설에 딱 맞는 일러스트로 독자들의 시선을 사로잡으세요. 스토리보드의 다양한 이미지 생성기를 사용하면 이미지가 아직 존재하지 않더라도 언제든지 완벽한 이미지를 손쉽게 만들 수 있습니다. 아이디어를 시각화하는 이미지를 만들고, 창의적인 콘셉트를 스케치하거나, 이전에는 불가능했던 일을 실현해 보세요.
            </p> */}
          </div>

          <div className='togg'>
              <div>
                <hr />
                <br />
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0', lineHeight: '1.8' }} onClick={() => handleToggle(setHowGeneratedVisible)}>
                  {isHowGeneratedVisible ? 'Q1. 소설 공동 집필은 어떻게 이루어지나요?' : 'Q1.  소설 공동 집필은 어떻게 이루어지나요? ▼'}
                </h4>
                {isHowGeneratedVisible && (
                  <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    {/* 스토리보트는 사용자가 소설을 공동으로 집필할 수 있도록 돕는 플랫폼입니다. 사용자들은 실시간으로 원고를 편집하고, 서로의 작업을 쉽게 확인하며, 댓글이나 제안을 통해 협업할 수 있습니다. 플랫폼은 원고의 버전 관리를 지원하여 과거의 버전으로 되돌리거나 변경 사항을 추적하는 데 유용합니다. 또한, 실시간 음성 통화 기능을 통해 집필 중 의견을 교환하거나 아이디어를 브레인스토밍할 수 있습니다. */}
                  
                    스토리보트는 소설을 공동으로 집필할 수 있는 혁신적인 플랫폼을 제공합니다. 이 플랫폼을 통해 사용자는 실시간으로 원고를 편집하고 서로의 작업을 쉽게 확인할 수 있습니다. 사용자는 각자의 아이디어와 창의력을 바탕으로 원고에 직접 수정 및 추가를 할 수 있으며, 이러한 실시간 협업 기능은 집필 과정에서 매우 중요한 요소입니다. 스토리보트는 각 사용자에게 편리한 협업 환경을 제공하여, 다른 팀원들이 작성한 부분을 실시간으로 볼 수 있고, 동시에 자신이 작성 중인 부분도 팀원들과 공유할 수 있습니다.

                    이 플랫폼은 댓글 기능을 통해 사용자가 서로의 작업에 대한 피드백을 주고받을 수 있도록 지원합니다. 사용자는 원고의 특정 부분에 댓글을 달아 의견을 교환하거나 제안을 할 수 있으며, 이는 원고의 품질을 높이는 데 큰 도움이 됩니다. 또한, 스토리보트는 원고의 버전 관리 기능을 제공하여, 사용자가 원고의 다양한 버전을 추적하고 필요에 따라 이전 버전으로 되돌릴 수 있게 합니다. 이를 통해 공동 집필 과정에서 발생할 수 있는 오류나 불필요한 수정 사항을 쉽게 해결할 수 있습니다.

                    또한, 스토리보트는 실시간 음성 통화 기능을 통해 집필 중에 직접 의견을 교환하거나 아이디어를 브레인스토밍할 수 있는 기회를 제공합니다. 이 기능은 팀원들 간의 빠르고 효율적인 커뮤니케이션을 가능하게 하며, 집필 중 발생할 수 있는 문제를 즉시 해결하거나 새로운 아이디어를 신속하게 논의할 수 있는 장점을 가지고 있습니다. 전체적으로 스토리보트는 공동 집필을 위한 종합적인 도구를 제공하여, 사용자들이 원활하게 협력하며 고품질의 소설을 집필할 수 있도록 돕고 있습니다.
                  
                  </p>

                )}
                <br />
              </div>

              <hr />
              <br />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0', lineHeight: '1.8' }} onClick={() => handleToggle(setGoodGeneratorVisible)}>
                  {isGoodGeneratorVisible ? 'Q2. 스토리보트의 원고 버전 관리는 어떻게 이루어지나요?' : 'Q2. 스토리보트의 원고 버전 관리는 어떻게 이루어지나요? ▼'}
                </h4>
                {isGoodGeneratorVisible && (
                  <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    {/* 스토리보트의 원고 버전 관리 기능은 사용자가 작성한 원고의 모든 버전을 자동으로 기록합니다. 이를 통해 작성 중인 원고의 이전 버전으로 쉽게 돌아가거나, 특정 변경 사항을 추적할 수 있습니다. 사용자들은 원고의 버전을 비교하고, 변경된 내용을 확인하며, 팀원들과의 협업을 더욱 원활하게 진행할 수 있습니다. 이 기능은 공동 집필 시 필수적인 요소로, 글의 발전 과정을 명확히 볼 수 있게 해줍니다. */}
                  
                    스토리보트의 원고 버전 관리 기능은 사용자가 작성한 모든 원고 버전을 자동으로 기록하고 관리하는 시스템을 제공합니다. 이 기능은 사용자가 작성한 원고의 각 버전을 시간순으로 저장하며, 이를 통해 사용자는 언제든지 이전 버전으로 쉽게 돌아갈 수 있습니다. 원고의 각 버전은 자동으로 기록되며, 사용자는 이를 통해 원고의 발전 과정을 명확하게 추적할 수 있습니다.

                    원고의 버전 관리 기능은 공동 집필을 더욱 원활하게 만드는 중요한 도구입니다. 예를 들어, 팀원들이 동시에 원고를 수정하거나 추가하는 과정에서 충돌이 발생할 수 있지만, 스토리보트는 이러한 변경 사항을 자동으로 기록하고, 사용자가 각 버전의 차이를 비교할 수 있게 합니다. 이를 통해 사용자는 특정 변경 사항이 원고에 미친 영향을 분석하거나, 이전 버전으로 돌아가서 원고를 수정할 수 있는 옵션을 가지게 됩니다.

                    또한, 스토리보트의 버전 관리 기능은 팀원들 간의 협업을 더 원활하게 진행할 수 있도록 돕습니다. 사용자는 원고의 특정 버전을 비교하고 변경 사항을 확인할 수 있으며, 이를 통해 팀원들과의 협업 과정에서 발생할 수 있는 혼란을 최소화할 수 있습니다. 이 기능은 특히 공동 집필 시 원고의 발전 과정을 투명하게 보여주며, 팀원들이 각자의 기여를 명확히 확인할 수 있게 해줍니다. 전체적으로, 스토리보트의 원고 버전 관리 기능은 공동 집필을 위한 필수적인 도구로, 사용자가 원고를 효과적으로 관리하고 협력할 수 있도록 지원합니다.
                  
                  </p>
                )}
                <br />
              </div>

              <hr />
              <br />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0', lineHeight: '1.8' }} onClick={() => handleToggle(setCopyright1Visible)}>
                  {isCopyright1Visible ? 'Q3.  작성한 원고의 저작권은 누구에게 있나요?' : 'Q3.  작성한 원고의 저작권은 누구에게 있나요? ▼'}
                </h4>
                {isCopyright1Visible && (
                  <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                     {/* 작성한 원고의 저작권은 해당 원고를 작성한 사용자에게 귀속됩니다. 협업을 통해 공동으로 집필한 원고의 경우, 저작권은 협업에 참여한 모든 사용자에게 공동으로 속하게 됩니다. 스토리보트는 사용자들이 작성한 원고를 호스팅하고, 이를 기반으로 추가적인 서비스를 제공할 수 있는 권리를 가집니다. 저작권 관련 세부 사항은 스토리보트의 이용 약관을 참고해 주세요. */}
                     작성한 원고의 저작권은 해당 원고를 실제로 작성한 사용자에게 귀속됩니다. 이는 스토리보트 플랫폼을 사용하는 모든 개인과 팀에 적용되는 원칙입니다. 예를 들어, 사용자가 스토리보트에서 개별적으로 원고를 작성하거나 팀과 협력하여 공동으로 원고를 집필하는 경우, 해당 원고의 저작권은 원고를 작성한 개인이나 팀원들에게 귀속됩니다. 이는 사용자가 자신의 창작물을 법적으로 보호받을 수 있도록 보장하는 중요한 사항입니다.

                      협업을 통해 공동으로 집필한 원고의 경우, 저작권은 협업에 참여한 모든 사용자에게 공동으로 속하게 됩니다. 이러한 경우에는 저작권이 공동 소유로 간주되며, 협업에 참여한 모든 팀원들이 원고의 사용과 관련된 권리를 공유하게 됩니다. 이는 공동 작업의 결과물에 대한 공정한 권리 분배를 보장하기 위한 조치입니다. 공동 저작권의 경우, 원고의 사용이나 배포에 대한 결정은 일반적으로 협업에 참여한 모든 사용자의 동의가 필요합니다.

                      스토리보트는 사용자들이 작성한 원고를 호스팅하고, 이를 기반으로 추가적인 서비스를 제공할 수 있는 권리를 가집니다. 즉, 스토리보트는 플랫폼의 기능을 통해 원고를 저장하고, 사용자들이 작성한 원고에 대해 기술적 지원을 제공할 수 있습니다. 그러나 원고의 실제 저작권은 여전히 원작자나 공동 작업자들에게 귀속됩니다. 저작권 관련 세부 사항은 스토리보트의 이용 약관 및 서비스 계약서에서 확인할 수 있으며, 이는 사용자가 자신의 권리와 의무를 명확히 이해하고 준수할 수 있도록 돕습니다.
                  
                  </p>
                )}
                <br />
              </div>

              <hr />
              <br />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0', lineHeight: '1.8' }} onClick={() => handleToggle(setCopyright2Visible)}>
                  {isCopyright2Visible ? 'Q4. 실시간 음성 통화 기능은 어떻게 사용하나요?' : 'Q4. 실시간 음성 통화 기능은 어떻게 사용하나요? ▼'}
                </h4>
                {isCopyright2Visible && (
                  <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    {/* 스토리보트의 실시간 음성 통화 기능을 사용하면, 집필 중인 팀원들과 직접 소통하며 아이디어를 즉시 교환할 수 있습니다. 이 기능은 사용자가 웹사이트 내에서 직접 음성 통화를 할 수 있도록 지원하며, 통화 중에도 원고를 공유하고 수정할 수 있습니다. 음성 통화 기능은 집필 과정에서 협업을 강화하고, 더 나은 결과물을 얻는 데 도움을 줍니다. */}
                  
                    스토리보트의 실시간 음성 통화 기능은 사용자가 집필 중인 원고에 대해 팀원들과 즉시 소통할 수 있는 매우 유용한 도구입니다. 이 기능을 통해 사용자는 웹사이트 내에서 직접 음성 통화를 진행하며, 통화 중에도 원고를 공유하고 실시간으로 수정할 수 있습니다. 이 기능은 팀원들 간의 원활한 커뮤니케이션을 가능하게 하며, 집필 과정에서 즉각적인 피드백과 논의가 가능하게 합니다.

                    음성 통화 기능을 사용하기 위해서는 사용자가 스토리보트의 웹사이트에 로그인하고, 해당 기능을 활성화하여 팀원들과 통화를 시작할 수 있습니다. 통화 중에는 사용자가 원고를 함께 보고 수정할 수 있는 기능이 제공되며, 이는 팀원들이 집필 과정에서 발생하는 다양한 아이디어를 즉시 논의하거나 문제를 해결할 수 있는 기회를 제공합니다. 음성 통화 기능은 또한 실시간으로 협업을 강화하고, 집필 과정에서의 의사소통을 개선하는 데 큰 도움이 됩니다.

                    또한, 음성 통화 기능은 다양한 협업 도구와 통합되어 있어, 사용자가 통화 중에 원고의 특정 부분을 강조하거나 수정 사항을 실시간으로 적용할 수 있습니다. 이를 통해 팀원들은 보다 효과적으로 협업할 수 있으며, 집필 과정에서의 창의적이고 생산적인 논의를 촉진할 수 있습니다. 스토리보트의 실시간 음성 통화 기능은 협업을 강화하고, 더 나은 결과물을 도출하는 데 중요한 역할을 하며, 팀원들이 원활하게 소통하고 아이디어를 공유할 수 있도록 돕습니다.
                  
                  </p>
                )}
                <br />
              </div>

              <hr />
              <br />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0', lineHeight: '1.8' }} onClick={() => handleToggle(setCopyright3Visible)}>
                  {isCopyright3Visible ? 'Q5.  아이디어 플롯 회의는 어떻게 진행되나요?' : 'Q5.  아이디어 플롯 회의는 어떻게 진행되나요? ▼'}
                </h4>
                {isCopyright3Visible && (
                  <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    {/* 스토리보트의 아이디어 플롯 회의 기능은 팀원들이 함께 모여 아이디어를 공유하고 플롯을 구성하는 데 도움을 줍니다. 사용자는 온라인 회의 도구를 통해 실시간으로 의견을 교환하며, 아이디어를 시각적으로 정리할 수 있는 다양한 도구를 제공합니다. 회의 중 생성된 아이디어와 논의는 원고에 직접 반영하거나 별도의 문서로 저장하여 협업에 활용할 수 있습니다. */}
                  
                    스토리보트의 아이디어 플롯 회의 기능은 팀원들이 함께 모여 아이디어를 공유하고 플롯을 구성하는 데 매우 유용한 도구입니다. 이 기능은 온라인 회의 도구를 통해 실시간으로 의견을 교환하며, 아이디어를 시각적으로 정리할 수 있는 다양한 도구를 제공합니다. 사용자는 이 기능을 통해 집필 과정에서 필요한 모든 논의와 계획을 효과적으로 진행할 수 있습니다.

                    아이디어 플롯 회의를 진행하기 위해 사용자는 스토리보트 플랫폼에서 회의 도구를 활성화하고, 팀원들과의 회의 세션을 설정할 수 있습니다. 회의 중에는 다양한 시각적 도구를 사용하여 아이디어를 정리하고, 플롯의 구조를 명확하게 시각화할 수 있습니다. 예를 들어, 사용자는 다이어그램, 그래프, 또는 플로우차트 등을 활용하여 플롯의 흐름을 정리하거나 아이디어를 구체화할 수 있습니다. 이러한 시각적 도구는 팀원들이 각자의 아이디어를 명확하게 표현하고, 집필 과정에서의 방향성을 공유하는 데 큰 도움이 됩니다.

                    회의 중에 생성된 아이디어와 논의는 원고에 직접 반영하거나 별도의 문서로 저장하여 협업에 활용할 수 있습니다. 이를 통해 팀원들은 회의에서 논의된 사항을 원고에 적용하거나, 추후에 참고할 수 있는 문서를 작성하여 협업의 효율성을 높일 수 있습니다. 아이디어 플롯 회의 기능은 집필 과정에서의 창의적인 논의와 협력을 지원하며, 팀원들이 함께 모여 효과적으로 아이디어를 교환하고 플롯을 구성할 수 있는 기회를 제공합니다.

                    스토리보트의 아이디어 플롯 회의 기능은 전체적으로 팀원들이 협력하여 소설을 집필하는 과정에서 발생할 수 있는 다양한 아이디어를 시각적으로 정리하고, 집필 방향성을 명확히 할 수 있도록 돕습니다. 이를 통해 팀원들은 보다 체계적이고 효율적으로 집필을 진행할 수 있으며, 창의적이고 고품질의 결과물을 도출할 수 있습니다.
                  
                  </p>
                )}
                <br />
              </div>

              {/* <hr /> */}
              <br/> <br/><br/><br/><br/><br/><br/>
            </div>

              
              
              <Footer />
           
        </div>
        
      </div>
      
     
    </>
  );
};

export default LandingPage;
