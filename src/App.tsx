import './styles/App.css';

import { Grid, NavLinks, Socials, Typewriter } from './components';

export default function App() {
  return (
    <main>
      <Grid />
      <div className="center">
        <NavLinks />
        <Typewriter />
        <Socials />
      </div>
    </main>
  );
}
