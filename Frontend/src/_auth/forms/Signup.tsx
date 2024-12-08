import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold">Join Our Platform</h1>
      <p className="text-lg text-dm-accent mt-2">
        Are you a patient or a doctor?
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to="/sign-up/patient"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-dm-secondary  transition duration-300 ease-in-out"
        >
          Patient Signup
        </Link>
        <Link
          to="/sign-up/doctor"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-dm-secondary  transition duration-300 ease-in-out"
        >
          Doctor Signup
        </Link>
      </div>

      <p className="text-sm text-dm-light text-center mt-4">
        Already have an account?
        <Link
          to="/sign-in"
          className="text-dm-accent text-sm font-semibold ml-1 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
