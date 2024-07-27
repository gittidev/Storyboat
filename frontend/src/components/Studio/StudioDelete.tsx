import CustomButton from "../CustomButton"

const StudioDelete = ()=>{


    return(
    <>
    <div>
        <h1>
            Studio 삭제하기
        </h1>
    <p>
        Studio 삭제시 기존에 작성한 모든 플롯, 원고, 작품, 캐릭터 베이스가 삭제됩니다.
        삭제하시겠습니까?
    </p>
    </div>
   
    <CustomButton content="삭제하기" bgcolor="orange" hoverBgColor="red">

    </CustomButton>
    </>

    )
}

export default StudioDelete