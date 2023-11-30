import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/login/Login"
import Home from "./components/home/Home"
import Post from "./components/post/Post"
// import SignUp from "./components/signUp/SignUp"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/post" element={<Post/>}/>
        {/* <Route path="/sign-up" element={<SignUp/>}/> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
