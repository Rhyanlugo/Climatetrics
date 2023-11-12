import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

function App() {
  const [tempData, setTempData] = useState('');

  useEffect(function () {
    async function expressFetchTest() {
      try {
        const res = await fetch('http://localhost:3000/');
        const data = await res.json();

        console.log(data);
        setTempData(data);
      } catch (err) {
        if (err) {
          console.log(err);
        }
      }
    }

    expressFetchTest();
  }, []);

  // TODO: Finish navbar
  return (
    <div>
      <Navbar />
      <p>{tempData}</p>
    </div>
  );
}

export default App;
