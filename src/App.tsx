import './styles/App.css';

import { Grid, Socials, Typewriter } from './components';

export default function App() {
  return (
    <main>
      <Grid />
      <div className="center">
        <Typewriter />
        <Socials />
      </div>
    </main>
  );
}
