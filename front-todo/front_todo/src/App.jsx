import './App.css'
import {  Route, Routes } from "react-router-dom"
import RegistrationForm from './components/RegistrationForm'

import TaskList from './components/TaskList'
import Login from './components/Login'
function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<TaskList/>} />
        <Route path="/reg" element={<RegistrationForm />} />
        <Route path='/login' element= {<Login/>}/>
      </Routes>
    </div>
  )
}

export default App
