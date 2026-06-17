import { AppLayout } from "@/components/AppLayout";
import { SectionHeader } from "@/components/ui-kit";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: api.getAnalytics,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!analytics) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </AppLayout>
    );
  }

  // Transform data for charts
  const skillData = Object.entries(analytics.skill_distribution || {}).map(([skill, count]) => ({
    name: skill,
    value: count,
  })).slice(0, 10);

  const experienceData = Object.entries(analytics.experience_levels || {}).map(([level, count]) => ({
    name: level,
    value: count,
  }));

  const locationData = Object.entries(analytics.location_distribution || {}).map(([location, count]) => ({
    name: location,
    value: count,
  })).slice(0, 8);

  const educationData = Object.entries(analytics.education_levels || {}).map(([level, count]) => ({
    name: level,
    value: count,
  }));

  return (
    <AppLayout>
      <SectionHeader
        title="Analytics Dashboard"
        description="Insights from candidate data"
      />

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Skills Distribution */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Top Skills Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Experience Levels */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Experience Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={experienceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {experienceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Location Distribution */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Location Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#888" />
              <YAxis dataKey="name" type="category" stroke="#888" width={100} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Education Levels */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Education Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={educationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {educationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}

// Made with Bob
