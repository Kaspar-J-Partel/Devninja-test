import './App.css'
// @ts-ignore
import {CartPage, HistoryPage, HomePage} from "./pages";
import {NavBar} from "./components";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <NavBar/>

                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="cart" element={<CartPage/>}/>
                    <Route path="history" element={<HistoryPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
