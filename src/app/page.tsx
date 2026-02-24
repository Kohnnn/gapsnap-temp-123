import DashboardClient from '@/components/DashboardClient';

export const metadata = {
  title: 'GapSnap | Quantitative Analysis Terminal',
  description: 'Systematic prediction market analysis and real-time arbitrage detection platform.',
};

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <DashboardClient />
    </div>
  );
}
