import EraserIcon from "@src/components/ui/icons/EraserIcon";
import { useCanvas } from "@src/context/CanvasContext";
import { S } from "./styles";

export default function Eraser() {
  const { saveState, canvas } = useCanvas();

  const deleteSelectedObject = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        saveState(canvas);
      }
    }
  };

  return (
    <S.Button onClick={deleteSelectedObject}>
      <EraserIcon />
      지우기
    </S.Button>
  );
}
