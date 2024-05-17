import UndoIcon from "@src/components/ui/icons/UndoIcon";
import { useCanvas } from "@src/context/CanvasContext";
import { S } from "./styles";

export default function Undo() {
  const { canvas, undoHistory, setUndoHistory, redoHistory, setRedoHistory } =
    useCanvas();

  const undo = () => {
    if (canvas && undoHistory.length > 1) {
      const newRedoHistory = [undoHistory.pop()!, ...redoHistory];
      setRedoHistory(newRedoHistory);
      const previousState = undoHistory[undoHistory.length - 1];
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        setUndoHistory([...undoHistory]);
      });
    }
  };

  return (
    <S.Button onClick={undo}>
      <UndoIcon />
      실행취소
    </S.Button>
  );
}
