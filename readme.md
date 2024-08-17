# ⛵ Story Boat 
### 공동 소설 제작 어플리케이션 

##### 프로젝트 기간 
###### 2024.07.02 ~ 2024.08.16 (약 7주)

##### 프로젝트 소개
StoryBoat는 WebRTC 기술을 활용한 실시간 협업 스토리텔링 플랫폼입니다. <br />
실시간으로 스토리를 구성하고, 플롯을 시각화하며, 아이디어를 공유할 수 있습니다.

##### 주요 기능
1. 실시간 공동 집필 가능
 WebRTC를 이용한 P2P 통신으로 빠르고 안전한 실시간 협업
 실시간 음성 통화 지원 기능, Y-WebRTC 기반 CRDT 알고리즘 적용

2. 버전관리 기능
MongoDB 를 이용한 히스토리 관리
(소설 공동 집필, 원고의 버전 관리)

3. 사용자 친화 UI/UX
ReactFlow를 사용한 직관적인 스토리 구조 시각화
MUI를 활용한 깔끔한 UI/UX 디자인

4. 동기화된 상태 관리 
Recoil과 Yjs를 활용한 효율적인 상태 관리 및 동기화

5. AI 지원 기능 
SDXL을 활용한 텍스트 기반 이미지 생성 및 AI 글쓰기 지원
DPO 방법을 활용한 프롬프트 기반 스토리 생성 기능 
React-i8next, MyMemoryAPI를 활용한 다국어 지원 기능 
ex) 한국어, 영어, 일본어, 스페인어
React-speech-kit를 활용한 텍스트 리딩 음성지원 기능


---

#### 목차


##### 📊 I. 기술 스택

##### 💁 II. 구현 화면

##### 💻 III. 주요 기술 설명

##### ☄️ IV. 트러블 슈팅  

##### 📑 V. 프로젝트 설계

##### 🐱 VI. 팀원 소개

##### 🙇 VII. 느낀 점 및 참고사항


---

<br/>

##### 📊 기술 스택

![Skill](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EA%B8%B0%EC%88%A0%EC%8A%A4%ED%83%9D2.png?ref_type=heads)


|  | Front | Back | Infra |
| --- | --- | --- |  --- |
| **Language** | TypeScript | Java |  |
| **Framework** | React, Vite | Spring Boot, Spring Security |  |
| **Library** | WebRTC, Yjs, Y-Quill<br/> Recoil, ReactFlow, Material-UI (MUI) <br/> React-i18next, React-speech-kit | JWT, JPA |  |
| **DB** |  | MongoDB, MariaDB |  |
| **Server** |  | Node.js | Amazon EC2, Nginx, Docker, Signaling Server |
| **Cloud Services** |  |  | AWS, Amazon S3 |
| **CI/CD Tools** |  |  | Jenkins, Mattermost |
| **AI** | SDXL(Stable Diffusion XL) : Stable Diffusion XL 1.0<br/>DPO(Direct Preference Optimization) : zephyr-7b-beta |  |  |

<details>
<summary>추가 설명</summary>
<div markdown="1">

WebRTC : 웹 에서 실시간 통신 지원 (음성, 비디오, 통화, 파일전송 등) <br/>
Yjs : 실시간 협업 지원 라이브러리, 여러 사용자가 동시에 문서를 편집할 때 데이터 동기화 기능  <br/>
Recoil : React 어플 상태관리 라이브러리  <br/>
ReactFlow : 대화형 플로우 차트나, 다이어그램 구현, 노드 간 연결 & 드래그 앤 드롭 기능  <br/> 
Material-UI (MUI) : React 기반 UI 구축 라이브러리  <br/>
React-i8next : 다국어 번역 기능 지원 라이브러리 <br/>
React-speech-kit : React에서 음성 인식 및 출력 기능 제공 <br/> 

Spring Security : Spring 기반 보안 기능 프레임워크, 인증과 권한부여 기능 제공  <br/>
AWS(Amazon Web Services) : 아마존에서 제공하는 클라우드 서비스 플랫폼, EC2(서버), S3(스토리지), RDS(DB) 등 다양한 서비스로 구성됩니다. <br/>
Amazon EC2 : AWS에서 제공하는 확장 가능한 가상 서버 <br/>
Amazon S3 : AWS에서 제공하는 객체 스토리지 서비스, 대규모 데이터를 저장하고 관리할 때 안정적인 저장소 제공  <br/>
Nginx : 웹 서버, 리버스 프록시 서버, 로드 밸런서, HTTP 캐시 서버로 사용됨 <br/>
Docker : 개발 환경설정, 컨테이넌화된 어플의 배포, 스타일링, 관리를 용이하게 하는 플랫폼 <br/>

