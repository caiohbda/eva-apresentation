import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NewEmployee from './pages/NewEmployee'
import NewJourney from './pages/NewJourney'
import JourneyDetails from './pages/JourneyDetails'
import EmployeeDetails from './pages/EmployeeDetails'
import AssociateJourney from './pages/AssociateJourney'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees/new" element={<NewEmployee />} />
          <Route path="/journeys/new" element={<NewJourney />} />
          <Route path="/employee/:id" element={<EmployeeDetails />} />
          <Route path="/journey/:id" element={<JourneyDetails />} />
          <Route path="/associate" element={<AssociateJourney />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
