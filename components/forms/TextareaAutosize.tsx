import { useEffect, useRef } from "react";

function TextareaAutosize({ ...props }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [props.value]);

  return <textarea ref={textareaRef} {...props} />;
}

export default TextareaAutosize;
