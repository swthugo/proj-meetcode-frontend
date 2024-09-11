import TitleBar from "./titleBar";
import ReactMarkdown from "react-markdown";
import { useMarkdown } from "./providers/markdownProvider";

const QuesetionPreview = () => {
  const [markdown] = useMarkdown();

  return (
    <div className="flex flex-col h-full">
      <TitleBar title="Preview" />
      <div className="preview overflow-auto flex-grow">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default QuesetionPreview;
