// export interface Profile {
//     email: string;
//     penName: string;
//     profilePicture: string;
//     preferredGenres: string[];
//     additionalInfo: string;
//   }
export interface Profile {
  penName: string;
  email: string;
  profilePicture: string | null; // URL을 저장하도록 수정
  preferredGenres: string[];
  additionalInfo: string;
}
  
export const dummyProfile: Profile = {
  penName: 'John Doe',
  email: 'john.doe@example.com',
  profilePicture: 'https://via.placeholder.com/150', // URL을 저장
  preferredGenres: ['Fantasy', 'Science Fiction'],
  additionalInfo: 'Some additional information about John Doe.'
};