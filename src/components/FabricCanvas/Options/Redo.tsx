import RedoIcon from "@src/components/ui/icons/RedoIcon";
import { useCanvas } from "@src/context/CanvasContext";
import { S } from "./styles";

export default function Redo() {
  const { canvas, undoHistory, setUndoHistory, redoHistory, setRedoHistory } =
    useCanvas();

  const redo = () => {
    if (canvas && redoHistory.length > 0) {
      const nextState = redoHistory.shift()!;
      setUndoHistory([...undoHistory, nextState]);
      setRedoHistory(redoHistory);
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
      });
    }
  };

  return (
    <S.Button onClick={redo}>
      <RedoIcon />
      재실행
    </S.Button>
  );
}
