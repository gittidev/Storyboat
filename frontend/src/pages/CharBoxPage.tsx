import CharBox from '../components/Char/CharBox'
// import CharForm from '../components/Char/CharForm'
// import { Tag } from "../components/Tag"
import Tag from "../components/Tag"

// interface Character {
//     name: string;
//     tags: string;
//     features: string;
//   }

const CharBoxPage = () => {
    return (
        <>
        <Tag/>
        팀 캐릭터 보관함
        <CharBox/>
        {/* <CharForm/> */}
        </>
    )


}

export default CharBoxPage