import { useRef } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";
import ImageIcon from "@src/components/ui/icons/ImageIcon";
import { S } from "./styles";

export default function AddImage() {
  const { undoHistory, setUndoHistory, setRedoHistory, canvas } = useCanvas();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const saveState = (canvasInstance: fabric.Canvas) => {
    const json = JSON.stringify(canvasInstance.toJSON());
    const newUndoHistory = [...undoHistory, json];
    setUndoHistory(newUndoHistory);
    setRedoHistory([]); // Clear redo history when a new state is saved
  };

  const addImageToCanvas = (file: File) => {
    if (canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target?.result as string, (img) => {
          img.set({
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            originX: "center",
            originY: "center",
          });
          canvas.add(img);
          saveState(canvas);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      addImageToCanvas(event.target.files[0]);
    }
  };

  return (
    <>
      <S.Button onClick={() => imageInputRef.current?.click()}>
        <ImageIcon />
        이미지 추가
      </S.Button>
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={handleImageFileChange}
      />
    </>
  );
}
