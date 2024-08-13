import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import ImageBox from "../../components/MyChar/ImageBox";
import { fetchImages } from "../../services/model-api";
import { getRandom, loaderMessages } from "../../utils/utils";
import ChooseResults from "../../components/MyChar/ChooseResults";
import RecentResults from "../../components/MyChar/RecentResults";
import { translateText } from '../../services/translateService';
import "./Home.css";

const Home: React.FC = () => {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [imageResult, setImageResult] = useState<string | undefined>(undefined);
  const [inputFields, setInputFields] = useState<string[]>(["", "", "", "", "", "", "", ""]);
  const [styleValue, setStyleValue] = useState<string>("DDIM");
  const [qualityValue, setQualityValue] = useState<string>("20");
  const [seedValue, setSeedValue] = useState<number>(17123564234);
  const [loaderMessage, setLoaderMessage] = useState<string>(loaderMessages[0]);

  useEffect(() => {
    const loaderInterval = setInterval(() => {
      setLoaderMessage(getRandom(loaderMessages));
    }, 3000);

    return () => {
      clearInterval(loaderInterval);
    };
  }, []);

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = event.target.value;
    setInputFields(newInputFields);
  };

  const handleChange = (event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
    if (event.target instanceof HTMLSelectElement) {
      const { name, value } = event.target;

      if (name === "style") {
        setStyleValue(value);

        const newInputFields = [...inputFields];
        switch (value) {
          case "Euler":
            newInputFields[6] = "animation,person";
            break;
          case "DDPM":
            newInputFields[6] = "real,photo";
            break;
          case "LMS":
            newInputFields[6] = "";
            break;
          case "Heun":
            newInputFields[6] = "background";
            break;
          default:
            newInputFields[6] = "";
            break;
        }
        setInputFields(newInputFields);
      } else if (name === "quality") {
        setQualityValue(value);
      }
    } else if (event.target instanceof HTMLInputElement) {
      if (event.target.name === "seed") {
        setSeedValue(Number(event.target.value));
      }
    }
  };

  const handleGenerate = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await fetchData();
  };

  const fetchData = async () => {
    try {
      setShowLoader(true);

      // 번역 후 각 입력 필드를 업데이트
      const translatedInputs = await Promise.all(inputFields.map(async (field) => {
        try {
          if (field.trim() === '') return field; // 비어 있는 필드는 그대로 반환
          const translated = await translateText(field, 'ko', 'en');
          console.log(`Original: ${field}, Translated: ${translated}`);
          return translated;
        } catch (translationError) {
          console.error('Translation Error:', translationError);
          return field; // 번역 실패 시 원본 필드를 반환
        }
      }));

      // 번역된 입력 필드를 사용하여 이미지 생성
      const promptQuery = translatedInputs.join(",");
      console.log(`Translated Inputs: ${translatedInputs}`);
      console.log(`Prompt Query: ${promptQuery}`);

      const imageBlob = await fetchImages(
        promptQuery,
        seedValue,
        styleValue,
        qualityValue
      );

      if (!imageBlob) {
        throw new Error("Failed to fetch image");
      }

      const fileReaderInstance = new FileReader();

      fileReaderInstance.onload = () => {
        const base64data = fileReaderInstance.result as string;
        setImageResult(base64data);
      };

      fileReaderInstance.readAsDataURL(imageBlob);
      setShowLoader(false);
    } catch (error) {
      console.error("Error fetching images from API:", error);
      setShowLoader(false);
    }
  };

  const handleAvailOptions = (option: string) => {
    setInputFields([option, "", "", "", "", "", "", ""]);
  };

  return (
    <div className="home-container">
      <div className="first">
        <div className="surpriseBox">
        </div>
      </div>

      <div className="second">
        <div className="split-container">
          <div className="leftpart_home">
            <div className="inputboxdesign">
              <div className="formBox">
                <div className="mid_home">
                  <div className="formValue">
                    <label style={{ fontSize: '15px' }}>화풍</label>
                    <select
                      name="style"
                      value={styleValue}
                      onChange={handleChange}
                      className="select-dropdown"
                    >
                      <option value="DDPM">사진</option>
                      <option value="Euler">애니</option>
                      <option value="Heun">풍경</option>
                      <option value="LMS">자유</option>
                    </select>
                  </div>

                  <div className="formValue">
                    <label style={{ fontSize: '15px' }}>해상도</label>
                    <select
                      name="quality"
                      value={qualityValue}
                      onChange={handleChange}
                      className="select-dropdown"
                    >
                      <option value="20">저화질</option>
                      <option value="30">중화질</option>
                      <option value="50">고화질</option>
                    </select>
                  </div>

                  <div className="formValue">
                    <label style={{ fontSize: '15px' }}>랜덤 숫자&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input
                      type="number"
                      name="seed"
                      value={seedValue}
                      onChange={handleChange}
                      style={{ width: '150px', height: '23px' }}
                    />
                  </div>
                </div>
              </div>

              <br />

              <input
                type="text"
                value={inputFields[0]}
                onChange={(e) => handleInputChange(0, e)}
                placeholder="이름"
                className="promptInput"
                style={{
                  border: '4px solid rgb(173,216,230)',
                  borderRadius: '8px'
                }}
              />
              <p> </p>

              <br />

              <textarea
                value={inputFields[6]}
                onChange={(e) => handleInputChange(6, e)}
                placeholder="특징"
                className="promptInput text"
                style={{
                  border: '4px solid rgb(173,216,230)',
                  borderRadius: '8px'
                }}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <button
                  onClick={handleGenerate}
                  style={{
                    backgroundColor: 'rgb(144, 238, 144)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    width: '150px',
                    height: '30px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    justifyContent: 'center'
                  }}
                >
                  그림 그리기
                </button>
              </div>
              <br />
            </div>
          </div>

          <div className="leftpart_home">
            <br/>
            {showLoader ? (
              <div style={{
                 marginTop: '20px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh'
              }}>
                ⚡️⚡️⚡️이미지 생성중⚡️⚡️⚡️
              </div>
            ) : (
              <ImageBox promptQuery={inputFields.join(" ")} imageResult={imageResult} />
            )}
          </div>
        </div>
      </div>

      <ChooseResults />
      <RecentResults
        promptQuery={inputFields.join(" ")}
        imageResult={imageResult}
        onSelect={handleAvailOptions}
      />
      <div className="slideShowMessage">{loaderMessage}</div>
    </div>
  );
};

export default Home;
