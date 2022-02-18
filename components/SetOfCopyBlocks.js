import CopyBlock from './CopyBlock';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';

const SetOfCopyBlocks = () => {
  const [blocks, setBlocks] = useState(['This is pretty cool initial text']);
  const HandleAddEditableCopyBlock = () => {};
  return (
    <>
      <div
        className="min-h-screen space-y-3"
        onPaste={async () => {
          setBlocks([...blocks, await navigator.clipboard.readText()]);
        }}
      >
        {blocks.map((text) => (
          <CopyBlock text={text} />
        ))}
        <div className="group mt-8 flex justify-center">
          <button
            onClick={HandleAddEditableCopyBlock}
            className="h-16 w-16 rounded-full bg-indigo-800 text-white group-hover:bg-white group-hover:text-indigo-800"
          >
            <FontAwesomeIcon icon={faPlus} size="3x" />
          </button>
        </div>
      </div>
      <ToastContainer hideProgressBar autoClose={3000} />
    </>
  );
};

export default SetOfCopyBlocks;
