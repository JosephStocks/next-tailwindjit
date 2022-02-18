import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CopyBlock = ({ text }) => {
  const fillerText = 'What is that?';

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand('copy', true, text);
    }
    toast.success(
      <>
        <bold className="font-bold">Copied!</bold>
        <div className="line-clamp-3">{text}</div>
      </>
    );
  }

  // const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [text, setText] = useState(text);

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
          clearTimeout(clickTimeout);
          setClickTimeout(null);
        }, 250)
      );
    }
  };

  return (
    <>
      {isEditing ? (
        <textarea
          ref={ref}
          value={text}
          autoFocus
          role="button"
          className="w-full cursor-text rounded-lg px-3 py-1 focus:border-slate-800"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            console.log(event.key);
            if (event.key === 'Enter') {
              setIsEditing(false);
            }
            if (event.keyCode == 27) {
              setIsEditing(false);
            }
          }}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <div className="group inline-flex max-w-fit overflow-hidden rounded-lg">
          <button
            onClick={handleClicks}
            className="bg-white py-1 pl-3 text-left text-gray-800 group-hover:bg-indigo-800 group-hover:text-white"
          >
            {text}
          </button>
          <button
            onClick={copyTextAction}
            className="flex items-center bg-white px-3 py-1 text-indigo-800 group-hover:bg-indigo-800 group-hover:text-white"
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </div>
      )}
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
