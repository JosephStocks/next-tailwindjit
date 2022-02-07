import { useState } from 'react';

const CopyBlock = () => {
  const fillerText = 'What is that?';

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  // const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [text, setText] = useState('');

  const copyTextAction = () => copyTextToClipboard(fillerText);
  const makeTextEditable = () => setIsEditing(true);

  const handleClicks = () => {
    if (clickTimeout !== null) {
      console.log('double click executes');
      makeTextEditable();
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    } else {
      console.log('single click');
      setClickTimeout(
        setTimeout(() => {
          copyTextAction();
          console.log('first click executes ');
          clearTimeout(clickTimeout);
          setClickTimeout(null);
        }, 400)
      );
    }
  };

  return (
    <input
      value={text}
      role="button"
      className="rounded border border-slate-300 px-3 py-1 hover:brightness-110"
      readOnly={!isEditing}
      onClick={handleClicks}
      onChange={(event) => setText(event.target.value)}
    />
  );
};

export default CopyBlock;
