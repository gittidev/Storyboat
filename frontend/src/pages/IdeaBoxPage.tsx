import CustomButton from "../components/CustomButton"
import SubTopBar from "../components/SubTopBar"

const IdeaBoxPage = () => {

  return(

    <>
      <SubTopBar title={'Story Box'} content="스튜디오의 아이디어를 작성하세요"/>
      <CustomButton content='+ 생성하기' bgcolor="lightgreen" hoverBgColor="green"/>
    </>
  )
}

export default IdeaBoxPage