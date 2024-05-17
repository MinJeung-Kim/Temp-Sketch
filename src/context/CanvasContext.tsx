import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fabric } from "fabric";

type State = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  undoHistory: string[];
  setUndoHistory: React.Dispatch<React.SetStateAction<string[]>>;
  redoHistory: string[];
  setRedoHistory: React.Dispatch<React.SetStateAction<string[]>>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  saveState: (canvasInstance: fabric.Canvas) => void;
};

const CanvasContext = createContext<State>({} as State);

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [undoHistory, setUndoHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("black");

  useEffect(() => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current;
      const context = canvasElement.getContext("2d", {
        willReadFrequently: true,
      });
      if (!context) {
        console.error("2D context not available");
        return;
      }

      const canvasInstance = new fabric.Canvas(canvasElement, {
        backgroundColor: "white",
      });
      setCanvas(canvasInstance);

      // Save the initial empty state
      saveState(canvasInstance);

      canvasInstance.perPixelTargetFind = true;
      canvasInstance.targetFindTolerance = 4;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete") {
          const activeObject = canvasInstance.getActiveObject();
          if (activeObject) {
            canvasInstance.remove(activeObject);
            saveState(canvasInstance);
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        canvasInstance.dispose();
      };
    }
  }, []);

  const saveState = (canvasInstance: fabric.Canvas) => {
    const json = JSON.stringify(canvasInstance.toJSON());
    setUndoHistory((prev) => [...prev, json]);
    setRedoHistory([]); // Clear redo history when a new state is saved
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        canvas,
        setCanvas,
        undoHistory,
        setUndoHistory,
        redoHistory,
        setRedoHistory,
        saveState,
        mode,
        setMode,
        selectedColor,
        setSelectedColor,
      }}
    >
      {children}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #ccc" }}
      />
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => useContext(CanvasContext);
