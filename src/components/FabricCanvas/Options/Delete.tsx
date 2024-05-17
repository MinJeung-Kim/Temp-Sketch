import { useCanvas } from "@src/context/CanvasContext";

export default function Delete() {
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

  return <button onClick={deleteSelectedObject}>Delete Selected Object</button>;
}