SDXL : 텍스트 기반 이미지 생성 인공지능 딥러닝 모델, 고해상도 이미지 생성에 뛰어난 성능을 보입니다.(Stable Diffusion XL 1.0) <br/>
DPO : 사용자 선호도를 직접 최적화하는 머신러닝 모델의 강화학습 기법 (zephyr-7b-beta) <br/>

</div>
</details>

##### 💁 구현 화면
<details>
<summary> 1️⃣ 메인페이지 </summary>
<div markdown="1">
![메인페이지](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/%EC%83%88%20%EB%B2%84%EC%A0%84/1._%EB%A9%94%EC%9D%B8_%EB%8B%A4%EC%8B%9C_.gif)
<br><br>네비게이션바를 사용해서 반응형으로 제작
<br>
</div>
</details>
<details>
<summary> 2️⃣ 프로필 페이지  </summary>
<div markdown="1">
![프로필 페이지](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/3.%ED%94%84%EB%A1%9C%ED%95%84.jpg?ref_type=heads)
![로그인](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/%EC%83%88%20%EB%B2%84%EC%A0%84/2._login.gif)
<br><br>회원의 기본 정보를 출력
<br>
</div>
</details>
<details>
<summary> 3️⃣ 스토리 작성   </summary>
<div markdown="1">
![스토리 작성1](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/AFTER_IMG/2.1_%ED%94%8C%EB%A1%AF_%EC%9E%91%EC%84%B1.gif)
![스토리 작성2](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/AFTER_IMG/2.2_%EC%8A%A4%ED%86%A0%EB%A6%AC_%EC%9E%91%EC%84%B1.gif)
<br> CRUD 기능 구현
<br>
</div>
</details>
<details>
<summary> 4️⃣ 팀원 모집 </summary>
<div markdown="1">
![팀 찾기1](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/%EC%83%88%20%EB%B2%84%EC%A0%84/5._%ED%8C%80_%EC%B0%BE%EA%B8%B0.gif)
</div>
</details>

<details>
<summary> 5️⃣ 캐릭터 보관함 </summary>
<div markdown="1">
![캐릭터 보관함1](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/%EC%83%88%20%EB%B2%84%EC%A0%84/%EC%BA%90%EB%A6%AD%ED%84%B0_2__1_.gif)
<br><br>캐릭터 카드 생성, 이미지 업로드 및 수정기능
 <br>
 </div>
</details>
<details>
<summary> 6️⃣ AI 글쓰기, 그림그리기 </summary>
<div markdown="1">
![그림그리기](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/AFTER_IMG/6.1_AI_%EA%B7%B8%EB%A6%BC%EA%B7%B8%EB%A6%AC%EA%B8%B0.gif?ref_type=heads)
![글쓰기](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/AFTER_IMG/6.2_AI_%EA%B8%80%EC%93%B0%EA%B8%B0.gif?ref_type=heads)
<br> AI를 활용한 글쓰기 및 그림그리기 
<br> 
<br>
 </div>
</details>

##### 💻 주요 기술 설명 
<details>
<summary> 1️⃣ WebRTC </summary>
<div markdown="1">

![WebRTC](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/WebRTC1.png?ref_type=heads)

WebRTC는 웹 브라우저 간의 p2p 통신을 가능하게 하는 기술입니다. WebRTC는 연결 방식에 따라 Mesh, SFU, MCU 방식으로 구현할 수 있습니다. 서로 다른 클라이언트가 통신하기 위해선, 서로의 정보를 알아야 합니다. 이 정보를 조회하기 위해 Signal Server를 이용합니다.
<br/>

#### SignalServer

![WebRTC](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/WebRTC2.png?ref_type=heads)

클라이언트는 ICE를 통해 수집한 네트워크 연결 정보를 시그널 서버로 SDP로 전달합니다. ICE(Interactive Connectivity Establishment)는 피어 간의 최적의 경로를 찾아주는 프레임워크이며, 내부적으로 STUN을 통해 공인 IP와 포트를 조회합니다. 만약 방화벽 등으로 인해 직접 접근이 불가능한 경우, TURN을 통해 우회 접근할 수 있습니다. SDP(Session Description Protocol)는 ICE로 찾아낸 클라이언트 정보를 포함한 통신을 위한 정보를 송수신 하기 위한 프로토콜 입니다.Offer와 Answer를 통해 상호 연결을 시도하며, 이를 통해 클라이언트 간의 통신 경로가 설정됩니다. 시그널링 서버는 이 과정에서 필요한 정보를 중계하며, 연결이 성립된 이후에는 클라이언트 간의 직접 통신이 가능합니다.

