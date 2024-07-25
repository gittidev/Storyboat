import Button from "../Button"
import { Box } from "@mui/material"
import TeamTable from "./TeamTable";


// interface Member {
//     id: number;
//     name: string;
// }


//더미
// const members: Member[] = [
//     { id: 1, name: 'Alice' },
//     { id: 2, name: 'Bob' },
//     { id: 3, name: 'Charlie' },
//     { id: 4, name: 'David' },
//     { id: 5, name: 'Eve' },
//     { id: 6, name: 'Frank' },
//     { id: 7, name: 'Grace' },
//     { id: 8, name: 'Hannah' },
//     { id: 9, name: 'Ivy' },
//     { id: 10, name: 'Jack' }
// ];


const TeamSetting = () =>{


    return (
        <>
        <div style={{ width : '100%' }}>

      
        <Box>
            팀관리페이지
            <h1>팀원 초대하기</h1>
            <p>이메일을 작성 후 발송합니다. 메일의 수락하기를 통해 팀에 참여할수 있습니다.</p>
            <form action="">
                <input type="text"/>
            </form>
            <form action="">

            </form>
            <Button content='초대 발송하기' bgcolor="#00C4BB"/>
        </Box>
        <div >
        <h2>멤버 관리하기</h2>
        <TeamTable/>
        </div>
        </div>
        </>
    )
}

export default TeamSetting