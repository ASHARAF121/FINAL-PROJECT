const Reports = () => {
  const stats = [
    { title: "Total Requests", value: 1240 },
    { title: "Completed Services", value: 980 },
    { title: "Active Providers", value: 56 },
    { title: "Client Satisfaction", value: "4.6 ★" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Reports & Analytics
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-lg shadow text-center"
          >
            <h3 className="text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-semibold p-4">
          Provider Performance
        </h2>

        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Provider</th>
              <th className="p-3">Services</th>
              <th className="p-3">Earnings</th>
              <th className="p-3">Rating</th>
            </tr>
          </thead>

          <tbody>
            {[
              {
                name: "Alex Plumber",
                services: 120,
                earnings: "$2,400",
                rating: "4.8",
              },
              {
                name: "Emma Electric",
                services: 98,
                earnings: "$1,950",
                rating: "4.6",
              },
            ].map((row, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.services}</td>
                <td className="p-3">{row.earnings}</td>
                <td className="p-3">{row.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
