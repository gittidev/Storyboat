
//원본 코드
// declare module '../../utils/utils' {
//     export function getRandom(): any;
//     export const loaderMessages: any;
//     export const promptIdeas: any;
//   }
  

//에러 해결 위한 타입 지정
declare module '../../utils/utils' {

  export function getRandom(): number; 
  export const loaderMessages: string[]; 
  export const promptIdeas: string[]; 
}