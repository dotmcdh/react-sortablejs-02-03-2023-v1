import "./App.css";
import Sortable from "./components/Sortable";
import SortableStep from "./components/SortableNested";
function App() {
  return (
    <>
      <Sortable />
      <div className="pt-3 pb-3 border-b-2 border-black" />
      <div className="pt-3" />
      <SortableStep />
    </>
  );
}

export default App;
