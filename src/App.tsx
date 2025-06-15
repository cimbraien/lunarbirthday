import { useState } from 'react';
import { solar2lunar, lunar2solar, type Solar2LunarResult, type Lunar2SolarResult } from 'solarlunar';

type BirthdayResult = {
  age: number;
  gregorian: string;
  lunar: string;
  zodiac: string;
  yearName: string;
};

export default function LunarBirthdayCalculator() {
  const [mode, setMode] = useState<'gregorian' | 'lunar'>('gregorian');

  const [birthdate, setBirthdate] = useState<string>('');
  const [lunarMonth, setLunarMonth] = useState<number>(1);
  const [lunarDay, setLunarDay] = useState<number>(1);
  // const [isLeap, setIsLeap] = useState<boolean>(false);
  const [startYear, setStartYear] = useState<number>(2024);

  const [results, setResults] = useState<BirthdayResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const calculateFromGregorian = (): void => {
    if (!birthdate) return;

    const [year, month, day] = birthdate.split('-').map(Number);
    // const currentYear: number = new Date().getFullYear();
    const endYear = 2050;

    const originalLunar: Solar2LunarResult = solar2lunar(year, month, day);
    const leap = originalLunar.isLeap;
    const lMonth = originalLunar.lMonth;
    const lDay = originalLunar.lDay;

    const list: BirthdayResult[] = [];

    for (let y = year; y <= endYear; y++) {
      try {
        const converted = lunar2solar(y, lMonth, lDay, leap);
        list.push(formatResult(converted, y - year));
      } catch (e) {
        console.warn(`Skipping year ${y} due to error.`, e);
      }
    }

    setResults(list);
    setShowResults(true);
  };

  const calculateFromLunar = (): void => {
    if (!lunarMonth || !lunarDay || !startYear) return;

    const list: BirthdayResult[] = [];

    for (let y = startYear; y <= 2050; y++) {
      try {
        const converted = lunar2solar(y, lunarMonth, lunarDay, false);
        list.push(formatResult(converted, y - startYear));
      } catch (e) {
        console.warn(`Skipping year ${y} due to error.`, e);
      }
    }

    setResults(list);
    setShowResults(true);
  };

  const formatResult = (converted: Lunar2SolarResult, age: number): BirthdayResult => {
    const gregorian = `${converted.cYear}-${String(converted.cMonth).padStart(2, '0')}-${String(converted.cDay).padStart(2, '0')}`;
    const lunar = `${converted.lYear}-${String(converted.lMonth).padStart(2, '0')}-${String(converted.lDay).padStart(2, '0')}`;
    const zodiac = getZodiac(converted.lYear);
    const yearName = `${converted.lYear} (${converted.gzYear}年)`;

    return { age, gregorian, lunar, zodiac, yearName };
  };

  const getZodiac = (year: number): string => {
    const zodiacs: string[] = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    return zodiacs[(year - 4) % 12];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e0f7ff] flex items-center justify-center px-4 py-10">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-3xl border border-white/30">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">🎂 Lunar Birthday Calculator</h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold border transition ${
              mode === 'gregorian'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-indigo-600 border-indigo-300'
            }`}
            onClick={() => setMode('gregorian')}
          >
            Gregorian → Lunar
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold border transition ${
              mode === 'lunar'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-indigo-600 border-indigo-300'
            }`}
            onClick={() => setMode('lunar')}
          >
            Lunar → Gregorian
          </button>
        </div>

        {mode === 'gregorian' ? (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">Your Birthdate (Gregorian)</label>
            <input
              type="date"
              value={birthdate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={calculateFromGregorian}
              disabled={!birthdate}
              className={`mt-2 w-full py-2 rounded-xl font-semibold transition ${
                birthdate
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Calculate Lunar Birthdays
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Lunar Month</label>
              <input
                type="number"
                value={lunarMonth}
                min={1}
                max={12}
                onChange={(e) => setLunarMonth(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Lunar Day</label>
              <input
                type="number"
                value={lunarDay}
                min={1}
                max={30}
                onChange={(e) => setLunarDay(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Start Year</label>
              <input
                type="number"
                value={startYear}
                min={1900}
                max={2050}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-300"
              />
            </div>

            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isLeap}
                onChange={() => setIsLeap(!isLeap)}
                id="leapCheckbox"
              />
              <label htmlFor="leapCheckbox" className="text-gray-700">Leap Month?</label>
            </div> */}

            <button
              onClick={calculateFromLunar}
              className="mt-2 w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Calculate Gregorian Birthdays
            </button>
          </div>
        )}

        {showResults && results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Lunar Birthdays from {results[0].yearName} to {results[results.length - 1].yearName}
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
                  {results.map((item, index) => (
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
              Note: Lunar dates may vary slightly depending on leap months and astronomical calculations.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
