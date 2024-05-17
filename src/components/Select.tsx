import { useCanvas } from "@src/context/CanvasContext";

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

  return <button onClick={startSelect}>Select</button>;
}
