import React, { useState } from 'react';
import { HfInference } from '@huggingface/inference';
import './Huggingwrite.css';
import { translateText } from '../../services/translateService';
import { useSpeechSynthesis } from 'react-speech-kit';


const hf = new HfInference('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');

const languageMap = {
  'en': 'English',
  'ko': 'Korean',
  'ja': 'Japanese',
  'es': 'Spanish'
};


interface SpeechSynthesisVoice {
  voiceURI: string;
  name: string;
  lang: string;
  default: boolean;
  localService: boolean;
}

const Huggingwrite: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  // const [story, setStory] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [translatedStory, setTranslatedStory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ko'); 
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false); 

  const { speak, cancel, voices } = useSpeechSynthesis();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const generateStory = async () => {
    setLoading(true);
    setError(null);
    try {
      let textToGenerate = inputText;

      console.log('Initial Input Text:', inputText);

      if (selectedLanguage !== 'en') {
        console.log('Translating input text to English...');
        textToGenerate = await translateText(inputText, selectedLanguage, 'en');
        console.log('Translated Text to English:', textToGenerate);
      }

      console.log('Generating story with text:', textToGenerate);
      const result = await hf.textGeneration({
        model: 'HuggingFaceH4/zephyr-7b-beta',
        inputs: textToGenerate,
      });

      const cleanedStory = result.generated_text.replace(/(\r\n|\n|\r)/g, ' ');
      console.log('Generated Story in English:', cleanedStory);
      // setStory(cleanedStory);

      if (selectedLanguage !== 'en') {
        console.log('Translating generated story to selected language...');
        const translatedResult = await translateText(cleanedStory, 'en', selectedLanguage);
        console.log('Translated Story:', translatedResult);
        setTranslatedStory(translatedResult);
      } else {
        setTranslatedStory(cleanedStory);
      }
    } catch (error) {
      setError('Please try again.');
      console.error('Error generating story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      cancel();
      setIsSpeaking(false);
    } else if (translatedStory) {
      const voice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith(selectedLanguage));
      
      if (voice) {
        speak({ text: translatedStory, voice });
        setIsSpeaking(true);
      } else {
        console.error(`No voice found for the selected language: ${selectedLanguage}`);
        alert(`No voice available for the selected language. Please check your browser's language settings.`);
      }
    }
  };

  return (
    <div>
      <div className='language-selection'>
        <label htmlFor="languageSelect">&nbsp;&nbsp;&nbsp;언어 선택 &nbsp;&nbsp;
          <select
            id="languageSelect"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.entries(languageMap).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className='total huggingwrite-container'>
        <div className='mid1'>
          <h1 className="huggingwrite-title" style={{ textAlign: 'center' }}>줄거리를 입력해주세요😊</h1>
          
          <div className='midbox1'>
            <textarea
              id="storyInput"
              name="storyInput"
              value={inputText}
              onChange={handleInputChange}
              rows={4}
              cols={50}
              style={{ fontSize: '20px' }}
              placeholder="Enter your text here..."
              className="huggingwrite-textarea"
            />
          </div>

          <button
            onClick={generateStory}
            disabled={loading}
            className={`huggingwrite-button ${loading ? 'loading' : ''}`}
          >
            {loading ? '잠시 기다려주세요...⚡⚡⚡' : '만들기'}
          </button>
        </div>

        <div className='mid2'>
          <h1 className="huggingwrite-title" style={{ textAlign: 'center' }}>만들어진 이야기 🧙</h1>
          <div className='midbox2'>
            <div className="huggingwrite-story-container">
              {error && <div className="error-message">{error}</div>}
              {/* <div>{story || ""}</div> */}
              <div>{translatedStory || ""}</div>
            </div>
          </div>
          {translatedStory && (
            <button onClick={handleSpeak} className="huggingwrite-button">
              {isSpeaking ? '멈추기' : '이야기 읽기'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


export default Huggingwrite;
