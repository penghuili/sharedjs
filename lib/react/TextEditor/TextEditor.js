import { Typography } from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Button, Text } from 'grommet';
import {
  BlockQuote,
  Bold,
  Clear,
  Code,
  Command,
  FormNext,
  FormPrevious,
  Italic,
  List,
  OrderedList,
  Redo,
  StrikeThrough,
  Subtract,
  Undo,
} from 'grommet-icons';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { getColor } from '../../react-pure/color';
import { darkBackground, lightBackground } from '../../react-pure/createTheme';

const Wrapper = styled.div`
  position: relative;

  .ProseMirror {
    padding: ${({ padding }) => padding};
    border: ${({ editable }) => (editable ? `1px solid ${getColor('light-4')}` : '0')};

    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
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
  }
`;

const MenuWrapper = styled.div`
  padding: 4px 16px;

  position: sticky;
  top: ${({ top }) => top}px;
  z-index: 1;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  border: 1px solid ${getColor('light-4')};
  background-color: ${({ background }) => background};
`;

function MenuBar({ editor, themeMode }) {
  if (!editor) {
    return null;
  }

  return (
    <MenuWrapper top={0} background={themeMode === 'dark' ? darkBackground : lightBackground}>
      <Button
        icon={<Bold />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        color={editor.isActive('bold') ? 'brand' : undefined}
        plain
        margin="0 8px 4px 0"
      />
      <Button
        margin="0 8px 4px 0"
        icon={<Italic />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        color={editor.isActive('italic') ? 'brand' : undefined}
        plain
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<StrikeThrough />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        color={editor.isActive('strike') ? 'brand' : undefined}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<Code />}
        onClick={() => editor.chain().focus().toggleCode().run()}
        color={editor.isActive('code') ? 'brand' : undefined}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<Clear />}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<Text size="24px">H1</Text>}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        color={editor.isActive('heading', { level: 1 }) ? 'brand' : undefined}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<List />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        color={editor.isActive('bulletList') ? 'brand' : undefined}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<OrderedList />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        color={editor.isActive('orderedList') ? 'brand' : undefined}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<FormNext />}
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<FormPrevious />}
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<Command />}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        color={editor.isActive('codeBlock') ? 'brand' : undefined}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<BlockQuote />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        color={editor.isActive('blockquote') ? 'brand' : undefined}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<Subtract />}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<Undo />}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <Button
        margin="0 8px 4px 0"
        plain
        icon={<Redo />}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </MenuWrapper>
  );
}

function TextEditor({ editable = true, text, themeMode, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Typography],
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
      {editable && <MenuBar editor={editor} themeMode={themeMode} />}

      <EditorContent editor={editor} />
    </Wrapper>
  );
}

export default TextEditor;