</div>
</details>

<details>
<summary> 2️⃣ 그림그리기 : SDXL(AI 텍스트 기반 이미지 생성 모델) </summary>
<div markdown="1">

SDXL은 Diffusion 모델을 기반으로 하며, 큰 해상도를 가진 이미지를 생성하는 데 사용됩니다. Diffusion은 이미지 생성에 사용되는 확률적 생성 모델로, 이미지의 픽셀 값을 조금씩 변화시키면서 점진적으로 이미지를 생산합니다. 이 과정에서 노이즈가 이미지에 점진적으로 누적되면서  더 큰 해상도의 이미지를 생성할 수 있게 됩니다.

![SDXL1](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/SXDL1.jpg?ref_type=heads)

저희는 이 과정에서 Segmind API를 사용하였습니다. COYO-700M과 LAION-2B에서 가져온 이미지-텍스트 쌍을 기반으로 대규모 데이터셋을 형성하였고, SDXL 모델을 활용하여 학습이 완료된 모델을 활용한 것입니다. 이 모델에 prompt를 입력하면, 텍스트에 기반한 이미지가 생성되며 더 정교한 설명을 할수록 원하는 이미지에 근접할 확률이 높아집니다 

![SDXL2](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/SXDL2.jpg?ref_type=heads)

</div>
</details>

<details>
<summary> 3️⃣ 글쓰기 : DPO(H4zephyr-7b-beta 프롬프트 기반 텍스트 생성 모델) </summary>
<div markdown="1">


Zephyr 모델은 DPO(Deep Proportional Optimization) 강화 학습 훈련방법을 기반으로 한 인공지능 모델로, 파라미터를 비율적으로 조정하여 최적화하였습니다. UltraFeedback의 64000개의 프롬프트 오픈 소스 데이터셋을 사용하였고, 2023년 11월에 출시되었습니다. 저희는 Hugging Face에서 제공하는 Inference를 사용하여, 이 모델을 활용하였습니다. 서버가 없어도 사용할 수 있고, TypeScript에서 라이브러리의 형태로 간편하게 모델을 불러올 수 있다는 장점이 있습니다. 다만, 이 모델은 영어 input과 output만 가능하기 때문에 중간에 오픈소스 MyMemory API 를 사용해서 번역하는 기능을 추가했습니다.  

LLM 자연어 처리 모델을 평가하기 위해서, 사용되는 지표는 여러가지 있습니다. 그 중 MT-Bench와 같은 경우에는 모델이 대화의 일관성을 잘 유지하는지, 상황을 잘 이해하고 있는지 평가하는 지표입니다. AlpacaEval은 모델의 응답 품질을 평가하고, 모델이 주어진 프롬프트에 대해 얼마나 잘 반응하는지 측정하는 역할을 합니다. 

![Zephyr](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/Zephyr.jpg)

같은 Size 즉, 같은 프롬포트 Size에서 비교해봤을 때 Zephyer는 상당히 높은 MT-Bench, AlpacaEval 값을 가집니다. Size를 크게 해서 비교를 해봤을 때, GPT-3.5-turbo보다는 높은 값을 가지며, GPT-4보다는 아쉬운 성능을 가지고 있습니다. Size 값에 대해서 추가로 설명을 하자면, 이 Size는 매개변수의 사이즈를 이야기합니다. 파라미터가 클수록 메모리 요구량이 많고,  필요한 데이터 양이 많으며, 전력 소모량이 큽니다. AI 모델은 우리 뇌의 시냅스를 본따 만들었다고 하는데, 이 시냅스가 AI에서 파라미터 또는 매개변수 값인 것입니다. 최근에는 gpt처럼 다재다능한 LLM 모델 말고도, 특수한 상황에서만 사용하는, parameter를 줄인 small LLM도 많이 개발 중입니다. 그러한 상황에서 저희가 LLM 모델로 Zephyr을 선택한 것은 Size 대비 뛰어난 성능을 가지고 있고, 오픈 소스이며, TypeScript 환경에서 라이브러리 형태로 출력할 수 있는 Inference를 제공하기 때문입니다.

