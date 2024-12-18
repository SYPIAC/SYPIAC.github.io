import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const EMOTIONS = [
  'Ire', 'Guilt', 'Greed', 'Paranoia', 'Envy', 'Disgust',
  'Despair', 'Fear', 'Suffering', 'Isolation'
];

const formatDesc = (desc) => {
  // Only split when we find a number at the start of a potential line
  // Lookbehind (?<=^|\s) ensures we're at start or after whitespace
  const lines = desc.split(/(?:^|\s)(?=\d+%)/);
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {line.trim()}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

const PASSIVES_DATA = [
  {
    name: "Beef",
    desc: "+25 to Strength",
    emotions: ["Fear", "Disgust", "Fear"]
  },
  {
    name: "Proficiency",
    desc: "+25 to Dexterity",
    emotions: ["Fear", "Guilt", "Paranoia"]
  },
  {
    name: "Ingenuity",
    desc: "+25 to Intelligence",
    emotions: ["Ire", "Isolation", "Suffering"]
  },
  {
    name: "Polymathy",
    desc: "10% increased Attributes",
    emotions: ["Isolation", "Suffering", "Paranoia"]
  },
  {
    name: "Jack of all Trades",
    desc: "2% increased Damage per 5 of your lowest Attribute",
    emotions: ["Greed", "Fear", "Envy"]
  },
  {
    name: "One with the River",
    desc: "30% increased Defences while wielding a Staff\n30% increased Stun Buildup with Quarterstaves\n30% increased Daze Buildup with Quarterstaves\n30% increased Freeze Buildup with Quarterstaves",
    emotions: ["Guilt", "Paranoia", "Isolation"]
  },
  {
    name: "Whirling Assault",
    desc: "8% increased Attack Speed with Quarterstaves\nKnocks Back Enemies if you get a Critical Hit with a Quarterstaff",
    emotions: ["Envy", "Disgust", "Greed"]
  },
  {
    name: "One with the Storm",
    desc: "Quarterstaff Skills that consume Power Charges count as consuming an additional Power Charge",
    emotions: ["Isolation", "Suffering", "Disgust"]
  },
  {
    name: "Martial Artistry",
    desc: "25% increased Accuracy Rating with Quarterstaves\n25% increased Critical Damage Bonus with Quarterstaves\n+25 to Dexterity",
    emotions: ["Isolation", "Ire", "Fear"]
  },
  {
    name: "Silent Shiv",
    desc: "5% increased Attack Speed with Daggers\n15% increased Critical Hit Chance with Daggers",
    emotions: ["Suffering", "Greed", "Despair"]
  },
  {
    name: "Coated Knife",
    desc: "Critical Hits with Daggers have a 25% chance to Poison the Enemy",
    emotions: ["Ire", "Despair", "Suffering"]
  },
  {
    name: "Backstabbing",
    desc: "25% increased Critical Damage Bonus with Daggers",
    emotions: ["Envy", "Ire", "Isolation"]
  }
];

const PassivesCalculator = () => {
  const DEFAULT_PRICES = {
    'Ire': '1/16',
    'Guilt': '1/4.5',
    'Greed': '1/2.1',
    'Paranoia': '1/1.33',
    'Envy': '3',
    'Disgust': '8.5',
    'Despair': '17',
    'Fear': '44',
    'Suffering': '110',
    'Isolation': '322'
  };
  
  const [prices, setPrices] = useState(DEFAULT_PRICES);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortedPassives, setSortedPassives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const calculateCost = (emotions) => {
    return emotions.reduce((total, emotion) => {
      const price = parseFraction(prices[emotion]);
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const parseFraction = (input) => {
    if (!input) return NaN;
    const parts = input.trim().split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
    return parseFloat(input);
  };

  useEffect(() => {
    let filtered = PASSIVES_DATA.filter(passive =>
      passive.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passive.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passive.emotions.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered = filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortField === 'cost') {
        aVal = calculateCost(a.emotions);
        bVal = calculateCost(b.emotions);
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    setSortedPassives(filtered);
  }, [prices, sortField, sortDirection, searchTerm]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetToDefault = () => {
    setPrices(DEFAULT_PRICES);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>PoE2 Passive Calculator</span>
          <button 
            onClick={resetToDefault}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Reset Prices
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="grid grid-cols-5 gap-4 mb-4">
            {EMOTIONS.map(emotion => (
              <div key={emotion}>
                <label className="block text-sm font-medium mb-1">{emotion}</label>
                <Input
                  type="text"
                  pattern="[0-9./]*"
                  inputMode="text"
                  value={prices[emotion]}
                  onChange={(e) => setPrices(prev => ({ ...prev, [emotion]: e.target.value }))}
                  placeholder="e.g. 1/7"
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search passives..."
            className="w-full mb-4"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left cursor-pointer" onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 border text-left cursor-pointer" onClick={() => handleSort('desc')}>
                  Description {sortField === 'desc' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 border text-left">Emotions</th>
                <th className="p-2 border text-left cursor-pointer" onClick={() => handleSort('cost')}>
                  Cost {sortField === 'cost' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPassives.map((passive, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{passive.name}</td>
                  <td className="p-2 border">{formatDesc(passive.desc)}</td>
                  <td className="p-2 border">{passive.emotions.join(', ')}</td>
                  <td className="p-2 border">{calculateCost(passive.emotions).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassivesCalculator;