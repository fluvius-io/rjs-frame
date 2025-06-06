import { Navigate, RjsApp, Route } from "rjs-frame";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <RjsApp>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard/*" element={<HomePage />} />
    </RjsApp>
  );
}

export default App;
