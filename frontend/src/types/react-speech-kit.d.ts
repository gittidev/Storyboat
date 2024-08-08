// types/react-speech-kit.d.ts

declare module 'react-speech-kit' {
    // 추가 타입 정의
    export interface SpeechSynthesisVoice {
      voiceURI: string;
      name: string;
      lang: string;
      default: boolean;
      localService: boolean;
      // 필요한 다른 프로퍼티들 추가
    }
  
    export interface SpeechSynthesisOptions {
      text: string;
      voice?: SpeechSynthesisVoice;
      rate?: number;
      pitch?: number;
      volume?: number;
    }
  
    export interface UseSpeechSynthesis {
      speak: (options: SpeechSynthesisOptions) => void;
      cancel: () => void;
      speaking: boolean;
      paused: boolean;
      pending: boolean;
      voices: SpeechSynthesisVoice[];
    }
  
    export function useSpeechSynthesis(): UseSpeechSynthesis;
  }
  