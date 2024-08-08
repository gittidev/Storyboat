import React, { useState, useEffect } from "react";
import ImageBox from "../components/ImageBox";
import NavBar from "../components/NavBar";
import { fetchImages } from "../services/model-api";
import { getRandom, loaderMessages, promptIdeas } from "../utils/utils";
import ChooseResults from "../components/ChooseResults";
import RecentResults from "../components/RecentResults";
import "./Home.css"; 
// ssafy C107

const Home = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [imageResult, setImageResult] = useState(null);
  const [inputFields, setInputFields] = useState(["", "", "", "", "", "", "", ""]); 
  const [radioValue, setRadioValue] = useState("20");
  const [dropDownValue, setDropDownValue] = useState("DDIM");
  const [seedValue, setSeedValue] = useState(17123564234);
  const [loaderMessage, setLoaderMessage] = useState(loaderMessages[0]);

  useEffect(() => {
    const loaderInterval = setInterval(() => {
      setLoaderMessage(getRandom(loaderMessages));
    }, 3000);

    return () => {
      clearInterval(loaderInterval);
    };
  }, [loaderMessage]);

  const handleInputChange = (index, event) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = event.target.value;
    setInputFields(newInputFields);
  };

  const handleChange = (event) => {
    if (event.target.name === "radio") {
      setRadioValue(event.target.value);
    } else if (event.target.name === "dropdown") {
      setDropDownValue(event.target.value);
     
      const newInputFields = [...inputFields];
      switch (event.target.value) {
        case "Euler":
          newInputFields[7] = "animation,person";
          break;
        case "DDPM":
          newInputFields[7] = "real,person";
          break;
        case "LMS":
          newInputFields[7] = "building";
          break;
        case "Heun":
          newInputFields[7] = "nature,painting";
          break;
        default:
          newInputFields[7] = "";
          break;
      }
      setInputFields(newInputFields);
    } else {
      setSeedValue(event.target.value);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    await fetchData();
  };

  const fetchData = async () => {
    try {
      setShowLoader(true);
      const promptQuery = inputFields.join(",");

      const imageBlob = await fetchImages(
        promptQuery,
        seedValue,
        dropDownValue,
        radioValue
      );

      const fileReaderInstance = new FileReader();
 
      fileReaderInstance.onload = () => {
        let base64data = fileReaderInstance.result;
        setImageResult(base64data);
      };
    
      fileReaderInstance.readAsDataURL(imageBlob);
      setShowLoader(false);
    } catch (error) {
      console.error("Error fetching images from API:", error);
      setShowLoader(false);
    }
  };

  const handleSurpriseMe = () => {
    const surprisePrompt = getRandom(promptIdeas);
    setInputFields([surprisePrompt, "", "", "", "", "", "", ""]); 
  };

  const handleAvailOptions = (option) => {
    setInputFields([option, "", "", "", "", "", "", ""]); 
  };

  return (
    
    <div className="home-container">
      <NavBar />
      <div className="first">
      <div className="surpriseBox">
        {/* <label>캐릭터 생성</label> */}
      </div>


      <div className="formBox">

        <div className="mid">

        <div className="formValue">
          <div className="mid1">
            <label>화풍 선택 &nbsp;</label>
            <select name="dropdown" value={dropDownValue} onChange={handleChange}>
              <option value="Euler">애니</option>
              <option value="DDPM">사람</option>
              <option value="LMS">건축물</option>
              <option value="Heun">풍경화</option>
            </select>
          </div>
        </div>
        
        <div className="formValue">
          <div className="mid2">
            퀄리티 
            <p>&nbsp;&nbsp;</p>
            <label>
              <input
                type="radio"
                name="radio"
                value="20"
                checked={radioValue === "20"}
                onChange={handleChange}
              />
              &nbsp;저
            </label>
            <label>
              <input
                type="radio"
                name="radio"
                value="30"
                checked={radioValue === "30"}
                onChange={handleChange}
              />
              &nbsp;중 
            </label>
            <label>
              <input
                type="radio"
                name="radio"
                value="50"
                checked={radioValue === "50"}
                onChange={handleChange}
              />
              &nbsp;고
            </label>
          </div>
        </div>
        
        <div className="mid3">
          <div className="formValue">
            <label>&nbsp;&nbsp;Seed</label>
            <input
              type="number"
              name="input"
              value={seedValue}
              onChange={handleChange}
            />
          </div>
        </div>
        </div>

      </div>
      </div>

      <div className="split-container">
        <div className="leftpart">
          <div>
            <div className="customize">
              <input
                type="text"
                value={inputFields[0]}
                onChange={(e) => handleInputChange(0, e)}
                placeholder={`이름`}
                className="promptInput"
              />
              <input
                type="text"
                value={inputFields[1]}
                onChange={(e) => handleInputChange(1, e)}
                placeholder={`국가`}
                className="promptInput"
              />
              <input
                type="text"
                value={inputFields[2]}
                onChange={(e) => handleInputChange(2, e)}
                placeholder={`얼굴형`}
                className="promptInput"
              />
              <input
                type="text"
                value={inputFields[3]}
                onChange={(e) => handleInputChange(3, e)}
                placeholder={`머리색`}
                className="promptInput"
              />
              <input
                type="text"
                value={inputFields[4]}
                onChange={(e) => handleInputChange(4, e)}
                placeholder={`옷`}
                className="promptInput"
              />
              <input
                type="text"
                value={inputFields[5]}
                onChange={(e) => handleInputChange(5, e)}
                placeholder={`배경`}
                className="promptInput"
              />
              <input
                type="text"
                value={inputFields[6]}
                onChange={(e) => handleInputChange(6, e)}
                placeholder={`이 외 특징`}
                className="promptInput"
              />
            </div>
            <div>
            <button onClick={handleGenerate} style={{ backgroundColor: 'blue', color: 'white' }}>
              그림 그리기
            </button>
            </div>
          </div>
        </div>

        <div className="rightpart">
          {showLoader ? (
            <div style={{ margin: 40 }}>기다려주세요... ⚡️⚡️⚡️</div>
          ) : (
            <>
              <ImageBox promptQuery={inputFields.join(" ")} imageResult={imageResult} />
            </>
          )}
        </div>
      </div>

      <ChooseResults onSelect={handleAvailOptions} /> 
      <RecentResults
        promptQuery={inputFields.join(" ")} 
        imageResult={imageResult}
        onSelect={handleAvailOptions}
      />
      <div className="slideShowMessage">{loaderMessage}</div>
      <div className="footer">SSAFY 7조</div>
    </div>
  );
};

export default Home;
