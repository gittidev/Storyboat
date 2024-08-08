// src/types/Chartype.ts

// 캐릭터 데이터 구조를 정의합니다.
export interface Character {
  id: number;               // 캐릭터의 고유 ID
  name: string;            // 캐릭터의 이름
  description: string;     // 캐릭터의 설명
  imageUrl: string;        // 캐릭터 이미지의 URL (필드 이름 수정)
  tags?: string[];         // 캐릭터에 대한 태그 (선택적 필드)
}

// 캐릭터 생성 요청 데이터 구조를 정의합니다.
export interface CreateCharacterRequest {
  name: string;              // 캐릭터의 이름
  description: string;       // 캐릭터의 설명
  file: File;                // 캐릭터 이미지 파일
  tags?: string[];           // 캐릭터에 대한 태그 (선택적 필드)
}

// 캐릭터 업데이트 요청 데이터 구조를 정의합니다.
export interface UpdateCharacterRequest {
  name: string;              // 캐릭터의 이름
  description: string;       // 캐릭터의 설명
  file?: File;               // 캐릭터 이미지 파일 (선택적 필드)
  tags?: string[];           // 캐릭터에 대한 태그 (선택적 필드)
}

// 캐릭터 목록 조회 응답 데이터 구조를 정의합니다.
export interface CharacterResponse {
  status: string;            // 응답 상태
  data: {
      characters: Character[]; // 캐릭터 목록
  };
  message: string;           // 응답 메시지
}

// 캐릭터 생성 응답 데이터 구조를 정의합니다.
export interface CreateCharacterResponse {
  status: string;            // 응답 상태
  data: {
      character: Character;    // 생성된 캐릭터 데이터
  };
  message: string;           // 응답 메시지
}

// 캐릭터 상세 조회 응답 데이터 구조를 정의합니다.
export interface CharacterDetailResponse {
  status: string;            // 응답 상태
  data: {
      character: Character;    // 캐릭터 상세 데이터
  };
  message: string;           // 응답 메시지
}

// 캐릭터 삭제 응답 데이터 구조를 정의합니다.
export interface DeleteCharacterResponse {
  status: string;            // 응답 상태
  data: {};                  // 빈 객체
  message: string;           // 응답 메시지
}
