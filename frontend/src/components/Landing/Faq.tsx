import React, { useState } from 'react';
import './Faq.css'; // Importing the CSS file

const Faq: React.FC = () => {
  const [isHowGeneratedVisible, setHowGeneratedVisible] = useState(false);
  const [isGoodGeneratorVisible, setGoodGeneratorVisible] = useState(false);
  const [isSecurityFeaturesVisible, setSecurityFeaturesVisible] = useState(false);
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
        <h4 onClick={() => handleToggle(setSecurityFeaturesVisible)}>
          {isSecurityFeaturesVisible ? 'Q3. 스토리보트는 어떤 보안 기능을 제공하나요?' : 'Q3. 스토리보트는 어떤 보안 기능을 제공하나요? ▼'}
        </h4>
        {isSecurityFeaturesVisible && (
          <p>
            스토리보트는 사용자의 데이터를 보호하기 위해 다양한 보안 기능을 제공합니다. 먼저, 모든 데이터는 전송 중에도 암호화되어, 외부로부터의 공격이나 유출로부터 안전하게 보호됩니다. 스토리보트는 최신 보안 프로토콜을 적용하여 사용자가 안심하고 플랫폼을 사용할 수 있도록 보장합니다.
          
            또한, 스토리보트는 정기적인 보안 업데이트와 취약점 점검을 통해 시스템의 안전성을 유지하고 있습니다. 이를 통해 새로운 위협이나 취약점이 발견될 경우 신속하게 대응할 수 있으며, 사용자의 정보가 보호될 수 있도록 지속적으로 노력하고 있습니다.
            
            사용자 계정 보안을 위해 스토리보트는 2단계 인증(2FA) 기능도 제공합니다. 이를 통해 사용자는 자신의 계정에 추가적인 보안을 적용할 수 있으며, 비밀번호 외에도 추가적인 인증 수단을 통해 계정을 보호할 수 있습니다. 전체적으로 스토리보트는 사용자의 데이터와 개인 정보를 보호하기 위한 종합적인 보안 솔루션을 제공합니다.
          </p>
        )}
      </div>

      <hr />
      <div className="faq-item">
        <h4 onClick={() => handleToggle(setPricingModelVisible)}>
          {isPricingModelVisible ? 'Q4. 스토리보트의 가격 모델은 어떻게 구성되어 있나요?' : 'Q4. 스토리보트의 가격 모델은 어떻게 구성되어 있나요? ▼'}
        </h4>
        {isPricingModelVisible && (
          <p>
            스토리보트는 다양한 사용자 니즈를 충족시키기 위해 여러 가지 가격 모델을 제공합니다. 기본적으로 무료 플랜이 제공되어, 사용자는 기본적인 기능을 제한 없이 이용할 수 있습니다. 하지만, 보다 고급 기능이나 추가적인 저장 공간이 필요한 경우 유료 플랜을 선택할 수 있습니다.
            
            유료 플랜은 월별 또는 연간 구독 형태로 제공되며, 사용자에게 더 많은 기능과 확장성을 제공합니다. 예를 들어, 실시간 협업 기능, 추가 저장 공간, 고급 버전 관리 도구, 그리고 우선 지원 등의 혜택을 포함합니다. 사용자는 자신의 필요에 따라 적절한 플랜을 선택하여 사용할 수 있습니다.
           
            스토리보트는 또한 팀 및 기업 사용자를 위한 맞춤형 플랜도 제공하며, 대규모 협업이나 특정 요구 사항이 있는 경우 이 플랜을 통해 더욱 효과적으로 플랫폼을 활용할 수 있습니다. 이러한 다양한 가격 모델은 사용자에게 유연성을 제공하며, 필요한 만큼만 비용을 지불하도록 합니다.
          </p>
        )}
      </div>

      <hr />
      <div className="faq-item">
        <h4 onClick={() => handleToggle(setSupportOptionsVisible)}>
          {isSupportOptionsVisible ? 'Q5. 스토리보트는 어떤 지원 옵션을 제공하나요?' : 'Q5. 스토리보트는 어떤 지원 옵션을 제공하나요? ▼'}
        </h4>
        {isSupportOptionsVisible && (
          <p>
            스토리보트는 사용자에게 다양한 지원 옵션을 제공합니다. 기본적으로, 사용자는 플랫폼 내에서 제공되는 도움말 센터를 통해 자주 묻는 질문(FAQ)과 사용 가이드를 이용할 수 있습니다. 여기에는 일반적인 문제 해결 방법과 플랫폼 사용에 대한 자세한 설명이 포함되어 있습니다.
            
            추가적으로, 사용자들은 이메일을 통해 기술 지원을 받을 수 있습니다. 스토리보트의 지원 팀은 신속하고 전문적인 답변을 제공하며, 사용자들의 문제를 최대한 빠르게 해결하기 위해 노력합니다. 또한, 유료 플랜 사용자의 경우 우선 지원 서비스를 제공하여, 보다 신속한 문제 해결이 가능합니다.
            <br /><br />
            더불어, 스토리보트는 커뮤니티 포럼을 운영하여 사용자들 간의 정보 교환과 문제 해결을 지원합니다. 사용자는 이곳에서 다른 사용자들과 경험을 공유하고, 서로의 질문에 답변을 제공함으로써 공동체의 일원으로서 활동할 수 있습니다.
            
            마지막으로, 기업 사용자나 대규모 팀을 위한 맞춤형 지원 옵션도 제공됩니다. 이 옵션을 통해 전담 지원 매니저를 배정받아 보다 세부적인 지원과 컨설팅을 받을 수 있으며, 스토리보트를 최대한 활용할 수 있도록 돕습니다.
          </p>
        )}
      </div>
    </div>
    </div>

  );
};

export default Faq;
