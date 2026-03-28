import Navbar from '@/components/Navbar'
import { LocationPage } from '../../features/location/LocationPage'

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <LocationPage />
    </div>
  )
}
