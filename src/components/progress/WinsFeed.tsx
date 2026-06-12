export function WinsFeed() {
  // In a real implementation, this would fetch recent achievements
  const wins = [
    { title: 'Completed Project Proposal', date: 'Today' },
    { title: 'Focus Session: Deep Work', date: 'Yesterday' },
    { title: 'Fixed all lint errors', date: '2 days ago' },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Wins</h3>
      <div className="space-y-4">
        {wins.map((win, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-900">{win.title}</span>
            <span className="text-sm text-gray-500">{win.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
