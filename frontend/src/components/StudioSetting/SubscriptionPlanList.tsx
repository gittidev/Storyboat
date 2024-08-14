import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import CustomButton from '../Commons/CustomButton';

interface Plan {
  name: string;
  price: string;
  storage: string;
  duration: string;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "기본 요금제",
    price: "무료",
    storage: "5GB",
    duration: "1개월",
    features: [
      "모든 소설 버전 무제한 저장",
      "월별 버전 백업",
      "기본 편집 도구 제공",
      "이메일 지원"
    ]
  },
  {
    name: "프리미엄",
    price: "15,000원/월",
    storage: "50GB",
    duration: "1년",
    features: [
      "모든 소설 버전 무제한 저장",
      "주별 버전 백업",
      "고급 편집 도구 제공",
      "실시간 협업 기능",
      "우선 이메일 지원",
      "광고 제거"
    ]
  },
  {
    name: "프로페셔널",
    price: "30,000원/월",
    storage: "무제한",
    duration: "5년",
    features: [
      "모든 소설 버전 무제한 저장",
      "일별 버전 백업",
      "프리미엄 편집 도구 제공",
      "고급 실시간 협업 기능 (음성/비디오 통화 포함)",
      "24/7 전화 및 이메일 지원",
      "광고 제거",
      "데이터 분석 및 통계 제공",
      "사용자 정의 도메인 및 브랜딩"
    ]
  }
];

const PlanCard = ({ plan, content }: { plan: Plan, content: string }) => (
  <Card sx={{ marginBottom: 2, flex: '1 1 30%', margin: 1, minWidth: '280px' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          {plan.name}
        </Typography>
        <CustomButton content={content} hoverBgColor="red" bgcolor='pink.300'/>
      </Box>
      <Typography variant="h6" component="div" sx={{ marginTop: 1 }}>
        {plan.price}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
        {plan.storage} storage
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {plan.duration} duration
      </Typography>
      <List>
        {plan.features.map((feature, index) => (
          <ListItem key={index} sx={{ padding: 0 }}>
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

const PlanList = () => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
    {plans.map((plan, index) => (
      <PlanCard key={index} plan={plan} content='구독하기'/>
    ))}
  </Box>
);

export default PlanList;
