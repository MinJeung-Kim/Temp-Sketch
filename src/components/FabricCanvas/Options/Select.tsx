import SelectIcon from "@src/components/ui/icons/SelectIcon";
import { useCanvas } from "@src/context/CanvasContext";
import { S } from "./styles";

export default function Select() {
  const { setMode, canvas } = useCanvas();

  const startSelect = () => {
    if (canvas) {
      setMode("select");
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.renderAll();
    }
  };

  return (
    <S.Button onClick={startSelect}>
      <SelectIcon />
      수정
    </S.Button>
  );
}
