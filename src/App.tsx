import './styles/App.css';

import { GridReveal, Socials, Typewriter } from './components';

export default function App() {
  return (
    <main>
      <GridReveal />
      <div className="center">
        <Typewriter />
        <Socials />
      </div>
    </main>
  );
}
