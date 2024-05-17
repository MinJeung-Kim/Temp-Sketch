import { useCanvas } from "@src/context/CanvasContext";

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

  return <button onClick={undo}>Undo</button>;
}
