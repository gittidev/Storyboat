import React, { useState } from 'react';
import CustomButton from '../Commons/CustomButton';
import { TextField } from '@mui/material';

interface IdeaFormProps {
    // onSave?: (idea: IdeaType) => void;
    onSubmit: (title: string, content: string) => void;
    onClose: () => void;
}

const StudioIdeaForm: React.FC<IdeaFormProps> = ({ onSubmit, onClose }) => {
    // const [ideaList, setIdeaList] = useRecoilState(ideaState);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    // const setIdeas = useSetRecoilState(ideaState)
    // const studioId = useRecoilState(selectedStudioState)[0];
    // const accessToken = useRecoilValue(accessTokenState)
    // console.log(studioId)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        onSubmit(title, content)

        setLoading(false);
        setTitle('')
        setContent('')
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>

                <TextField
                    required
                    id="outlined-required"
                    label="제목"
                    placeholder='아이디어 제목을 작성하세요'
                    sx={{ marginBottom: '15px', width: '100%' }}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <TextField
                    required
                    id="outlined-multiline-static"
                    label="내용"
                    multiline
                    rows={4}
                    placeholder='아이디어를 작성하세요'
                    sx={{ marginBottom: '15px', width: '100%' }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <CustomButton type="submit" content="생성하기" bgcolor='lightgreen' hoverBgColor='green' disabled={loading} width='' />
                <CustomButton type="button" content="취소하기" bgcolor='gray' hoverBgColor='red' onClick={onClose} />
                {loading && <p>저장 중...</p>}
            </div>

        </form>
    );
};

export default StudioIdeaForm;
