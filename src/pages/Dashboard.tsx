
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, ListChecks } from 'lucide-react';

// Mock data - in a real app, this would come from an API
const mockTestData = [
  { id: 1, date: '2024-03-15', score: 85, category: 'Technical' },
  { id: 2, date: '2024-03-10', score: 90, category: 'HR' },
  { id: 3, date: '2024-02-28', score: 78, category: 'Technical' },
  { id: 4, date: '2024-02-15', score: 92, category: 'HR' },
  { id: 5, date: '2024-01-30', score: 88, category: 'Technical' },
];

const performanceData = [
  { date: '2024-01', score: 75 },
  { date: '2024-02', score: 82 },
  { date: '2024-03', score: 88 },
  { date: '2024-04', score: 85 },
  { date: '2024-05', score: 90 },
  { date: '2024-06', score: 92 },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<'weekly' | '6months' | 'yearly'>('6months');

  const calculateStatistics = () => {
    const scores = mockTestData.map(test => test.score);
    return {
      totalTests: mockTestData.length,
      highestScore: Math.max(...scores),
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    };
  };

  const stats = calculateStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <ListChecks className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Total Tests</p>
                <h3 className="text-2xl font-bold">{stats.totalTests}</h3>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Highest Score</p>
                <h3 className="text-2xl font-bold">{stats.highestScore}%</h3>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <h3 className="text-2xl font-bold">{stats.averageScore}%</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Graph */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <div className="mb-4">
              <Button
                variant={timeRange === 'weekly' ? 'default' : 'outline'}
                onClick={() => setTimeRange('weekly')}
                className="mr-2"
              >
                Weekly
              </Button>
              <Button
                variant={timeRange === '6months' ? 'default' : 'outline'}
                onClick={() => setTimeRange('6months')}
                className="mr-2"
              >
                Last 6 Months
              </Button>
              <Button
                variant={timeRange === 'yearly' ? 'default' : 'outline'}
                onClick={() => setTimeRange('yearly')}
              >
                Yearly
              </Button>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Test History */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTestData.map((test) => (
                    <tr key={test.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(test.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{test.category}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">{test.score}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
