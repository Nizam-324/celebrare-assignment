import "./App.css";
import CanvasEditor from "./components/CanvasEditor/CanvasEditor";

function App() {

    const header = (
        <div className="header">
            <h1>Canva<span>X</span></h1>
            <p>Celebrare Assignment</p>
        </div>
    )

    return (
        <div className="App">
            {header}
            <CanvasEditor />
            <div className="grid-background">

            </div>
        </div>
    );
}

export default App;
