import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [propsData, setPropsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://bolt-back.onrender.com/board');
      const filtered = res.data.filter(prop => {
        const valueScore = (prop.hs_line * 0.65 + prop.kpr * 0.35) - prop.salary;
        return prop.salary <= 15 && valueScore >= 12.5;
      });
      setPropsData(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">⚡ Bolt Prop Board</h1>
      {loading ? <p>Loading...</p> : (
        <table className="w-full border border-yellow-400">
          <thead>
            <tr>
              <th className="p-2 border-b border-yellow-400">Player</th>
              <th className="p-2 border-b border-yellow-400">Kill Line</th>
              <th className="p-2 border-b border-yellow-400">HS Line</th>
              <th className="p-2 border-b border-yellow-400">Salary</th>
              <th className="p-2 border-b border-yellow-400">Value Score</th>
            </tr>
          </thead>
          <tbody>
            {propsData.map((prop, i) => {
              const valueScore = (prop.hs_line * 0.65 + prop.kpr * 0.35) - prop.salary;
              return (
                <tr key={i} className="hover:bg-yellow-500 hover:text-black transition">
                  <td className="p-2">{prop.player}</td>
                  <td className="p-2">{prop.kill_line}</td>
                  <td className="p-2">{prop.hs_line}</td>
                  <td className="p-2">{prop.salary}</td>
                  <td className="p-2">{valueScore.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
