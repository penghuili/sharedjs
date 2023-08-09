import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Typography } from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { getColor } from '../../react-pure/color';
import Toolbar from './Toolbar';

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  .ProseMirror {
    padding: ${({ padding }) => padding};
    border: ${({ editable }) => (editable ? `1px solid ${getColor('light-4')}` : '0')};
    min-height: ${({ editable }) => (editable ? '10rem' : '0')};

    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1rem;
      margin: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1;
      margin-top: 0;
      font-size: 1.5rem;
    }

    p {
      margin: 0 0 16px;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0d0d0d, 0.1);
      margin: 2rem 0;
    }

    ul[data-type='taskList'] {
      list-style: none;
      padding: 0;

      p {
        margin: 0;
      }

      li {
        display: flex;

        > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }

        > div {
          flex: 1 1 auto;
        }
      }
    }
  }
`;

function TextEditor({ editable = true, text, themeMode, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Typography, TaskItem, TaskList],
    content: '',
    editable,
  });

  useEffect(() => {
    function handleUpdate() {
      onChange(editor.getHTML());
    }

    if (editor) {
      editor.on('update', handleUpdate);
    }

    return () => {
      if (editor) {
        editor.off('update', handleUpdate);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    if (editor) {
      if (text !== editor.getHTML()) {
        editor.commands.setContent(text || '');
      }
    }
  }, [editor, text]);

  function getPadding() {
    if (editable) {
      return '8px 16px';
    }

    return '0';
  }

  return (
    <Wrapper padding={getPadding()} editable={editable}>
      {editable && <Toolbar editor={editor} themeMode={themeMode} />}

      <EditorContent editor={editor} />
    </Wrapper>
  );
}

export default TextEditor;
