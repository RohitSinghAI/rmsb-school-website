'use client'
import Link from 'next/link'


export default function Students(){
const [students, setStudents] = useState([])
const [loading, setLoading] = useState(true)


useEffect(() => {
let mounted = true
fetch('/api/students').then(r => r.json()).then(data => { if (mounted) setStudents(data) }).catch(()=>{}).finally(()=>mounted && setLoading(false))
return () => mounted = false
}, [])


return (
<div>
<div className="flex items-center justify-between mb-4">
<h2 className="text-xl font-semibold">Students</h2>
<Link href="/students/add" className="btn bg-indigo-600 text-white">Add Student</Link>
</div>


<div className="bg-white rounded shadow overflow-auto">
<table className="min-w-full">
<thead className="bg-gray-50">
<tr>
<th className="p-3 text-left">#</th>
<th className="p-3 text-left">Name</th>
<th className="p-3 text-left">Class</th>
<th className="p-3 text-left">Roll</th>
<th className="p-3 text-left">Actions</th>
</tr>
</thead>
<tbody>
{loading ? (
<tr><td colSpan={5} className="p-4">Loading...</td></tr>
) : students.length === 0 ? (
<tr><td colSpan={5} className="p-4">No students found.</td></tr>
) : students.map((s, i) => (
<tr key={s._id} className="border-t">
<td className="p-3">{i+1}</td>
<td className="p-3">{s.name}</td>
<td className="p-3">{s.className || '-'}</td>
<td className="p-3">{s.rollNumber || '-'}</td>
<td className="p-3">
<Link href={`/students/${s._id}/edit`} className="btn border px-2 py-1 mr-2">Edit</Link>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)
}