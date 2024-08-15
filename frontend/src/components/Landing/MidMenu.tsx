import React, { useState } from 'react';
import './MidMenu.css';
import MediationIcon from '@mui/icons-material/Mediation';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BrushIcon from '@mui/icons-material/Brush'; // AI 캐릭터 생성 아이콘으로 대체

import MediationIcon2 from '@mui/icons-material/Mediation';
import TipsAndUpdatesIcon2 from '@mui/icons-material/TipsAndUpdates';
import MenuBookIcon2 from '@mui/icons-material/MenuBook';
import BrushIcon2 from '@mui/icons-material/Brush'; // AI 캐릭터 생성 아이콘으로 대체

const MidMenu: React.FC = () => {
    // State to keep track of the selected radio button
    const [selected, setSelected] = useState<string | null>('radio_green');

    // Handle radio button change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(event.target.id);
    };

    // Define inline styles for each color
    const labelStyles = {
        red: { color: 'red' },
        orange: { color: 'orange' },
        green: { color:'green' },
        blue: { color:'blue' }
    };

    return (
        <div className='total_mid'>
            <div id="scene">
                <div id="left-zone">
                    <ul className="list">
                        <li className="item1">
                            <div className="radio-wrapper">
                                <input
                                    type="radio"
                                    id="radio_green"
                                    name="carousel"
                                    checked={selected === 'radio_green'}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="radio_green"
                                    style={selected === 'radio_green' ? labelStyles.green : {}}
                                >
                                    <TipsAndUpdatesIcon/> &nbsp;&nbsp;&nbsp;아이디어 플롯 회의&nbsp;
                                </label>
                            </div>
                        </li>
                        <li className="item2">
                            <div className="radio-wrapper">
                                <input
                                    type="radio"
                                    id="radio_red"
                                    name="carousel"
                                    checked={selected === 'radio_red'}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="radio_red"
                                    style={selected === 'radio_red' ? labelStyles.red : {}}
                                >
                                  <MenuBookIcon/> &nbsp;&nbsp;&nbsp;공동 작성 기능&nbsp;
                                </label>
                            </div>
                        </li>
                        <li className="item3">
                            <div className="radio-wrapper">
                                <input
                                    type="radio"
                                    id="radio_orange"
                                    name="carousel"
                                    checked={selected === 'radio_orange'}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="radio_orange"
                                    style={selected === 'radio_orange' ? labelStyles.orange : {}}
                                >
                                <MediationIcon/> &nbsp;&nbsp;&nbsp;버전 관리&nbsp;
                                </label>
                            </div>
                        </li>
                        <li className="item4">
                            <div className="radio-wrapper">
                                <input
                                    type="radio"
                                    id="radio_blue"
                                    name="carousel"
                                    checked={selected === 'radio_blue'}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="radio_blue"
                                    style={selected === 'radio_blue' ? labelStyles.blue : {}}
                                >
                                <BrushIcon/> &nbsp;&nbsp;&nbsp;AI 이미지 & 텍스트 &nbsp;
                                </label>
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="middle-border"></div>
                <div id="right-zone">
                    {selected === 'radio_green' && (
                        <div className='item_r1'>
                            <p><TipsAndUpdatesIcon2 className="icon-large"/><br/><span className="large-text3">아이디어 플롯 회의</span><br/><br/>
                            소설의 플롯과 아이디어를 구체화하는 회의를 지원합니다. 사용자는 아이디어를 공유하고 토론하며, 스토리의 방향성을 정립할 수 있습니다. 다양한 의견을 모으고, 창의적인 플롯을 개발하는 데 유용한 도구입니다.</p>
                        </div>
                    )}
                    {selected === 'radio_red' && (
                        <div className='item_r2'>
                            <p><MenuBookIcon2 className="icon-large" /><br/> <span className="large-text1">공동 작성 기능</span> <br/><br/>
                            Story Boat는 여러 사용자가 동시에 하나의 소설을 작성할 수 있게 해줍니다. 실시간으로 다른 참여자들의 수정 사항을 반영하고, 의견을 교환하며 협력하여 스토리를 발전시킬 수 있습니다. 공동 작성 기능을 통해 더 창의적이고 풍부한 내용의 소설을 만들어 나갈 수 있습니다.</p>
                        </div>
                    )}
                    {selected === 'radio_orange' && (
                        <div className='item_r3'>
                            <p><MediationIcon2 className="icon-large"/> <br/><span className="large-text2">버전 관리</span><br/><br/>
                            소설의 각 버전을 기록하고 관리할 수 있습니다. 이전 버전으로 쉽게 돌아갈 수 있으며, 변경 사항을 추적하고 필요에 따라 수정할 수 있습니다. 이를 통해 소설의 발전 과정을 명확히 하고, 실수나 변경 사항에 대한 대응이 용이합니다.</p>
                        </div>
                    )}
                    {selected === 'radio_blue' && (
                        <div className='item_r4'>
                            <p><BrushIcon2 className="icon-large"/> <br/><span className="large-text4">AI 이미지 & 텍스트 생성</span><br/><br/>
                            Story Boat의 AI 도구를 활용해 캐릭터 이미지를 생성하고, 텍스트를 자동으로 생성할 수 있습니다. 이 기능은 소설의 시각적 요소를 강화하고, 빠르고 효율적으로 이야기를 전개할 수 있도록 도와줍니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MidMenu;
