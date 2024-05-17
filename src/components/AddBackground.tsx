import { useRef } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";

export default function AddBackground() {
  const { saveState, canvas } = useCanvas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setBackgroundImage = (file: File) => {
    if (canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target?.result as string, (img) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width! / img.width!,
            scaleY: canvas.height! / img.height!,
          });
          saveState(canvas);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBackgroundImage(event.target.files[0]);
    }
  };

  return (
    <>
      <button onClick={() => fileInputRef.current?.click()}>
        Set Background Image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
