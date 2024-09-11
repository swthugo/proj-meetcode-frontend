import { createContext, useContext, useState } from "react";

const MarkdownContext = createContext(null);

const MarkdownProvider = ({ className, children }) => {
  const [markdown, setMarkdown] = useState("");

  return (
    <MarkdownContext.Provider value={[markdown, setMarkdown]}>
      <div className={className}>{children}</div>
    </MarkdownContext.Provider>
  );
};

export const useMarkdown = () => useContext(MarkdownContext);

export default MarkdownProvider;
