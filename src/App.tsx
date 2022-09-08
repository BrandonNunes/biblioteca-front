import './App.css';
// import "primereact/resources/themes/luna-blue/theme.css";  //theme
import "primereact/resources/themes/rhea/theme.css"
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

import Router from '../src/routes'
function App() {

  return (
      <div className="app" >
        <Router />
      </div>
  )
}

export default App
