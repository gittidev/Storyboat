export interface ProfileProps {
  penName: string;
  email: string;
  profilePicture?: string | undefined;
  preferredGenres: string[];
  additionalInfo: string;
}

export const dummyProfile: ProfileProps = {
  penName: 'John Doe',
  email: 'john.doe@example.com',
  profilePicture: 'https://via.placeholder.com/150',
  preferredGenres: ['Fantasy', 'Science Fiction'],
  additionalInfo: 'Some additional information about John Doe.'
};


