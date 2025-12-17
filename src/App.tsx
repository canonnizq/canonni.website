import './styles/App.css';

import { Socials, Typewriter } from './components';

export default function App() {
  return (
    <main>
      <div className="center">
        <Typewriter />
        <Socials />
      </div>
    </main>
  );
}
