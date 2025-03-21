import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Application from './pages/Application'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/Appcontext'
import LoginUser from './components/LoginUser'
import Dashboard from './pages/Dashboard'
import AddJobs from './pages/AddJobs'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const {showLogin,showRecruiterLogin,companyToken}=useContext(AppContext);
  return(
    <>
    { showRecruiterLogin && <RecruiterLogin/>}
    { showLogin && <LoginUser/>}
    <ToastContainer position='top-right'/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/apply-job/:id' element={<ApplyJob/>}/>
        <Route path='/application' element={<Application/>}/>
        <Route path='/dashboard' element={<Dashboard/>}>
        {companyToken ? <>
          <Route path='add-job' element={<AddJobs/>}/>
          <Route path='manage-jobs' element={<ManageJobs/>}/>
          <Route path='view-applications' element={<ViewApplications/>}/>
          </> : null
        }
        </Route>
      </Routes>
    </>
  )
}

export default App