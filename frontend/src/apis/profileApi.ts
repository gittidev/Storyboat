import axios from 'axios';
import { Profile } from '../components/Profile/ProfileData'

// API URL 설정
const API_URL = 'http://localhost:8080/profile';

export const fetchProfile = async (): Promise<Profile> => {
  try {
    const response = await axios.get<Profile>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};