import React from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import a11ydark from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark"

const CodeBlock = ({ children, className }) => {
  const language = className && className.replace(/language-/, "")
  return (
    <SyntaxHighlighter language={language} style={a11ydark}>
      {children}
    </SyntaxHighlighter>
  )
}

export default CodeBlock
