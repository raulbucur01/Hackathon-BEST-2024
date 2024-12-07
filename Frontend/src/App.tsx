import Signup from "./_auth/forms/Signup";
import SigninForm from "./_auth/forms/SigninForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Home, Search, Profile, Settings, Inbox, DoctorDetailsPage} from "./_root/pages";
// later can import more pages with "," so we have one line of code respectively one import from pages
import "./globals.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toast } from "@radix-ui/react-toast";
import DoctorSignUpForm from "./_auth/forms/DoctorSignUpForm";
import { R } from "node_modules/@tanstack/react-query-devtools/build/modern/ReactQueryDevtools-Cn7cKi7o";
import PatientSignUpForm from "./_auth/forms/PatientSignUpForm";

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
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/doctor-details/:doctorId" element={<DoctorDetailsPage />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
