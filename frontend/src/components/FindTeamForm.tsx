import React, { useState } from 'react'
// import { Tag } from './Tag'

interface FindTeamProps {
    onSave : (findteam : Findteam) => void;
}

interface Findteam {
    title : string;
    content : string;
    // tags : string[];
}

const FindTeamForm:React.FC<FindTeamProps> = ({onSave}) => {

    const [ title, setTitle ] = useState("")
    const [ content, setContent ] = useState("")
    // const [ tags, setTags ] = useState("")

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // const findteam: Findteam = { title,content,tags };
        const findteam: Findteam = { title,content };
        onSave(findteam);
        setTitle('');
        setContent('');
        // setTags('');

      };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          이름
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          태그
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          특징
          <input
            // value={tags}
            // onChange={(e) => setTags(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '0.5rem', boxSizing: 'border-box', height: '100px' }}
            required
          />
        </label>
      </div>
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>저장하기</button>
    </form>
  )
}

export default FindTeamForm