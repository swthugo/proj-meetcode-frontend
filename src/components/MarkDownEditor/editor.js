import { useEffect, useState } from "react";
import TitleBar from "./titleBar";
import { useMarkdown } from "./providers/markdownProvider";

const Editor = ({ title, content, onMarkdownChange }) => {
  const [markdown, setMarkdown] = useMarkdown("");
  const [words, setWords] = useState(0);
  const [chars, setChars] = useState(0);

  const getWordsCount = (str) => {
    if (!str) {
      return 0;
    }
    const matches = str.match(/(\w+)/g);
    return matches ? matches.length : 0;
  };

  const getCharsCount = (str) => {
    return str.length;
  };

  const updateMarkdown = (event) => {
    const value = event.target.value;

    setMarkdown(value);
    onMarkdownChange(value);
    setWords(getWordsCount(value));
    setChars(getCharsCount(value));
  };

  useEffect(() => {
    if (content) setMarkdown(content);
  });

  useEffect(() => {
    setWords(getWordsCount(markdown));
    setChars(getCharsCount(markdown));
  }, [markdown]);

  // const downloadFile = () => {
  //   const link = document.createElement("a");
  //   const file = new Blob([markdown], { type: "text/plain" });
  //   link.href = URL.createObjectURL(file);
  //   link.download = "Untitled.md";
  //   link.click();
  //   URL.revokeObjectURL(link.href);
  // };

  return (
    <div className="flex flex-col h-full">
      <TitleBar title={title} aside={`${words} Words ${chars} Characters`} />
      <textarea
        className="editor w-full flex-grow border-none outline-none appearance-none bg-transparent resize-none"
        value={markdown}
        onChange={updateMarkdown}
      />
      {/* <button onClick={downloadFile}>Download File</button> */}
    </div>
  );
};

export default Editor;
