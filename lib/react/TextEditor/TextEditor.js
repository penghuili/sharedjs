import { Link } from '@tiptap/extension-link';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Typography } from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import React, { useEffect } from 'react';

import EditorWrapper from './EditorWrapper';
import Toolbar from './Toolbar';

function TextEditor({ editable = true, text, themeMode, onChange, onReadOnlyChecked }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      TaskItem.configure({
        nested: true,
        onReadOnlyChecked: onReadOnlyChecked
          ? (node, checked, html) => {
              onReadOnlyChecked(html);
            }
          : null,
      }),
      TaskList,
    ],
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
    <EditorWrapper padding={getPadding()} editable={editable}>
      {editable && <Toolbar editor={editor} themeMode={themeMode} />}

      <EditorContent editor={editor} />
    </EditorWrapper>
  );
}

export default TextEditor;
