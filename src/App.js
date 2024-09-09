import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Customer/Homepage";
import "./App.css";
import { Box } from "@mui/material";
import Sidebar from "./pages/Admin/Sidebar";
import { NotificationPage } from "./pages/Customer/NotificationPage"
import {CustomerServicesPage} from "./pages/Customer/CustomerServicesPage"

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin" element={<Sidebar />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/services" element={<CustomerServicesPage/>} />
      </Routes>
    </Box>
  );
}


export default App;
