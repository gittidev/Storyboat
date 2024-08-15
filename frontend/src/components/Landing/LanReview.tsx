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
const reviews: Review[] = [
  { userName: '김작가', date: '2024년 8월 18일', rating: 5, comment: '이 프로그램은 공동 집필의 모든 과정을 한 곳에서 관리할 수 있어서 정말 편리합니다. 팀원들과 실시간으로 소설을 함께 작성할 수 있는 기능이 특히 마음에 들었습니다. 덕분에 협업이 훨씬 수월해졌습니다. 매우 추천합니다!', helpfulCount: 75 },
  { userName: '최작가', date: '2024년 8월 1일', rating: 5, comment: '이 프로그램 덕분에 공동 작업이 훨씬 더 효율적이 되었습니다. 특히 AI를 활용해 캐릭터 이미지를 생성할 수 있는 기능이 매우 유용합니다. 소설의 시각적인 요소를 쉽게 추가할 수 있어 작업이 훨씬 재미있어졌습니다.', helpfulCount: 1211 },
  { userName: '이작가', date: '2024년 7월 29일', rating: 4, comment: '전반적으로 기능이 잘 갖추어져 있습니다. 공동 집필을 쉽게 할 수 있어서 매우 만족합니다. AI 캐릭터 이미지 생성 기능 덕분에 소설에 생동감을 더할 수 있었고, 협업 과정에서 큰 도움이 되었습니다. 앞으로가 기대됩니다.', helpfulCount: 1173 }
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
              {/* 4.5 (평균 평점 예시) */}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              리뷰 {reviews.length}개
            </Typography>
          </div>
          <div className='LanReview2'>
            {[1, 2, 3, 4, 5].map(star => (
              <Box key={star} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                <Typography variant="body2" sx={{ width: 50 }}>{6 - star}점</Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={ratingPercentages[5 - star] || 0}
                    sx={{ height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#ffb400' } }}
                  />
                </Box>
                <Typography variant="body2" sx={{ width: 50, textAlign: 'right' }}>
                  {Math.round(ratingPercentages[5 - star] || 0)}%
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
          </Paper>
        ))}
      </Box>
    </div>
  );
};

export default LanReview;
