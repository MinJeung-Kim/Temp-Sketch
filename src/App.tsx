import "./App.css";
import Sketch from "./components/Sketch/Sketch";
import { CanvasProvider } from "./context/CanvasContext";

function App() {
  return (
    <CanvasProvider>
      <Sketch />
    </CanvasProvider>
  );
}

export default App;
