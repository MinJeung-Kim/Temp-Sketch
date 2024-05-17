import { useCanvas } from "@src/context/CanvasContext";

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

  return <button onClick={redo}>Redo</button>;
}
