export default function ProjectHoursGraph () {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Total project hours</h2>
        <div className="h-48 grid grid-cols-14 gap-2">
          {/* Graph bars would be dynamically generated based on data */}
          {Array(14).fill(null).map((_, i) => (
            <div key={i} className="flex flex-col justify-end">
              <div 
                className="bg-blue-100 rounded-t"
                style={{ height: `${Math.random() * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-14 gap-2 mt-2 text-xs text-gray-500">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center">{day}</div>
          ))}
        </div>
      </div>
    )
  }
  