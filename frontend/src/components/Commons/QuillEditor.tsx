// src/components/Commons/QuillEditor.tsx
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value?: string;
  onChange?: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
          ],
        },
      });

      quillRef.current.on('text-change', () => {
        const content = quillRef.current?.root.innerHTML;
        if (content && onChange) {
          onChange(content);
        }
      });

      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }

    return () => {
      quillRef.current = null; // 컴포넌트 언마운트 시 참조를 해제합니다.
    };
  }, [onChange, value]);

  return <div ref={editorRef} style={{ height: '400px' }} />;
};

export default QuillEditor;
