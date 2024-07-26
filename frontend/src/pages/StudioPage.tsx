
import SubTopBar from "../components/SubTopBar"
import TabBar from "../components/TabBar"
import StudioSetting from "../components/Studio/StudioSetting"
import SubscriptionPlan from "../components/Studio/SubscriptionPlan"
import TeamSetting from "../components/Studio/TeamSetting"

const StudioPage = () => {
    const labels = ['일반 설정', '요금제 & 플랜', '팀 관리']
    const childrenComponents = [<StudioSetting/>, <SubscriptionPlan/>, <TeamSetting/>]

    return (
        <> 
   
           
                <SubTopBar title={'스튜디오 페이지'}/>
                <TabBar labels={labels} childrenComponents={childrenComponents}/>
      
  
          
        </>
    )


}

export default StudioPage