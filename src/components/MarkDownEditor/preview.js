import ReactMarkdown from "react-markdown";
import { useMarkdown } from "./providers/markdownProvider";

const Preview = ({ content }) => {
  const [markdown, setMarkdown] = useMarkdown();

  if (content) {
    setMarkdown(content);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="preview overflow-auto flex-grow">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Preview;
