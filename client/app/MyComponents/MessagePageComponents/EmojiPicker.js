'use client'

import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";


export default function EmojiPickerComponet({onEmojiSelect}){

    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

      const handleOpenEmojiPicker = (e) => {
    e.preventDefault();
    setOpenEmojiPicker((prev) => !prev);
  };

    const handleCloseEmojiPicker = () => {
        setOpenEmojiPicker(false);
      };

    const handleEmojiMessage = (emojiObject) => {
        onEmojiSelect(emojiObject.emoji);
        setOpenEmojiPicker(false);
      };
    return(
        <>
            <div>
            <button onClick={handleOpenEmojiPicker}>
                <MdOutlineEmojiEmotions size={25} />
              </button>
              {openEmojiPicker && (
                <div className="fixed inset-40 top-0 bg-opacity-25 w-full h-full flex justify-center items-center" >
                 <div
                 className="w-fit mb-[27rem]  realtive cursor-pointer "
                 onClick={handleCloseEmojiPicker}
               >
                 <RxCross2
                   size={30}
                   className="text-white hover:text-red-600"
                 />
               </div>
                <div>
                  <EmojiPicker onEmojiClick={handleEmojiMessage} />
                </div>
                </div>
              )}
            </div>
        </>
    )
}