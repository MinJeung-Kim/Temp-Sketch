import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  inputPosition: {
    left: number;
    top: number;
  };
  inputVisible: boolean;
  setInputVisible: React.Dispatch<React.SetStateAction<boolean>>;
  inputStyle: React.CSSProperties;
};

export default function Text({
  inputRef,
  inputPosition,
  setInputVisible,
  inputStyle,
  inputVisible,
}: Props) {
  const { saveState, canvas, setMode } = useCanvas();

  const handleInputBlur = () => {
    if (canvas && inputRef.current) {
      const value = inputRef.current.value;
      if (value) {
        const text = new fabric.IText(value, {
          left: inputPosition.left,
          top: inputPosition.top,
          fontFamily: "Arial",
          fontSize: 20,
          fill: "#000",
          originX: "left",
          originY: "top",
        });
        canvas.add(text);
        saveState(canvas);
      }
      setInputVisible(false);
      inputRef.current.value = "";
    }
  };
  return (
    <>
      <input
        type="text"
        ref={inputRef}
        style={{ ...inputStyle, display: inputVisible ? "block" : "none" }}
        onBlur={handleInputBlur}
      />
      <button onClick={() => setMode("text")}>Add Text</button>
    </>
  );
}
