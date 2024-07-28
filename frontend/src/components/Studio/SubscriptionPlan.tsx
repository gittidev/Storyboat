import SubscriptionPlanList from "./SubscriptionPlanList"
import { Container } from "@mui/material"
import { Typography } from "@mui/material"

const SubscriptionPlan = () =>{

    return (
        <>
        <Typography variant="body1" component="div">
        
        스튜디오에 적합한 요금제를 만나보세요
        </Typography>
        <Container style={{display:"flex", justifyContent:"space-evenly"}}>
            <SubscriptionPlanList/>
        </Container>
        </>
    )
}

export default SubscriptionPlan