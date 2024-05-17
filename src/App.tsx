import "./App.css";
import FabricCanvas from "./components/FabricCanvas/FabricCanvas";
import { CanvasProvider } from "./context/CanvasContext";

function App() {
  return (
    <CanvasProvider>
      <FabricCanvas />
    </CanvasProvider>
  );
}

export default App;
