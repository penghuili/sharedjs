import React, { useEffect } from 'react';
import { Link } from '@tiptap/extension-link';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Typography } from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { breakpoint } from '../../react-pure/size';
import useIsMobileSize from '../hooks/useIsMobileSize';
import useRefValue from '../hooks/useRefValue';
import EditorWrapper from './EditorWrapper';
import Toolbar from './Toolbar';

function TextEditor({ editable = true, text, onChange, onFocus, onBlur, onReadOnlyChecked }) {
  const isMobile = useIsMobileSize();

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

  const onFocusRef = useRefValue(onFocus);
  const onBlurRef = useRefValue(onBlur);

  useEffect(() => {
    const handleUpdate = () => {
      onChange(editor.getHTML());
    };
    const handleFocus = () => {
      if (onFocusRef.current) {
        onFocusRef.current();
      }
    };
    const handleBlur = () => {
      if (onBlurRef.current) {
        onBlurRef.current();
      }
    };

    if (editor) {
      editor.on('update', handleUpdate);
      editor.on('focus', handleFocus);
      editor.on('blur', handleBlur);
    }

    return () => {
      if (editor) {
        editor.off('update', handleUpdate);
        editor.off('focus', handleFocus);
        editor.off('blur', handleBlur);
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
    <EditorWrapper
      padding={getPadding()}
      editable={editable}
      maxWidth={isMobile ? 'calc(100vw - 2rem)' : `${breakpoint}px`}
    >
      {editable && <Toolbar editor={editor} />}

      <EditorContent editor={editor} />
    </EditorWrapper>
  );
}

export default TextEditor;
