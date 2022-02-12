import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [text, setText] = useState('Here is some filler text to start');

  const copyTextAction = () => copyTextToClipboard(text);
  const makeTextEditable = () => setIsEditing(true);

  const ref = useRef();
  useOnClickOutside(ref, () => setIsEditing(false));

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
          toast.success(
            <>
              <bold className="font-bold">Copied!</bold>
              <div className="line-clamp-3">{text}</div>
            </>
          );
          clearTimeout(clickTimeout);
          setClickTimeout(null);
        }, 400)
      );
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          ref={ref}
          value={text}
          autoFocus
          role="button"
          className="w-full cursor-text rounded-lg border-2 border-transparent px-3 py-1 hover:brightness-110 focus:border-slate-800"
          // readOnly={!isEditing}
          // onClick={handleClicks}
          onChange={(event) => setText(event.target.value)}
        />
      ) : (
        <button
          onClick={handleClicks}
          className="relative rounded-lg border-2 border-transparent bg-white px-3 py-1 pr-10 hover:brightness-90 active:bg-green-400"
        >
          {text}
          <div className="absolute inset-y-0 right-0 mr-2 flex items-center">
            <FontAwesomeIcon icon={faCopy} />
          </div>
        </button>
      )}
      <ToastContainer hideProgressBar />
    </>
  );
};
// Borrowed from https://usehooks.com/useOnClickOutside/
function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

export default CopyBlock;
