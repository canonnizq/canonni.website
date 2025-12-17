import './styles/App.css';

import { Socials, Subdomains, Typewriter } from './components';

export default function App() {
  return (
    <main>
      <div className="center">
        {/* <Subdomains /> */}
        <Typewriter />
        <Socials />
      </div>
    </main>
  );
}
