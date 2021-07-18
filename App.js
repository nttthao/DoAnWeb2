import './App.sass';
import 'antd/dist/antd.css';
import RouterURL from './router/router';
import { BrowserRouter as Router} from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="App">
        <RouterURL></RouterURL>
      </div>
    </Router>
  )
}

export default App;
