import CustomButton from "../CustomButton"
import { Typography } from "@mui/material"

const StudioDelete = ()=>{


    return(
    <>
    <div>
        <h3>
            Studio 삭제하기
        </h3>

        <Typography variant="body2" component="div">
        Studio 삭제시 기존에 작성한 모든 플롯, 원고, 작품, 캐릭터 베이스가 삭제됩니다.
        </Typography>
        <Typography variant="body2" component="div">

        삭제하시겠습니까?
        </Typography>


    </div>
    <CustomButton content="삭제하기" bgcolor="orange" hoverBgColor="red">

    </CustomButton>
    </>

    )
}

export default StudioDelete