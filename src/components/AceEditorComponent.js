import React from "react";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/mode-javascript";

export default function AceEditorComponent({ name, value, onChange }) {
  const codePlaceholder = `Value == null`;

  return (
    <AceEditor
      mode="java"
      theme="chrome"
      onChange={onChange}
      value={value == null ? codePlaceholder : value}
      name="UNIQUE_ID"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        // enableBasicAutocompletion: true,
        // enableLiveAutocompletion: true,
        // enableSnippets: false,
        // showGutter: true,
        // tabSize: 2,
        fontSize: 14,
      }}
      width="100%"
      height="100%"
      className="w-full h-full"
    />
  );
}
