import React from 'react';
import { Box, Typography, Rating, Paper, LinearProgress} from '@mui/material';
import './LanReview.css'

interface Review {
  userName: string;
  date: string;
  rating: number;
  comment: string;
  helpfulCount: number;
}

// Mock reviews data
const reviews = [
  { userName: '김작가', date: '2024년 8월 18일', rating: 5, comment: '이 프로그램은 창작 과정의 모든 측면을 한 곳에서 관리할 수 있어서 정말 편리합니다. 공동 소설 집필은 물론, 원고 관리와 음성 통화, 팀 찾기 기능까지 지원해 주는 점이 특히 좋습니다. 덕분에 팀원들과의 협업이 훨씬 수월해졌습니다. 매우 추천합니다!', helpfulCount: 75 },
  { userName: '최작가', date: '2024년 8월 1일', rating: 5, comment: '지금 어제부터 사용해 보고 있는데, 정말 놀라워요! 모든 기능이 완벽하게 통합되어 있어서 소설 집필과 관리가 아주 쉬워졌습니다. AI 글쓰기 기능은 특히 유용하고, 그림 그리기와 음성 통화 기능도 훌륭해요. 팀 프로젝트에 딱 맞는 웹사이트입니다!', helpfulCount: 1211 },
  { userName: '이작가', date: '2024년 7월 29일', rating: 4, comment: '전반적으로 기능이 잘 갖추어져 있습니다. 특히 공동 작업의 효율성이 높아지고, 원고 관리와 AI 글쓰기 기능이 유용했습니다. 영어, 한국어, 일본어, 스페인어 기능이 지원되어서 필요에 맞게 사용할 수 있었습니다. 또, AI로 그린 캐릭터 그림도 퀄리티가 높고 제 마음에 쏙 들었습니다. 앞으로가 기대됩니다.', helpfulCount: 1173 }
];

const calculateRatings = (reviews: Review[]): number[] => {
  const totalReviews = reviews.length;
  const ratingCounts = [0, 0, 0, 0, 0];

  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  return ratingCounts.map(count => (count / totalReviews) * 100);
};

const LanReview: React.FC = () => {
  const ratingPercentages = calculateRatings(reviews);

  return (
    <div className='LanReviewbody'>
          <Box sx={{ padding: 2 }}>

      <div className='LanBody'>
        <div className='LanReview1'>
          <br/>
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
            평가 및 리뷰
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {/* 4.2  */}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            리뷰 12개
          </Typography>
        </div>
        <div className='LanReview2'>
        {[1, 2, 3, 4, 5].map(star => (
            <Box key={star} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <Typography variant="body2" sx={{ width: 50 }}>{6 - star}점</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={ratingPercentages[5 - star]}
                  sx={{ height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#ffb400' } }}
                />
              </Box>
              <Typography variant="body2" sx={{ width: 50, textAlign: 'right' }}>
                {Math.round(ratingPercentages[5 - star])}%
              </Typography>
            </Box>
          ))}

        </div>
      </div>
      {reviews.map((review, index) => (
        <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">{review.userName}</Typography>
          <Typography variant="body2" color="textSecondary">{review.date}</Typography>
          <Rating name="read-only" value={review.rating} readOnly />
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            {review.comment}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            사용자 {review.helpfulCount}명이 이 리뷰가 유용하다고 평가함
          </Typography>
          <Typography variant="body2" color="textSecondary">
            이 리뷰가 유용했나요?
          </Typography>
        </Paper>
      ))}

          </Box>

    </div>
  );
};

export default LanReview;
