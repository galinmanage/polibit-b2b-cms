import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Editor = (props) => {
  const { onChange = () => {}, name, value } = props;

  const onChangeHandler = (event, editor) => {
    let data = editor.getData();
    onChange(name, data);
  };

  const config = {
    language: 'he',
  };

  return (
    <div className={'editor-wrapper'}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={config}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default Editor;
