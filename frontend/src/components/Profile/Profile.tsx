import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
// import { Button } from '@mui/material';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { accessTokenState } from "../../recoil/atoms/authAtom";
import axios from "axios";
import { myStudioState } from "../../recoil/atoms/studioAtom";
import ProfileForm from "./ProfileForm";
import { ProfileType } from "../../types/UserType";

const svURL = import.meta.env.VITE_SERVER_URL;

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const token = useRecoilValue(accessTokenState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setStudioId = useSetRecoilState(myStudioState); // useSetRecoilState로 변경
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${svURL}/api/users/profiles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const { data } = response.data;
        if (data && data.privateStudio && data.privateStudio.studioId) {
          setStudioId(data.privateStudio.studioId);
        }

        setProfile(data);
      } else {
        throw new Error("프로필 정보를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 정보를 가져오는데 오류가 발생했습니다:", error);
      setError("프로필 정보를 가져오는데 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // 의존성 배열에서 profile 제거

  const handleEdit = () => setIsEditing(true);

  const handleSave = async (updatedProfile: ProfileType) => {
    try {
      const formData = new FormData();
      if (updatedProfile.imageUrl) {
        formData.append("imageUrl", updatedProfile.imageUrl);
      }

      const profileData = {
        penName: updatedProfile.penName,
        introduction: updatedProfile.introduction,
        tags: updatedProfile.tags,
      };
      formData.append("data", JSON.stringify(profileData));

      await axios.put(`${svURL}/api/users/profiles`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchProfile(); // Fetch the updated profile to ensure we have the latest data
      setIsEditing(false);
    } catch (err) {
      setError("프로필 정보를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`${svURL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Redirect or show a success message
        alert("회원탈퇴가 완료되었습니다.");
        navigate("/");
        // You can redirect the user to a different page or perform other actions here
      } else {
        throw new Error("회원탈퇴에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원탈퇴 요청 중 오류가 발생했습니다:", err);
      setError("회원탈퇴 요청 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>프로필 정보가 없습니다.</div>;
  }

  return (
    <Box sx={{ padding: "2rem 10rem" }}>
      {isEditing ? (
        <ProfileForm
          profile={profile}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <Card
          sx={{ maxWidth: 300, minHeight: 500, margin: "auto", boxShadow: 3 }}
        >
          <CardMedia
            component="img"
            height={200}
            image={profile.imageUrl || "/default-profile.png"}
            alt="Profile Picture"
            sx={{ maxHeight: "50" }}
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={profile.imageUrl || "/default-profile.png"}
                alt="Profile Picture"
                sx={{ width: 100, minHeight: 100, mr: 2 }}
              />
              <Box>
                <Typography variant="h5">{profile.penName}</Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Tooltip title="프로필 수정">
                    <IconButton onClick={handleEdit} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="회원탈퇴">
                    <IconButton onClick={handleDeleteAccount} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              {profile.introduction}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {profile.tags &&
                profile.tags.map((tag) => (
                  <Chip
                    key={tag.tagId}
                    label={tag.name}
                    sx={{ backgroundColor: tag.color, color: "#fff" }}
                  />
                ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Profile;
