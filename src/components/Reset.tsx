import { useCanvas } from "@src/context/CanvasContext";

export default function Reset() {
  const { saveState, canvas } = useCanvas();

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      saveState(canvas);
    }
  };

  return <button onClick={clearCanvas}>Clear Canvas</button>;
}
