import { useRef } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@src/context/CanvasContext";
import { S } from "./styles";
import BackgroundIcon from "@src/components/ui/icons/BackgroundIcon";

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
      <S.Button onClick={() => fileInputRef.current?.click()}>
        <BackgroundIcon />
        배경 추가
      </S.Button>
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
