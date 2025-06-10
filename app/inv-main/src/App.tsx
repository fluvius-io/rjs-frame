import { Navigate, RjsApp, Route } from "rjs-frame";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <RjsApp authRequired={true}>
      <Route path="/" element={<Navigate to="/portfolio" replace />} />
      <Route path="/portfolio/*" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </RjsApp>
  );
}

export default App;
