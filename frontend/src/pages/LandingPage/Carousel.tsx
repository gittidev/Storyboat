import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardMedia, CardContent, CardHeader, Avatar, IconButton, Collapse, CardActions, IconButtonProps } from '@mui/material';
// import { Box, Button, Typography, Card, CardMedia, CardContent, CardHeader, Avatar, IconButton, Collapse, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import main1 from '../../images/main1.png'; // Adjust the import paths as needed
import main2 from '../../images/main2.png';
import main3 from '../../images/main3.png';
import main4 from '../../images/main4.png';
import main5 from '../../images/main5.png';
import main6 from '../../images/main6.png';
import main7 from '../../images/main7.png';
import main8 from '../../images/main8.png';
import main9 from '../../images/main9.png';
import main10 from '../../images/main10.png';
// import { IconButton, IconButtonProps } from '@mui/material'; 



import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ExpandMore = styled((props: IconButtonProps & { expand: boolean }) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


const slides = [
  // 사진 428 * 320px
  
  { src: main2, title: '코믹', subtitle: '유머와 재미', description: '코믹 소설은 유머와 재치를 중심으로 이야기를 전개하며, 독자들에게 즐거운 웃음을 선사합니다. 이 장르는 일상적인 상황이나 인물의 비극적이거나 익살스러운 면모를 강조하여 사람들의 행동과 사고방식을 유머러스하게 표현합니다. 코믹 소설은 등장인물의 해프닝과 우연한 사건을 통해 상황의 아이러니를 부각시키며, 독자들에게 즐거운 웃음과 스트레스 해소의 기회를 제공합니다. 또한, 현실의 복잡한 문제를 가볍게 풀어내며, 독자들에게 긍정적이고 유쾌한 에너지를 전달합니다.' }, 
  { src: main5, title: '공포', subtitle: '불안과 긴장', description: '공포 소설은 독자들에게 불안과 긴장감을 유발하여 스릴과 공포를 경험하게 합니다. 이 장르는 기괴한 사건이나 초자연적인 요소를 중심으로 전개되며, 인간의 두려움과 심리적 공포를 탐구합니다. 공포 소설은 어두운 분위기와 긴장감 넘치는 전개를 통해 독자들을 몰입시키고, 그들의 상상력을 자극하여 불안감을 극대화합니다. 등장인물들이 극복해야 할 공포와 위험이 점점 더 커지면서 독자들은 끝까지 긴장감을 유지하며, 이야기의 전개와 결말에 대한 궁금증을 계속 가지게 됩니다.' },  
 
  { src: main3, title: '미스터리', subtitle: '수수께끼의 전개', description: '미스터리 소설은 복잡한 사건과 그에 얽힌 수수께끼를 중심으로 전개됩니다. 독자는 주인공과 함께 사건의 단서들을 추적하며, 범인을 찾아내거나 사건의 진실을 밝혀내는 과정에 몰입하게 됩니다. 이 장르는 독자의 추리력을 자극하고, 이야기 전개와 해결 과정에서의 긴장감을 통해 스릴을 제공합니다. 미스터리 소설은 다양한 반전과 예측 불가능한 전개를 통해 독자들을 끊임없이 놀라게 하며, 결말에서는 모든 퍼즐이 맞춰지며 독자들에게 놀라운 결론과 만족감을 안겨줍니다.' }, 
  { src: main1, title: '판타지', subtitle: '마법과 모험', description: '판타지 소설은 상상력과 창의성을 극대화하여 현실 세계를 넘어서는 모험과 마법의 세계를 탐험합니다. 이 장르는 독자에게 전통적인 신화나 전설을 현대적 감각으로 재해석한 독특한 세계를 선사하며, 마법, 신비한 생물, 그리고 영웅적인 임무를 통해 전혀 다른 차원의 경험을 제공합니다. 판타지 소설은 현실의 제약을 벗어나 자유롭고 풍부한 상상의 공간을 탐구하며, 인물들이 불가능해 보이는 도전에 맞서 싸우는 과정을 통해 독자들에게 강렬한 감동과 상상의 즐거움을 안겨줍니다.' },

  { src: main4, title: '로맨스', subtitle: '사랑의 이야기', description: '로맨스 소설은 사랑과 관계의 발전을 중심으로 이야기가 전개됩니다. 이 장르는 등장인물 간의 감정적 연결과 갈등을 강조하며, 사랑의 다양한 측면을 탐구합니다. 주로 로맨스의 기쁨과 슬픔, 갈등과 화해를 통해 독자들에게 감동적인 이야기를 전달하고, 인물들이 서로의 마음을 이해하고 관계를 발전시켜 나가는 과정을 그립니다. 로맨스 소설은 독자들에게 감성적이고 따뜻한 경험을 선사하며, 사랑의 힘과 아름다움을 새롭게 조명하는 매력적인 이야기로 가득 차 있습니다.' }, 


  
  { src: main7, title: '역사 소설', subtitle: '과거의 재현', description: '역사 소설은 실제 역사적 사건이나 인물들을 바탕으로 상상력을 더하여 이야기를 전개합니다. 이 장르는 역사적 배경과 시대의 특성을 반영하여 독자들에게 과거의 시대를 생생하게 체험할 수 있게 합니다. 역사 소설은 역사적 사실과 허구를 적절히 혼합하여, 당시의 사회적, 정치적, 문화적 상황을 깊이 있게 탐구하며, 역사 속 인물들의 개인적 이야기를 통해 독자들에게 흥미롭고 교육적인 경험을 제공합니다. 독자들은 이 장르를 통해 과거의 중요한 사건들을 재조명하고, 역사적 맥락 속에서 인간의 삶과 갈등을 이해하게 됩니다.' }, 
  
  { src: main10, title: '시크릿', subtitle: '비밀과 진실', description: '시크릿 소설은 주로 비밀과 숨겨진 진실을 중심으로 진행됩니다. 이 장르는 다양한 단서와 미스터리를 통해 이야기가 전개되며, 독자들은 주인공과 함께 숨겨진 비밀을 파헤치는 과정에 몰입하게 됩니다. 시크릿 소설은 복잡한 플롯과 반전을 통해 독자들의 궁금증을 자극하고, 이야기가 전개됨에 따라 점점 더 깊은 진실이 드러나며 흥미를 더합니다. 독자들은 이야기의 끝에서 모든 비밀이 밝혀지면서 놀라운 결론과 함께 지적 만족감을 느끼게 됩니다.' },
  { src: main6, title: '과학 소설', subtitle: '미래와 기술', description: '과학 소설은 과학적 원리와 기술적 상상을 바탕으로 미래 사회나 우주를 배경으로 하는 이야기입니다. 이 장르는 현실의 과학과 기술을 기반으로 하되, 이를 통해 새로운 가능성과 도전을 탐구하며 독자들에게 신선한 상상의 세계를 제공합니다. 과학 소설은 기술 발전이 인류의 삶에 미치는 영향을 탐구하고, 상상력을 통해 미래의 사회와 문명을 그립니다. 독자들은 이 장르를 통해 과학의 경이로움과 기술의 진보에 대한 새로운 관점을 얻으며, 미래의 가능성과 위험성을 함께 고민하게 됩니다.' }, 
  {src: main8, title: '모험', subtitle: '위험과 성장', description: '모험 소설은 주인공이 위험하고 극적인 상황에 맞서 싸우며 성장하는 이야기를 중심으로 합니다. 이 장르는 새로운 장소를 탐험하거나 중대한 임무를 수행하며, 흥미진진한 상황과 극복 과정을 통해 독자들을 사로잡습니다. 모험 소설은 긴장감 넘치는 사건 전개와 극복의 과정, 그리고 주인공의 성장을 강조하며, 독자들에게 스릴과 흥분을 제공합니다. 주인공이 도전에 맞서 싸우고 새로운 경험을 통해 성장하는 과정을 따라가면서, 독자들은 자신의 상상력을 발휘하고 함께 모험을 즐길 수 있습니다.' }, 
  { src: main9, title: '드라마', subtitle: '감정의 여정', description: '드라마 소설은 복잡한 인간 관계와 감정의 변화를 중심으로 전개됩니다. 이 장르는 캐릭터들의 내적 갈등과 외적 상황이 얽히면서, 그들의 성장과 갈등을 통해 감동적이고 현실적인 이야기를 전달합니다. 드라마 소설은 인물들이 겪는 다양한 감정과 상황을 세밀하게 그리며, 독자들에게 현실적이고 공감가는 이야기로 다가갑니다. 감정적인 깊이와 사실적인 묘사를 통해 독자들은 인물들의 여정을 함께하며, 인생의 다양한 측면을 이해하고 느끼게 됩니다.' }
  
];

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(3);
  const [expanded, setExpanded] = React.useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setFavorites([0,1,3,4,5,6,8]); 
  }, []);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) { 
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) { 
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const toggleFavorite = (index: number) => {
    setFavorites((prev) => 
      prev.includes(index) ? prev.filter(fav => fav !== index) : [...prev, index]
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', padding: '0 16px' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
        {/* MUI Carousel */}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: `translateX(-${currentSlide * (100 / 3 + 10)}%)`, // Adjusting for the gap
          width: `${(slides.length * (100 / 3 + 10))}%)`, // Adjust container width for the gap
        }}
      >
        {slides.map((slide, index) => (
          <Card
            key={index}
            sx={{
              minWidth: `${40}%`, 
              height: 650, 
              marginRight: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: '#2b7eff' }} aria-label="slide">
                {/* <Avatar sx={{ bgcolor: 'rgb(255,0,0)' }} aria-label="slide"> */}
                  {slide.title.charAt(0)}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={slide.title}
              subheader={slide.subtitle}
            />
            <CardMedia
              component="img"
              height="300"
              image={slide.src}
              alt={slide.title}
              sx={{ borderRadius: '4px 4px 0 0' }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {slide.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>


              <IconButton 
                aria-label="add to favorites" 
                onClick={() => toggleFavorite(index)}
                sx={{ color: favorites.includes(index) ? 'red' : 'inherit' }}
              >
                <FavoriteIcon />
              </IconButton>


              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>
                  Additional details aaout {slide.title} can go here.
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Box>

        <Button
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: '#fff',
            fontSize: '3.5rem', // 버튼 내 아이콘의 크기 조정
            width: '300px', // 버튼의 너비
            height: '800px', // 버튼의 높이
            minWidth: '80px', // 버튼의 최소 너비
            minHeight: '80px', // 버튼의 최소 높이
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            // backgroundColor: '#1976d2', 
            // '&:hover': {
            //   backgroundColor: '#115293', 
            // },
            marginRight: '2%', // 캐러셀과 버튼 사이의 간격
            backgroundColor: 'transparent', // 기본 배경색 제거
            boxShadow: 'none', // 클릭 시 그림자 효과 제거
            border: 'none', // 클릭 시 테두리 효과 제거
            '&:hover': {
              backgroundColor: 'transparent', // hover 시 배경색 유지
              boxShadow: 'none', // hover 시 그림자 효과 제거
            },
            '&:focus': {
              outline: 'none', // 포커스 시 아웃라인 제거
            },
            '&:active': {
              backgroundColor: 'transparent', // 클릭 시 배경색 유지
              boxShadow: 'none', // 클릭 시 그림자 효과 제거
            }
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 'inherit' }} /> {/* 아이콘 크기 조정 */}
        </Button>

        <Button
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: '#fff',
            fontSize: '3.5rem', // 버튼 내 아이콘의 크기 조정
            width: '300px', // 버튼의 너비
            height: '800px', // 버튼의 높이
            minWidth: '80px', // 버튼의 최소 너비
            minHeight: '80px', // 버튼의 최소 높이

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            // backgroundColor: '#1976d2', 
            // '&:hover': {
            //   backgroundColor: '#115293', 
            // },
            marginLeft: '2%', // 캐러셀과 버튼 사이의 간격
            backgroundColor: 'transparent', // 기본 배경색 제거
            boxShadow: 'none', // 클릭 시 그림자 효과 제거
            border: 'none', // 클릭 시 테두리 효과 제거
            '&:hover': {
              backgroundColor: 'transparent', // hover 시 배경색 유지
              boxShadow: 'none', // hover 시 그림자 효과 제거
            },
            '&:focus': {
              outline: 'none', // 포커스 시 아웃라인 제거
            },
            '&:active': {
              backgroundColor: 'transparent', // 클릭 시 배경색 유지
              boxShadow: 'none', // 클릭 시 그림자 효과 제거
            }
          }}
        >
      <ArrowForwardIosIcon sx={{ fontSize: 'inherit' }} /> {/* 아이콘 크기 조정 */}
    </Button>`
    </Box>
  );
};

export default Carousel;
