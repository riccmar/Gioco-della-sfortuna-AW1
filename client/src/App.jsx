import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from 'react-router'

import DefaultLayout from "./components/DefaultLayout";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route element={ <DefaultLayout /> }>
        <Route path='/' element={ <Home /> }/>

        <Route path='/login'/>

        <Route path='*'/> {/* TODO: 404 Not Found */}
      </Route>
    </Routes>
  )
}

export default App