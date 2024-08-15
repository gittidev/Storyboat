import React, { useState } from 'react';
import './Faq.css'; // Importing the CSS file

const Faq: React.FC = () => {
  const [isHowGeneratedVisible, setHowGeneratedVisible] = useState(false);
  const [isGoodGeneratorVisible, setGoodGeneratorVisible] = useState(false);
  const [isPricingModelVisible, setPricingModelVisible] = useState(false);
  const [isSupportOptionsVisible, setSupportOptionsVisible] = useState(false);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev);
  };

  return (
    <div className='Faqbody'>
      <div className="faq-container">
        <br/><br/>
        <h2 className="faq-title">FAQ</h2>

        <div className="faq-item">
          <hr />
          <h4 onClick={() => handleToggle(setHowGeneratedVisible)}>
            {isHowGeneratedVisible ? 'Q1. 소설 공동 집필은 어떻게 이루어지나요?' : 'Q1. 소설 공동 집필은 어떻게 이루어지나요? ▼'}
          </h4>
          {isHowGeneratedVisible && (
            <p>
              스토리보트는 소설을 공동으로 집필할 수 있는 혁신적인 플랫폼을 제공합니다. 이 플랫폼을 통해 사용자는 실시간으로 원고를 편집하고 서로의 작업을 쉽게 확인할 수 있습니다. 사용자는 각자의 아이디어와 창의력을 바탕으로 원고에 직접 수정 및 추가를 할 수 있으며, 이러한 실시간 협업 기능은 집필 과정에서 매우 중요한 요소입니다. 스토리보트는 각 사용자에게 편리한 협업 환경을 제공하여, 다른 팀원들이 작성한 부분을 실시간으로 볼 수 있고, 동시에 자신이 작성 중인 부분도 팀원들과 공유할 수 있습니다.
              
              이 플랫폼은 댓글 기능을 통해 사용자가 서로의 작업에 대한 피드백을 주고받을 수 있도록 지원합니다. 사용자는 원고의 특정 부분에 댓글을 달아 의견을 교환하거나 제안을 할 수 있으며, 이는 원고의 품질을 높이는 데 큰 도움이 됩니다. 
              <br /><br />또한, 스토리보트는 원고의 버전 관리 기능을 제공하여, 사용자가 원고의 다양한 버전을 추적하고 필요에 따라 이전 버전으로 되돌릴 수 있게 합니다. 이를 통해 공동 집필 과정에서 발생할 수 있는 오류나 불필요한 수정 사항을 쉽게 해결할 수 있습니다.
              
              또한, 스토리보트는 실시간 음성 통화 기능을 통해 집필 중에 직접 의견을 교환하거나 아이디어를 브레인스토밍할 수 있는 기회를 제공합니다. 이 기능은 팀원들 간의 빠르고 효율적인 커뮤니케이션을 가능하게 하며, 집필 중 발생할 수 있는 문제를 즉시 해결하거나 새로운 아이디어를 신속하게 논의할 수 있는 장점을 가지고 있습니다. 전체적으로 스토리보트는 공동 집필을 위한 종합적인 도구를 제공하여, 사용자들이 원활하게 협력하며 고품질의 소설을 집필할 수 있도록 돕고 있습니다.
            </p>
          )}
        </div>

        <hr />
        <div className="faq-item">
          <h4 onClick={() => handleToggle(setGoodGeneratorVisible)}>
            {isGoodGeneratorVisible ? 'Q2. 스토리보트의 원고 버전 관리는 어떻게 이루어지나요?' : 'Q2. 스토리보트의 원고 버전 관리는 어떻게 이루어지나요? ▼'}
          </h4>
          {isGoodGeneratorVisible && (
            <p>
              스토리보트의 원고 버전 관리 기능은 사용자가 작성한 모든 원고 버전을 자동으로 기록하고 관리하는 시스템을 제공합니다. 이 기능은 사용자가 작성한 원고의 각 버전을 시간순으로 저장하며, 이를 통해 사용자는 언제든지 이전 버전으로 쉽게 돌아갈 수 있습니다. 원고의 각 버전은 자동으로 기록되며, 사용자는 이를 통해 원고의 발전 과정을 명확하게 추적할 수 있습니다.
              
              원고의 버전 관리 기능은 공동 집필을 더욱 원활하게 만드는 중요한 도구입니다. 예를 들어, 팀원들이 동시에 원고를 수정하거나 추가하는 과정에서 충돌이 발생할 수 있지만, 스토리보트는 이러한 변경 사항을 자동으로 기록하고, 사용자가 각 버전의 차이를 비교할 수 있게 합니다. 이를 통해 사용자는 특정 변경 사항이 원고에 미친 영향을 분석하거나, 이전 버전으로 돌아가서 원고를 수정할 수 있는 옵션을 가지게 됩니다.
            </p>
          )}
        </div>

        <hr />
        <div className="faq-item">
          <h4 onClick={() => handleToggle(setPricingModelVisible)}>
            {isPricingModelVisible ? 'Q3. 스토리보트의 가격 모델은 어떻게 구성되어 있나요?' : 'Q3. 스토리보트의 가격 모델은 어떻게 구성되어 있나요? ▼'}
          </h4>
          {isPricingModelVisible && (
            <p>
              스토리보트의 가격 모델은 현재 준비 중이며, 곧 다양한 사용자 요구를 반영한 플랜을 출시할 예정입니다. 사용자는 필요에 따라 다양한 기능과 저장 공간을 선택할 수 있는 유연한 플랜을 이용할 수 있게 될 것입니다. 자세한 내용은 추후 공지될 예정이니, 지속적으로 업데이트를 확인해 주세요.
            </p>
          )}
        </div>

        <hr />
        <div className="faq-item">
          <h4 onClick={() => handleToggle(setSupportOptionsVisible)}>
            {isSupportOptionsVisible ? 'Q4. 스토리보트는 어떤 지원 옵션을 제공하나요?' : 'Q4. 스토리보트는 어떤 지원 옵션을 제공하나요? ▼'}
          </h4>
          {isSupportOptionsVisible && (
          <p>
            스토리보트는 사용자가 플랫폼을 원활하게 사용할 수 있도록 다양한 지원 옵션을 제공합니다. 사용자는 이메일을 통해 기술 지원을 요청할 수 있으며, 스토리보트의 지원 팀은 신속하고 전문적인 답변을 제공하여 사용자의 문제를 최대한 빠르게 해결하기 위해 노력하고 있습니다.
          
            또한, 플랫폼 사용 중 발생할 수 있는 문제나 궁금한 사항에 대해 고객 지원을 통해 직접 도움을 받을 수 있습니다. 지원 팀은 사용자들이 스토리보트를 효과적으로 활용할 수 있도록 맞춤형 조언과 해결책을 제공합니다.
          
            이러한 지원 옵션은 사용자들이 스토리보트를 최대한 활용할 수 있도록 돕고, 필요한 경우 빠르게 도움을 받을 수 있도록 설계되었습니다.
          </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faq;
