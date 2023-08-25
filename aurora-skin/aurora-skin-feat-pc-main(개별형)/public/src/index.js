import { createRoot } from 'react-dom/client';

import App from './App.jsx';

const app = document.getElementById('app');
const root = createRoot(app);

root.render(<App />);
