import { Navigate, RjsApp, Route } from "rjs-frame";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <RjsApp authRequired={true}>
      <Route path="/" element={<Navigate to="/portfolio" replace />} />
      <Route path="/portfolio/*" element={<HomePage />} />
    </RjsApp>
  );
}

export default App;
