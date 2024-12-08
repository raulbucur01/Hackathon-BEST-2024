import Signup from "./_auth/forms/Signup";
import SigninForm from "./_auth/forms/SigninForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import {
  Home,
  Search,
  Profile,
  Settings,
  Inbox,
  DoctorDetailsPage,
  GdprPage,
  UserAgreement,
  AIChatHistory,
} from "./_root/pages";
// later can import more pages with "," so we have one line of code respectively one import from pages
import "./globals.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import DoctorSignUpForm from "./_auth/forms/DoctorSignUpForm";
import PatientSignUpForm from "./_auth/forms/PatientSignUpForm";
import AppointmentsPage from "./_root/pages/AppointmentsPage";
import HealthAssistant from "./_root/pages/HealthAssistant";
import VideoRoom from "./_root/pages/VideoRoom";
import { useLocation } from "react-router-dom";


const VideoRoomWrapper = () => {
  const location = useLocation();
  const { token, roomName } = location.state || {}; // Destructure token and roomName from state

  if (!token || !roomName) {
    return <div>Error: Missing token or room name.</div>;
  }

  return <VideoRoom token={token} roomName={roomName} />;
}
const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-up/doctor" element={<DoctorSignUpForm />} />
          <Route path="/sign-up/patient" element={<PatientSignUpForm />} />
          <Route path="/gdpr" element={<GdprPage />} />
          <Route path="/user-agreement" element={<UserAgreement />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route
            path="/doctor-details/:doctorId"
            element={<DoctorDetailsPage />}
          />

          <Route path="/health-assistant" element={<HealthAssistant />} />
          <Route
  path="/video-room"
  element={
    <VideoRoomWrapper />
  }
/>;
          <Route path="/ai-chat-history" element={<AIChatHistory />} />
        </Route>
        
      </Routes>

      <Toaster />
      
    </main>
  );
};

export default App;
