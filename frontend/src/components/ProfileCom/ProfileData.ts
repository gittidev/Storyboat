export interface Profile {
    email: string;
    penName: string;
    profilePicture: string;
    preferredGenres: string[];
    additionalInfo: string;
  }
  
export const dummyProfile: Profile = {
    email: 'example@example.com',
    penName: '보람',
    profilePicture: 'https://via.placeholder.com/150',
    preferredGenres: ['Fantasy', 'Science Fiction', 'Mystery'],
    additionalInfo: 'This is some additional information about the user.',
};