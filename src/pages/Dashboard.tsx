
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ListChecks, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Mock data - to be replaced with real API data
const mockTestData = [
  { id: 1, date: '2024-03-15', hrScore: 85, technicalScore: 82, category: 'Technical' },
  { id: 2, date: '2024-03-10', hrScore: 90, technicalScore: 88, category: 'HR' },
  { id: 3, date: '2024-02-28', hrScore: 78, technicalScore: 80, category: 'Technical' },
  { id: 4, date: '2024-02-15', hrScore: 92, technicalScore: 90, category: 'HR' },
  { id: 5, date: '2024-01-30', hrScore: 88, technicalScore: 85, category: 'Technical' },
];

const performanceData = [
  { date: '2024-01', hrScore: 75, technicalScore: 78 },
  { date: '2024-02', hrScore: 82, technicalScore: 80 },
  { date: '2024-03', hrScore: 88, technicalScore: 85 },
  { date: '2024-04', hrScore: 85, technicalScore: 88 },
  { date: '2024-05', hrScore: 90, technicalScore: 92 },
  { date: '2024-06', hrScore: 92, technicalScore: 90 },
];

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | '6months' | 'yearly'>('6months');

  const calculateStatistics = () => {
    const hrScores = mockTestData.map(test => test.hrScore);
    const technicalScores = mockTestData.map(test => test.technicalScore);
    const allScores = [...hrScores, ...technicalScores];

    return {
      totalTests: mockTestData.length,
      highestScore: Math.max(...allScores),
      averageScore: Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length),
    };
  };

  const stats = calculateStatistics();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Performance Dashboard</h1>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highestScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Graph */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <div className="flex space-x-2 mt-4">
            <Button
              variant={timeRange === 'weekly' ? 'default' : 'outline'}
              onClick={() => setTimeRange('weekly')}
              size="sm"
            >
              Weekly
            </Button>
            <Button
              variant={timeRange === '6months' ? 'default' : 'outline'}
              onClick={() => setTimeRange('6months')}
              size="sm"
            >
              Last 6 Months
            </Button>
            <Button
              variant={timeRange === 'yearly' ? 'default' : 'outline'}
              onClick={() => setTimeRange('yearly')}
              size="sm"
            >
              Yearly
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-sm" />
                <YAxis domain={[0, 100]} className="text-sm" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hrScore"
                  stroke="#2563eb"
                  name="HR Score"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="technicalScore"
                  stroke="#7c3aed"
                  name="Technical Score"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Test History */}
      <Card>
        <CardHeader>
          <CardTitle>Test History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">HR Score</th>
                  <th className="px-6 py-3">Technical Score</th>
                </tr>
              </thead>
              <tbody>
                {mockTestData.map((test) => (
                  <tr key={test.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4">
                      {format(new Date(test.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">{test.category}</td>
                    <td className="px-6 py-4">{test.hrScore}%</td>
                    <td className="px-6 py-4">{test.technicalScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