참고 사이트 <br/>
[Hugging Face Zephyr-7B Beta 모델](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta)
<br/>
[Hugging Face Alignment Handbook](https://github.com/huggingface/alignment-handbook)


</div>
</details>

<details>
<summary> 4️⃣ 도커와 젠킨스 </summary>
<div markdown="1">

![도커와 젠킨스](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EB%8F%84%EC%BB%A4%EC%99%80%EC%A0%A0%ED%82%A8%EC%8A%A41.jpg?ref_type=heads)

간혹 맥북을 사용하는 친구들이 맥북이 불편하다며 윈도우를 깔아서 작업하는 광경을 볼 수 있습니다. 이 과정에서 사용하는 기술을 **가상머신(Virtual Machine, VM)이라고 합니다.**
**가상머신**은 **하이퍼바이저**라는 소프트웨어를 사용하여 호스트의 하드웨어 자원을 가상화하고, 여러 가상 운영 체제를 실행할 수 있게 합니다. 즉, 하이퍼바이저는 호스트 시스템의 하드웨어 자원을 분리하여 각각의 가상머신에 할당하고, 각 가상머신에 운영 체제를 별도로 설치해야 합니다.
반면, **도커**는 **컨테이너화(Containerization)** 기술을 사용하여 애플리케이션을 가볍고 효율적으로 실행합니다. 도커는 호스트 운영 체제의 **커널**을 공유하면서 애플리케이션을 독립된 환경에서 실행할 수 있도록 합니다. 이렇게 함으로써, 도커는 가상머신보다 더 적은 자원으로 애플리케이션을 실행할 수 있게 됩니다.

![도커와 젠킨스](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EB%8F%84%EC%BB%A4%EC%99%80%EC%A0%A0%ED%82%A8%EC%8A%A42.png?ref_type=heads)

*여기서 "가상화"란 자원을 독립적인 환경처럼 보이게 만들어주는 기술을 의미합니다.*
도커에서는 애플리케이션을 **이미지(Image)**라는 형태로 패키징하며, 이는 마치 애플리케이션의 설계도와 같습니다. 이 이미지를 실제로 실행 가능한 환경으로 변환한 것이 **컨테이너(Container)**입니다. 즉, 이미지를 컨테이너로 변환하여 실행합니다. 그리고 이러한 이미지는 이미 많은 사람들이 생성해 놓았기 때문에, 우리는 기존의 이미지를 감사하게 가져다 사용하면 됩니다. Jenkins는 소프트웨어 구축, 테스트, 배포와 관련된 모든 종류의 작업을 자동화하는 데 사용할 수 있는 독립형 오픈 소스 자동화 서버입니다. Jenkins는 기본 시스템 패키지, Docker를 통해 설치하거나 Java Runtime Environment(JRE)가 설치된 모든 시스템에서 독립 실행형으로 실행할 수 있습니다.
</div>
</details>

##### ☄️ 트러블 슈팅
<details>
<summary> 1️⃣ Build Error </summary>
<div markdown="1">

1. no main manifest attribute, in app.jar
**build.gradle**
```
bootJar {
	enabled = true
}
jar {
	enabled = false
}

```
Plain jar vs Executable jar
**bootJar** : 라이브러리, 의존성이 포함된 Jar 파일을 생성하는 옵션
**jar** : 일반적인 jar 파일로 실행 가능한 형태가 아님!, 주로 라이브러리 JAR 파일 만들때 실행
- 둘 다 `true`로 설정할 경우, Docker build시 에러 발생
    
    ```bash
    # Dockerfile
    ...
    ARG JAR_FILE=build/libs/*.jar
    COPY ${JAR_FILE} app.jar
    ...
    # *를 특정 jar 파일명으로 수정하거나 bootJar만 빌드하도록 설정
    ```
 만약 `bootJar`를 `true`로 설정하고 `java -jar` 를 실행할 경우 에러 발생.
 no main manifest attribute, in {jar 파일명}.jar
    

2. Manifest duplicated
    
빌드 과정에서 물리적으로 두 개의 `MANIFEST.MF` 파일이 존재하지는 않지만, 여러 종속성이나 라이브러리가 각각 자신의 `MANIFEST.MF` 파일을 포함하고 있을 수 있습니다. 빌드 도구인 Gradle은 이 파일들을 병합하거나 복사하는 과정에서 중복된 항목을 처리해야 합니다.
    
`DuplicatesStrategy`를 설정하지 않으면, Gradle은 기본적으로 중복된 파일을 모두 포함하려고 하며, 이로 인해 빌드 과정에서 충돌이 발생할 수 있습니다. 따라서, `DuplicatesStrategy.EXCLUDE` 설정을 통해 중복 파일을 무시하고 첫 번째 파일만 포함하도록 지정함으로써 이러한 충돌을 방지할 수 있습니다.
    
다음은 `DuplicatesStrategy` 설정을 통해 빌드를 성공시키는 일반적인 방법입니다:
    
1. **`build.gradle` 파일에서 설정**:
        
        ```groovy
        groovy코드 복사
        bootJar {
            duplicatesStrategy = DuplicatesStrategy.EXCLUDE
        }
        
        ```
        
2. **기본적으로 병합 과정에서 발생하는 중복 처리**: 여러 종속성에서 동일한 파일을 포함하려 할 때 발생하는 문제를 방지합니다. 이 경우, 처음 발견된 파일만 포함하고 나머지는 무시합니다.
3. **빌드 성공**: 중복 파일로 인한 충돌이 발생하지 않으므로 빌드가 성공적으로 완료됩니다.
    
여기서 중요한 점은 실제로 동일한 파일(예: `MANIFEST.MF`)이 여러 번 포함되려고 하는 상황이 발생할 수 있다는 점입니다. 이 경우, 중복 전략을 설정하지 않으면 Gradle이 충돌을 일으킬 수 있습니다. 따라서, `DuplicatesStrategy.EXCLUDE` 설정은 이러한 문제를 해결하는 데 매우 유용합니다.

</div>
</details>

<details>
<summary> 2️⃣ ForwardedheaderFilter </summary>
<div markdown="1">

로컬 서버에서 개발시 문제가 없으나 nginx 안의 Proxy 환경에서 문제가 발생했을 경우 해당 Filter를 확인!

→ Proxy 환경에서는 ForwardedHeaderFilter 가 실행되서 HTTP 요청의 `Forwarded` 헤더 또는 `X-Forwarded-*` 헤더를 처리하여 원래의 요청 정보를 복원해야 한다!

하지만! 해당 Filter 는 Spring Security 필터 체인에 기본적으로 포함되지 않는 Filter

주로  Spring MVC, Spring Boot 의 웹 애플리케이션에서 Proxy 서버나 로드 밸런서 뒤에 있는 클라이언트의 원래 요청 정보를 복원하기 위해 사용됨!

따라서 우리는 해당 Filter를 등록해 우선순위를 보안 필터 체인보다 먼저 실행되게 세팅해야 한다!

```java
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ForwardedHeaderFilter;
import org.springframework.core.Ordered;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<ForwardedHeaderFilter> forwardedHeaderFilter() {
        FilterRegistrationBean<ForwardedHeaderFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new ForwardedHeaderFilter());
        // 필터 적용의 위치를 가장 초기 위치에 적용!
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
```

#### 상세 흐름 (X-Forwared-* : XFF)

실제 백엔드는 8080 포트에서 동작합니다. 이 포트를 외부 도메인에 직접 노출시키는 것은 적절하지 않습니다. 8080 포트는 Docker 내부 컨테이너 접근에만 사용되며, 클라이언트가 외부에서 이 포트로 직접 접근하는 것은 본인의 로컬호스트의 8080 포트로 접근하는 것이 되기 때문입니다. 대신 프록시 서버(Nginx)가 외부 도메인과 내부 Docker 컨테이너 간의 요청을 중계합니다.

Nginx는 외부 도메인(`i11c107.p.ssafy.io`)과 내부 Docker 컨테이너(`localhost:8080`) 사이의 프록시 역할을 하여 클라이언트가 도메인으로 접근하면 Nginx가 이를 내부 Docker 컨테이너로 전달합니다. Docker 컨테이너 내부 포트(8080)는 외부 호스트의 다른 포트인 8082(blue), 8081(green)로 번걸아가며 매핑됩니다. 클라이언트는 외부 도메인에 접속하고, Nginx는 이 요청을 내부 Docker 컨테이너로 전달하는 것입니다.

이를 통해 클라이언트는 Docker 컨테이너의 내부 포트를 직접 접근하지 않고도 프록시 서버를 통해 안전하게 애플리케이션에 접근할 수 있습니다. `X-Forwarded-*` 헤더를 통해 클라이언트의 원래 요청 정보가 전달되며, Spring Boot 애플리케이션은 이를 인식하여 올바른 URL을 처리할 수 있게 됩니다.

이를 위해 nginx는 다음과 같은 설정이 있습니다.

```
location /api/ {
	proxy_pass 127.0.0.1:8080;
	...
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  ...
}
```

**proxy_set_header X-Forwarded-Proto $scheme**

클라이언트의 프로토콜(HTTP, HTTPS)를 `$scheme`에 담아서  proxy_pass에 명시한 서버에 전달

**proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for**

클라이언트의 실제 IP 주소를 `$proxy_add_x_forwarded_for` 담아서 proxy_pass 서버에 전달

최종적으로, `i11c107.p.ssafy.io`에서 `/api` 경로에 접근할 경우, 다음과 같은 헤더가 내부 컨테이너의 8080 포트에서 실행 중인 백엔드 서버로 전송됩니다.

최종 X-Forwarded-* 헤더

```bash
X-Forwarded-For: i11c107.p.ssafy.io
X-Forwarded-Proto: https
```

Spring Boot는 이 정보를 기반으로 필터를 통해 원래 요청된 URL을 올바르게 처리합니다.
</div>
</details>

##### 📑 프로젝트 설계

<details>
<summary> 🗂️ 요구사항 명세 </summary>
<div markdown="1">
![요구사항 명세서1](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EC%9A%94%EA%B5%AC1.png?ref_type=heads)
![요구사항 명세서2](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EC%9A%94%EA%B5%AC2.png?ref_type=heads)
![요구사항 명세서3](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EC%9A%94%EA%B5%AC3.png?ref_type=heads)
</div>
</details>
<details>
<summary> 🗂️ 기능 명세  </summary>
<div markdown="1">
![기능명세서1](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EA%B8%B0%EB%8A%A5%EB%AA%85%EC%84%B81.png?ref_type=heads)
![기능명세서2](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EA%B8%B0%EB%8A%A5%EB%AA%85%EC%84%B82.png?ref_type=heads)
![기능명세서3](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EA%B8%B0%EB%8A%A5%EB%AA%85%EC%84%B83.png?ref_type=heads)
</div>
</details>

<details>
<summary> 🗂️ API 명세  </summary>
<div markdown="1">
https://docs.google.com/spreadsheets/d/1cRLsrDXJcRXEtbXIebf11pXJTKtN7cvZvBE-wVkY10M/edit?gid=1151860110#gid=1151860110

![API명세1](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/API1.png?ref_type=heads)

</div>
</details>

<details>
<summary>🎨 프로토 타입  </summary>
<div markdown="1">

[📎 Figma Link  ](https://www.figma.com/design/I7G6UwDk6q77acJHXI0o4J/ssafy-%EA%B3%B5%ED%86%B5?node-id=0-1&t=9wMHmHweJ2Ckecuf-1).

![Figma](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%ED%94%BC%EA%B7%B8%EB%A7%88.png?ref_type=heads)

메인 페이지, 랜딩 페이지, 로그인, 유저 프로필<br/>
스토리 작성, 스토리 편집, 캐릭터 관리, 스튜디오 관리, 팀 찾기 등 <br/>
계획했던 기능들을 모두 구현하였습니다.

</div>
</details>

<details>
<summary>📑 ERD  </summary>
<div markdown="1">

![ERD 이미지](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/ERD2.png?ref_type=heads)

</div>
</details>

<details>
<summary>🦾 Architecture  </summary>
<div markdown="1">

![Architecture](https://lab.ssafy.com/s11-webmobile1-sub2/S11P12C107/-/raw/Readme_image/README_IMG/%EC%95%84%ED%82%A4%ED%85%8D%EC%B3%90.jpg?ref_type=heads)

</div>
</details>





##### 🐱 팀원 정보 및 업무 분담 내역


<table>
  <tr>
    <th rowspan="3">Front</th>
    <td>박보람</td>
    <td>팀장, FE리더, Figma, UI/UX, React, 레이아웃, yjs 및 ReacFlow 활용한 공동 협업 페이지 기능개발</td>
  </tr>
  <tr>
    <td>김연지</td>
    <td>Figma, UI/UX, React, FE 기능 개발</td>
  </tr>
  <tr>
    <td>정소영</td>
    <td>React, 이미지 생성 AI, 텍스트 생성 AI</td>
  </tr>
  <tr>
    <th rowspan="1">Full Stack</th>
    <td>서한빈</td>
    <td>TechLeader, WebRTC 기능구현 및 개발, SpringBoot, UCC</td>
  </tr>
  <tr>
    <th rowspan="2">Back</th>
    <td>이중현</td>
    <td>BE leader, JPA, SpringBoot</td>
  </tr>
  <tr>
    <td>김시온</td>
    <td>PM, CI/CD 구축, 인프라</td>
  </tr>
</table>

##### 🙇 느낀점

<table>
  <tr>
    <th rowspan="3">Front</th>
    <td>박보람</td>
    <td>프로젝트를 진행하며 기술적으로 새로운 도전을 많이 해볼수 있어 즐거운 경험이었습니다. React, TS, Recoil, ReactFlow에 Yjs까지 전부 처음 접하는 기술이었지만, 공식문서를 참고하며 작업했던게 많은 도움이 되었습니다. 특히 axios interceptor를 활용한 토큰 상태관리와 YJS와 Flow를 결합한 공동작업영역을 구현하는게 어려웠지만 참 즐거웠습니다. 또한 어려운 문제가 생기면 백,프론트 구분없이 기술적 어려움을 다같이 고민해주셨기에 많은 난관을 극복할수 있었습니다. 이 과정에서 백엔드분들과 소통할수 있어서 좋은 경험이었습니다.
<br><br>
팀장으로서 어떤방향으로 팀과 프로젝트를 이끌어야할까 고민이 많았습니다. 한정된 시간 동안 업무를 진행해야했기 때문에 각 팀원들의 역량을 고려한 업무 분배에 신경을 많이 썼습니다. 프로젝트를 진행하며 많은 이슈들 속에서 서로를 존중하고 배려해준 팀원분들 덕분에 즐거운 프로젝트를 진행할수 있었습니다. 팀원분들께 정말 감사드립니다.</td>
  </tr>
  <tr>
    <td>김연지</td>
    <td>프로젝트 진행하면서 어려움이 생겼을때 팀원들과 소통하면서 극복하면서 즐겁게 하였습니다. 좋은 팀원들을 만나 어려움이 생겼을때 잘 들어주고 극복을 위해 같이 노력도 해서 책임감을 가지고 프로젝트에 임할 수 있었습니다. 좋은 팀원들을 만나는게 프로젝트 진행시 가장 중요하다는 것도 깨달았습니다.
<br><br>
이번 프로젝트를 통해 Typescript, React-Flow, YJS 등 새로운 기술에 대한 도전을 많이 하면서 프로그래밍 실력을 많이 늘릴 수 있었습니다. 많이 사용하는 라이브러리가 아니다보니 관련 자료들이 적어서 라이브러리를 분석하고 공부하는 방법도 익히는 기회가 되었습니다.
<br><br>
프로젝트를 진행하면서 개발자로써 성장하는 느낌을 많이 받았습니다. 프론트엔드 전문으로 프로젝트를 진행하는 것이 처음이라 초반에 어려움이 많았지만, 프로젝트를 진행하다 보니 익숙해져서 개발속도도 빨라졌습니다. 개발 중 막힘이 있으면 혼자 붙잡고 있기 보다는 팀원들과 소통하여 시간을 단축하는 것이 프로젝트에 도움이 된다는 깨달음도 얻을 수 있었습니다.
<br>
프로젝트를 잘 완성하게 함께 달려온 팀원분들께 감사드립니다.</td>
  </tr>
    <tr>
    <td>정소영</td>
    <td>6인팀 프로젝트를 진행하면서, 협업과 소통 능력이 중요함을 깨닫게 되었습니다. 친화력이 뛰어난 팀원과 만나게 되어, 팀과 소통하는 법을 배울 수 있어서 감사합니다. 또, Jira, Git, Github을 7주 동안 매일 사용하면서, 협업 툴에 익숙해질 수 있었습니다. <br/><br/>개발 분야에 있어서는 최신 기술인 React를 활용해서 프로젝트를 진행할 수 있어서 좋았고, API 명세서에 따라 DB의 자료를 불러오고 표출시키는 과정에서 배울점이 많았습니다. 또한, 개인적으로 웹개발을 할 때는 주로 Cloudtype이나 dothome과 같은 호스팅 서비스를 사용했는데, 이번에 AWS나 docker, Jenkins를 활용해서 배포하는 방법에 대해 공부해보고 싶다는 생각이 들었습니다. 자신이 개발한 기술에 대해 문서로 잘 작성해야한다는 것도 알게 되어서 감사합니다. <br/><br/>AI를 활용한 개발도 무척 재미있었습니다. 예전에는 주로 CNN이나 CGCNN 같은 물질 과학 분야에 특화된 모델을 많이 다루었는데, 이번에는 개발자의 입장에서 Text To Image 모델(SDXL)이나 LSTM, DPO와 같은 조금 더 대중적인 목표를 가진 모델에 대해 공부하고 활용해볼 수 있어서 유익했습니다. 팀 프로젝트 덕분에, 개발자로서도 개인으로서도 크게 성장하고 있음을 느끼고 있습니다. 감사합니다 
    </td>
  </tr>
  <tr>
    <th rowspan="1">Full Stack</th>
    <td>서한빈</td>
    <td>  저는 여러 도전을 했습니다. 백엔드부터 프론트엔드까지 많은 것들을 했습니다. 그 중에서 가장 어려운 도전은 webRTC 였던 것 같습니다. 사실 webRTC를 통한 클라이언트 간의 연결은 쉽습니다. 하지만 이 RTC 기능을 사용하는 핵심 기능 부분을 담당했다보니 부담감이 더해졌고, 책임감이 느껴져서 가장 어려웠다고 느낀 것 같습니다. 하지만 팀원분들의 도움과 꾸준한 노력으로 성공적으로 기능을 개발하게 되었고, 완성할 수 있게 된 것 같습니다
<br><br>
 팀원분들이 다들 좋으셔서 기획부터 크게 사이가 틀어짐이 없이 순조롭게 잘 진행된 것 같습니다. 기획부터 완성까지 완전히 협업을 하는 기회가 없었기에 정말 좋았습니다. 기술적으로나 인성적으로나 다들 훌륭하신 팀원분들 감사드리고 다음 프로젝트도 힘내시길 바라겠습니다!</td>
  </tr>
  <tr>
    <th rowspan="2">Back</th>
    <td>이중현</td>
    <td>프로젝트를 진행하며 팀원들과의 의사소통과 소통의 중요성을 느꼈고, 적극적이고 노력하는 팀원들을 만나 많은 회의를 하고 활발하게 소통할 수 있었습니다. 덕분에 협업이 원활하게 이루어졌고, 팀워크의 가치를 깊이 이해하게 되었습니다. 또한 기록과 문서화의 중요성을 알게 되어, 프로젝트 진행 과정에서 열심히 기록하고 공유할 수 있었습니다. 이로 인해 나중에 문제 해결이나 회고 시 큰 도움이 되었습니다.
<br><br>
JPA를 사용하여 진행한 프로젝트는 저에게 처음 경험이었기 때문에 트랜잭션 관리와 쿼리 작성에서 어려움이 있었습니다. 하지만 꾸준한 학습과 팀원들과의 지식 공유 덕분에 이러한 문제를 극복할 수 있었습니다.
프로젝트에 열심히 참여해주신 팀원들께 감사합니다! :thumbsup: </td>
  </tr>
  <tr>
    <td>김시온</td>
    <td>좋은 팀원을 만나 즐겁게 프로젝트를 진행했습니다. 모두 각자의 자리에서 묵묵히 맡으신 역할을 충실히 수행하시면서 책임감을 가지고 진행하는 모습이 감명깊었습니다. 최고의 복지는 최고의 팀원이라는 것을 다시한 번 깨닫게 되었고, 저도 이런 영감을 주신 팀원분들만큼 도움이되는 사람이 되고 싶다는 생각이 들었습니다. <br/><br/>
    이번 프로젝트에서 CI/CD와 배포를 처음 진행하게 되었습니다. 새로운 것을 배울 수 있다는것도 재밌었지만, 프로젝트를 볼모로 삼아 테스트하는 경험은 살얼음을 걷는 기분이었습니다. 인프라를 구축하면서 잘못하면 로컬에서 서비스를 보여줘야만 하는 상황이 나올까봐 열심히 인프라를 구축했던 것 같습니다.<br/><br/>
    새로운 기술을 도입할때는 절대 프로젝트를 인질로 삼아 흥미로운 신기술을 도입해서는 안된다는 것을 깨닫게 되었습니다. 이번 프로젝트를 진행하면서 더 많은 것들을 시도해보고 싶었지만, 현재 구축한 환경과 인프라의 안정성을 위해 빌드 최적화와 파이프라인 리팩토링에 신경써서 진행하였습니다. 프로젝트를 잘 마무리 할 수 있게 도와주신 팀원분들께 감사합니다.<br/><br/></td>
  </tr>
</table>

<details>
<summary> 참고사항 </summary>
<div markdown="1">

#### ① 도입배경
기존 서비스들과 차별화된 소설 제작 사이트를 제작해보자 

#### ② 기획의도 
Story Boat는 소통 기반 협업 소설 작성 플랫폼<br/>
실시간 음성 통화, 아이디어 플롯 회의, 공동 작성 기능을 지원함.<br/>
소설을 공동으로 집필하고, 원고의 버전을 관리할 수 있음<br/>
AI를 활용한 캐릭터 이미지 생성 및 글쓰기 기능까지 가능하도록

#### ③ 기대효과
작가들의 협업 강화 - 작가들이 팀을 구성하고 협력하여 창작물 작성 <br/>
효율적인 작업 관리 - 버전 관리를 통해 효과적으로 자원 관리 <br/>
단계별 권한 설정 - 편집자를 작업 공간에 초대하여 피드백 제공

</div>
</details>
