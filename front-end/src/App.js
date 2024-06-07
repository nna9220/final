// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from './components/Home';
import Header from './Header/Header';
import Footer from './components/Footer/Footer';
import Contact from './components/Contact';
import InforTeacher from './components/InforTeacher';
import HomeAdmin from './Pages/Admin/HomeAdmin';
import ManagementStudent from './Pages/Admin/ManagementStudent';
import Profile from './Pages/Admin/Profile';
import HomeStudent from './Pages/Student/HomeStudent';
import ManagementTopic from './Pages/Student/ManagementTopic';
import ProfileST from './Pages/Student/ProfileST';
import RegisterTopicSt from './Pages/Student/RegisterTopicSt';
import HomeHead from './Pages/Head/HomeHead'
import ProfileHe from './Pages/Head/ProfileHe'
import ManageHead from './Pages/Head/ManageHead'
import ManagementLec from './Pages/Admin/ManagementLec';
import ManagementPeriod from './Pages/Admin/ManagementPeriod';
import ManagementYears from './Pages/Admin/ManagementYears';
import HomeLec from './Pages/Teacher/HomeLec';
import ProfileLec from './Pages/Teacher/ProfileLec';
import RegisTopicLec from './Pages/Teacher/RegisTopicLec';
import ManageLec from './Pages/Teacher/ManageLec';
import RegisterHead from './Pages/Head/RegisterHead';
import TopicOfHead from './Pages/Head/TopicOfHead';
import Team from './components/Team';
import Intruction from './components/Intruction';
import ManagementTopics from './Pages/Admin/ManagementTopics';
import ManagementType from './Pages/Admin/ManagementType';
import ManageTopicPB from './Pages/Teacher/ManageTopicPB';
import ManageTopicPBOfHead from './Pages/Head/ManageTopicPBOfHead';
import ManagementAppove from './Pages/Head/ManagementAppove';
import ManagementAssign from './Pages/Head/ManagementAssign';
import ManagementProjects from './Pages/Head/ManagementTopics';
import ManagementTopicBeforePB from './Pages/Head/ManagementTopicBeforePB';
import ManagementTimeApprove from './Pages/Admin/ManagementTimeApprove';
import ManagementTimeRegister from './Pages/Admin/ManagementTimeRegister';
import DefensePanel from './Pages/Head/DefensePanel';
import ManagementCriteria from './Pages/Head/ManagementCriteria';
import ManageCommittee from './Pages/Teacher/ManageCommittee';
import ManagementCommitteOfHead from './Pages/Head/ManagementCommitteOfHead';
import ManagementTopicGraduation from './Pages/Student/ManagementTopicGraduation';
import ManageComplete from './Pages/Teacher/ManageComplete';
import ManagementComplete from './Pages/Head/ManagementComplete';
import ManagementGuest from './Pages/Admin/ManagementGuest';
import ManagementClass from './Pages/Admin/ManagementClass';
import ProtectedRoute from './components/AuthorizationURL/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Outlet />  {/* Outlet sẽ render nơi các con đường con (nested routes) sẽ được hiển thị */}
              <Footer />
            </>
          }
        >
          <Route index element={<Home />} />
          <Route path="/intruction" element={<Intruction />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/info-teacher" element={<Team />} />
          <Route path="/info-teacher/:lecturerId" element={<InforTeacher />} />
        </Route>

        {/* Tách riêng trang Login không hiển thị Header và Footer */}

        <Route path="/homeAdmin" element={<HomeAdmin/>} />
        <Route path="/profileAdmin" element={<Profile/>} />
        <Route path="/managermentStudent" element={<ManagementStudent/>} />
        <Route path="/managermentLec" element={<ManagementLec/>} />
        <Route path="/managermentPeriod" element={<ManagementPeriod />} />
        <Route path="/managermentApproveTime" element={<ManagementTimeApprove />} /> 
        <Route path="/managermentRegisterTime" element={<ManagementTimeRegister />} /> 
        <Route path="/managermentYears" element={<ManagementYears />} />
        <Route path="/managermentClass" element={<ManagementClass />} />
        <Route path='/managermentTopics' element={<ManagementTopics/>}/>
        <Route path='/managermentType' element={<ManagementType/>}/>
        <Route path='/managermentGuest' element={<ManagementGuest/>}/>

        <Route path="/homeStudent" element={<HomeStudent />} />
        <Route path="/managermentTopicStudent" element={<ManagementTopic />} />
        <Route path="/managermentTopicGraduationStudent" element={<ManagementTopicGraduation />} />
        <Route path="/profileStudent" element={<ProfileST />} />
        <Route path="/RegisTopicStudent" element={<RegisterTopicSt />} />

        <Route path="/homeHead" element={<HomeHead />} />
        <Route path="/profileHead" element={<ProfileHe />} />
        <Route path='/registerHead' element={<RegisterHead/>}/>
        <Route path="/managermentHead/approve" element={<ManagementAppove />} />
        <Route path="/managermentHead/approvebefore" element={<ManagementTopicBeforePB/>} />
        <Route path='/managementHead/assign' element={<ManagementAssign/>}/>
        <Route path='/managementHead/criteria' element={<ManagementCriteria/>}/>
        <Route path='/managementHead/topics' element={<ManagementProjects/>}/>
        <Route path="/managermentTopicHead" element={<TopicOfHead />} />
        <Route path="/managermentHead/TopicsPB" element={<ManageTopicPBOfHead />} />
        <Route path="/managermentHead/thesisEvaluation" element={<ManagementCommitteOfHead />} />
        <Route path="/managermentHead/completedTopic" element={<ManagementComplete />} />
        <Route path="/defensepanel" element={<DefensePanel />} />


        <Route path='/homeLecturer' element={<HomeLec/>}/>
        <Route path='/profleLecturer' element={<ProfileLec/>}/>
        <Route path='/registerTopicofLec' element={<RegisTopicLec/>}/>
        <Route path='/managermentTopicLec' element={<ManageLec/>}/>
        <Route path='/managermentTopicPBLec' element={<ManageTopicPB/>}/>
        <Route path='/thesisCommittee' element={<ManageCommittee/>}/>
        <Route path='/completedTopic' element={<ManageComplete/>}/>
      </Routes>
    </>
  );
}
export default App;
