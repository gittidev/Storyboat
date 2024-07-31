//longMenu 내용 작성시 작동할 utils
export const handleMenuClick = (option: string) => {
  switch (option) {
    case 'logout':
      console.log('로그아웃 되었습니다.');
      //로그아웃 로직 작성해주세요
      break;
    case 'accept': //팀 초대 수락 로직 작성
      console.log('Option 2 selected');
      // Add your specific event handling logic for Option 2 here
      break;
    case 'reject': // 팀 초대 거절 로직 작성
      console.log('Option 3 selected');
      // Add your specific event handling logic for Option 3 here
      break;
    case 'delete': //팀에서 제거하기 로직 작성
      console.log('Option 3 selected');
      // Add your specific event handling logic for Option 3 here
      break;
    default:
      console.log('Unknown option selected');
  }
};
