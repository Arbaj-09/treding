import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { CustomerProvider } from './hooks/useCustomers.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <CustomerProvider>
        <AppRoutes />
      </CustomerProvider>
    </BrowserRouter>
  );
}
