import { useState } from 'react';
import { solar2lunar, lunar2solar, type Solar2LunarResult } from 'solarlunar';

type BirthdayResult = {
  age: number;
  gregorian: string;
  lunar: string;
  zodiac: string;
  yearName: string;
};

export default function LunarBirthdayCalculator() {
  const [birthdate, setBirthdate] = useState<string>('');
  const [results, setResults] = useState<BirthdayResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculateLunarBirthdays = (): void => {
    if (!birthdate) return;
    
    const [year, month, day] = birthdate.split('-').map(Number);
    const currentYear: number = new Date().getFullYear();
    const endYear: number = currentYear + 5;
    const birthYear: number = year;
    
    const lunarBirthdays: BirthdayResult[] = [];
    
    const originalLunar: Solar2LunarResult = solar2lunar(birthYear, month, day);
    const isLeapMonth: boolean = originalLunar.isLeap;
    
    for (let y: number = birthYear; y <= endYear; y++) {
      try {
        const solarDate = lunar2solar(
          y, 
          originalLunar.lMonth, 
          originalLunar.lDay,
          isLeapMonth
        );
        
        const gregorianDate: string = `${solarDate.cYear}-${String(solarDate.cMonth).padStart(2, '0')}-${String(solarDate.cDay).padStart(2, '0')}`;
        const lunarDate: string = `${solarDate.lYear}-${String(solarDate.lMonth).padStart(2, '0')}-${String(solarDate.lDay).padStart(2, '0')}`;
        
        lunarBirthdays.push({
          age: y - birthYear,
          gregorian: gregorianDate,
          lunar: lunarDate,
          zodiac: getZodiac(solarDate.lYear),
          yearName: `${solarDate.lYear} (${solarDate.gzYear}年)`
        });
      } catch (e) {
        console.error(`Couldn't calculate for year ${y}`, e);
      }
    }
    
    setResults(lunarBirthdays);
    setShowResults(true);
  };

  const getZodiac = (year: number): string => {
    const zodiacs: string[] = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    return zodiacs[(year - 4) % 12];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setBirthdate(e.target.value);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e0f7ff] flex items-center justify-center px-4 py-10">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-3xl border border-white/30">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          🎂 Lunar Birthday Calculator
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Birthdate (Gregorian)</label>
            <input
              type="date"
              value={birthdate}
              max={new Date().toISOString().split('T')[0]}
              onChange={handleDateChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <button
              onClick={calculateLunarBirthdays}
              disabled={!birthdate}
              className={`mt-3 w-full py-2 rounded-xl font-semibold transition ${
                birthdate 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Calculate Lunar Birthdays
            </button>
          </div>

          {showResults && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Lunar Birthdays from {results[0].yearName} to {results[results.length - 1].yearName}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-indigo-100">
                    <tr>
                      <th className="py-2 px-4 text-left">Age</th>
                      <th className="py-2 px-4 text-left">Gregorian Date</th>
                      <th className="py-2 px-4 text-left">Lunar Date</th>
                      <th className="py-2 px-4 text-left">Zodiac</th>
                      <th className="py-2 px-4 text-left">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((item: BirthdayResult, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-4">{item.age}</td>
                        <td className="py-2 px-4">{item.gregorian}</td>
                        <td className="py-2 px-4">{item.lunar}</td>
                        <td className="py-2 px-4">{item.zodiac}</td>
                        <td className="py-2 px-4">{item.yearName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Note: Lunar dates may vary slightly depending on leap months and astronomical calculations.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}