import CustomButton from "../Commons/CustomButton"
import { Typography } from "@mui/material"
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { selectedStudioState } from '../../recoil/atoms/studioAtom';
import { accessTokenState } from '../../recoil/atoms/authAtom';
const svURL = import.meta.env.VITE_SERVER_URL;

const StudioDelete = () => {
    const selectedStudioId = useRecoilValue(selectedStudioState);
    const accessToken = useRecoilValue(accessTokenState);

    const handleDelete = async () => {
        if (!window.confirm('정말로 이 스튜디오를 삭제하시겠습니까?')) {
            return;
        }
        try {
            await axios.delete(`${svURL}/api/studios/${selectedStudioId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            alert('스튜디오가 성공적으로 삭제되었습니다.');
            // 여기서 페이지를 새로 고침하거나, 사용자에게 적절한 안내를 할 수 있습니다.
            // 예를 들어, 홈 페이지로 리다이렉션:
            window.location.href = '/storyboat';
        } catch (error) {
            console.error('스튜디오 삭제에 실패했습니다:', error);
            alert('스튜디오 삭제에 실패했습니다.');
        }
    };

    return (
        <>
            <div>
                {/* <h4 style={{ fontWeight: 'normal'  }}>
                    Studio 삭제하기
                </h4> */}
                <Typography variant="h6">스튜디오 삭제하기</Typography>
                <br/>

                <Typography variant="body2" component="div">
                    Studio 삭제시 기존에 작성한 모든 플롯, 원고, 작품, 캐릭터 베이스가 삭제됩니다.
                </Typography>
                <Typography variant="body2" component="div">

                    삭제하시겠습니까?
                </Typography>


            </div>
            <div style={{ textAlign: 'right' }}>

            <CustomButton content="삭제하기" bgcolor="orange" hoverBgColor="red" onClick={handleDelete}>

            </CustomButton>
            </div>
        </>

    )
}

export default StudioDelete