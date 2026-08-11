type User = {
  id: number;
  name: string;
  email: string;
};

export default async function HealthCheckPage() {
  // Fetch data on the server
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users: User[] = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Health Check</h1>
      <p className="mb-4 text-green-600 font-semibold">API Status: Connected ✅</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded shadow-sm">
            <h2 className="font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}