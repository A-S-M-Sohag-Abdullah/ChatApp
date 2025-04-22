import React, { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiInput = () => {
  const editorRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  const insertNodeAtCaret = (node) => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const insertAtCursor = (emojiData) => {
    const img = document.createElement("img");
    img.src = emojiData.imageUrl;
    img.alt = emojiData.emoji;
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.cursor = "default";
    img.style.margin = "0 3px";

    // Insert at caret
    insertNodeAtCaret(img);
  };
  const savedSelection = useRef(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0);
    }
  };
  const restoreSelection = () => {
    const selection = window.getSelection();
    if (savedSelection.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
  };
  const handleEmojiClick = (emojiData) => {
    editorRef.current.focus();
    restoreSelection(); // Restore caret
    insertAtCursor(emojiData); // Insert emoji
    saveSelection(); // Save the new position after insertion
    // Refocus the editor
  };
  /*  const handleEmojiClick = (emojiData) => {
    editorRef.current.focus();
    insertAtCursor(emojiData);
  }; */

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onBlur={saveSelection}
          className="w-full min-h-[100px] p-2 rounded border focus:outline-none focus:ring text-base leading-6"
          placeholder="Type something..."
          onInput={(e) => {
            // Optional: could do sanitization or limit emoji usage
          }}
        />
        <button
          onClick={() => {
            setShowPicker((prev) => !prev);
          }}
          className="absolute bottom-2 right-2 text-xl"
        >
          😊
        </button>
        {showPicker && (
          <div className="absolute bottom-10 right-0 z-10">
            <EmojiPicker
              onEmojiClick={(emojiData) => handleEmojiClick(emojiData)}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiInput;
