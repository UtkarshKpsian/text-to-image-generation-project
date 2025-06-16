import viteLogo from '/favicon.svg'
import './index.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./Pages/Home"
import Result from "./Pages/Result"
import Bycredit from './Pages/Bycredit'
import Footer from './component/Footer'
import Login from './component/Login'
import { useContext } from 'react'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import Navbar from './component/Navbar'

function App() {
  const {showLogin} = useContext(AppContext)
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to to-pink-50'>
      <ToastContainer/>
      <Navbar/>
      {showLogin && <Login/> } 
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/result' element={<Result/>}/>
        <Route path='/buy' element={<Bycredit/>}/>
      </Routes>
      <Footer/>
    </div>

  )
}

export default App
