"use client";

import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";

export default function EmojiPickerComponet({ onEmojiSelect }) {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const handleOpenEmojiPicker = (e) => {
    e.preventDefault();
    setOpenEmojiPicker((prev) => !prev);
  };

  const handleEmojiMessage = (emojiObject) => {
    onEmojiSelect(emojiObject.emoji);
    setOpenEmojiPicker(false);
  };
  return (
    <>
      <div>
        <button onClick={handleOpenEmojiPicker}>
          <MdOutlineEmojiEmotions size={25} />
        </button>
        {openEmojiPicker && (
          <div className="fixed top-52 ml-44 w-fit h-fit flex items-center">
            <div>
              <EmojiPicker onEmojiClick={handleEmojiMessage} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
