import React, { useState } from 'react'
import { Tag } from './Tag'

const FindTeam = () => {

    const [ title, setTitle ] = useState("")
    const [ content, setContent ] = useState("")
    const [ tags, setTags ] = useState("")

    const onChangeTitle = (e) => {
        setTitle(e.target.value)
    }

    const onChangeContent = (e) => {
        setContent(e.target.value)
    }

    const onChangeTags = (e) => {
        setTags(e.target.value)
    }

  return (
    <>
    <div>
        <b> 제목 : </b>
        <input value={title} onChange={onChangeTitle} />
        <br />
        <b>태그 : </b>
        <Tag/>
        {/* <input value={tags} onChange={onChangeTags} /> */}
        <br />
        <b>내용 : </b>
        <input value={content} onChange={onChangeContent} />
        <br />
        <button>작성하기</button>
    </div>
    </>
  )
}

export default FindTeam