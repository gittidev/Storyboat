// translateService.ts

import axios from 'axios';

// MyMemory API URL
const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

// 번역 함수
export const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
  try {
    // GET 요청을 통해 번역 수행
    const response = await axios.get(MYMEMORY_API_URL, {
      params: {
        q: text,
        langpair: `${sourceLang}|${targetLang}`,
      },
    });

    // 번역된 텍스트 반환
    return response.data.responseData.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};
