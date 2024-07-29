import CustomButton from "../components/Commons/CustomButton"
import SubTopBar from "../components/Commons/SubTopBar"
import { Box } from "@mui/material"
import useModal from "../hooks/useModal"
import { BorderBox } from "../components/Commons/BorderBox"


const IdeaBoxPage = () => {
  const { handleOpen } = useModal();



  return(

    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px" }}>
      <Box sx={{ flexGrow: 1 }}>
      <SubTopBar title={"스튜디오's 아이디어"} content="스튜디오의 아이디어를 작성하세요"/>
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green" onClick={handleOpen} />
      </Box>
      </Box>
      {/* 화면에 들어갈 내역 */}
      <BorderBox>
        
      </BorderBox>

    </>
  )
}


export default IdeaBoxPage