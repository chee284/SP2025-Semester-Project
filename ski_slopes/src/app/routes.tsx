import { Route, Routes } from "react-router";

import LandingLayout from "../layouts/LandingLayout";
import LandingPage from "./routes/LandingPage";
import About from "./routes/About";
import PageNotFound from "./routes/error/PageNotFound";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LandingLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />


                <Route path="*" element={<PageNotFound />} />
            </Route>
        
        </Routes>
    );
}