import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { InicioScreen } from './screens/InicioScreen';
import { FaixasEtariasScreen } from './screens/FaixasEtariasScreen';
import { SituacoesScreen } from './screens/SituacoesScreen';
import { MuralScreen } from './screens/MuralScreen';
import { PremiosScreen } from './screens/PremiosScreen';
import { FrasesScreen } from './screens/FrasesScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<InicioScreen />} />
          <Route path="/faixas-etarias" element={<FaixasEtariasScreen />} />
          <Route path="/situacoes" element={<SituacoesScreen />} />
          <Route path="/mural" element={<MuralScreen />} />
          <Route path="/premios" element={<PremiosScreen />} />
          <Route path="/frases" element={<FrasesScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
