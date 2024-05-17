import ClearIcon from "@src/components/ui/icons/ClearIcon";
import { useCanvas } from "@src/context/CanvasContext";
import { S } from "./styles";

export default function Clear() {
  const { saveState, canvas } = useCanvas();

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      saveState(canvas);
    }
  };

  return (
    <S.Button onClick={clearCanvas}>
      <ClearIcon /> 전체 삭제
    </S.Button>
  );
}
