import { useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PatientSignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/hooks/use-toast";
import {
  useCreatePatientAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Select from "react-select";

// Define the type for select options
interface OptionType {
  value: string;
  label: string;
}

// Options for Allergies, Conditions, and Medications
const allergyOptions: OptionType[] = [
  { value: "peanuts", label: "Peanuts" },
  { value: "shellfish", label: "Shellfish" },
  { value: "gluten", label: "Gluten" },
  { value: "lactose", label: "Lactose" },
  { value: "pollen", label: "Pollen" },
];

const conditionOptions: OptionType[] = [
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension" },
  { value: "asthma", label: "Asthma" },
  { value: "arthritis", label: "Arthritis" },
  { value: "migraines", label: "Migraines" },
];

const medicationOptions: OptionType[] = [
  { value: "metformin", label: "Metformin" },
  { value: "lisinopril", label: "Lisinopril" },
  { value: "albuterol", label: "Albuterol" },
  { value: "ibuprofen", label: "Ibuprofen" },
  { value: "insulin", label: "Insulin" },
];

const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#121212", // Black background
    color: "#ffffff", // White text
    maxHeight: "150px", // Max height of dropdown
    overflowY: "auto", // Allow scrolling
    zIndex: 9999, // Ensure dropdown is above other elements
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: "#121212", // Black background for the list
    color: "#ffffff", // White text
    padding: 0,
    maxHeight: "100px", // Same height as `menu`
    scrollbarWidth: "thin", // For Firefox, using thin scrollbar
    scrollbarColor: "#555 #222", // For Firefox, using thin scrollbar
    WebkitOverflowScrolling: "touch", // Smooth scrolling on mobile
  }),
  control: (provided: any) => ({
    ...provided,
    minHeight: "40px", // Ensure consistent height for the control
    backgroundColor: "#121212", // Black background for the control
    borderColor: "#444444", // Dark border color
    color: "#ffffff", // White text
    "&:hover": {
      borderColor: "#666666", // Lighter border on hover
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#ffffff", // White text for the selected value
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#888888", // Light gray placeholder text
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#333333" // Dark gray background for selected option
      : state.isFocused
      ? "#444444" // Darker gray when option is focused
      : "#121212", // Default black background
    color: "#ffffff", // White text for options
    "&:hover": {
      backgroundColor: "#444444", // Darker gray when hovered
    },
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999, // Ensure dropdown appears above other content
  }),
};

const PatientSignUpForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createPatientAccount, isPending: isCreatingAccount } =
    useCreatePatientAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  const [selectedAllergies, setSelectedAllergies] = useState<OptionType[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<OptionType[]>(
    []
  );
  const [selectedMedications, setSelectedMedications] = useState<OptionType[]>(
    []
  );

  const formRef = useRef<HTMLFormElement | null>(null); // Ref for the form

  const form = useForm<z.infer<typeof PatientSignupValidation>>({
    resolver: zodResolver(PatientSignupValidation),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientSignupValidation>) {
    const newUser = await createPatientAccount({
      ...values,
      allergies: selectedAllergies.map((item) => item.value),
      conditions: selectedConditions.map((item) => item.value),
      medications: selectedMedications.map((item) => item.value),
    });

    if (!newUser) {
      return toast({
        title: "Sign Up failed, Please try again. Error creating user.",
      });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "Sign Up failed, Please try again. Error signing in.",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Sign Up failed, Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col h-screen">
        <img src="/assets/images/logo.svg" alt="Logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a patient account
        </h2>
        <p className="text-dm-light small-medium md:base-regular mt-2">
          Please enter your details
        </p>

        <div className="form-container w-full max-h-[60vh] overflow-y-auto px-4 py-2 shadow-md custom-scrollbar">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-4"
            ref={formRef}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4">
              <FormLabel>Allergies</FormLabel>
              <Select
                options={allergyOptions}
                isMulti
                value={selectedAllergies}
                onChange={(newValue) =>
                  setSelectedAllergies(newValue as OptionType[])
                }
                styles={customStyles}
                classNamePrefix="select"
                menuPortalTarget={document.body}
              />
            </div>
            <div className="mt-4">
              <FormLabel>Conditions</FormLabel>
              <Select
                options={conditionOptions}
                isMulti
                value={selectedConditions}
                onChange={(newValue) =>
                  setSelectedConditions(newValue as OptionType[])
                }
                styles={customStyles}
                classNamePrefix="select"
                menuPortalTarget={document.body}
              />
            </div>
            <div className="mt-4">
              <FormLabel>Medications</FormLabel>
              <Select
                options={medicationOptions}
                isMulti
                value={selectedMedications}
                onChange={(newValue) =>
                  setSelectedMedications(newValue as OptionType[])
                }
                styles={customStyles}
                classNamePrefix="select"
                menuPortalTarget={document.body}
              />
            </div>

            {/* Add GDPR and User Agreement Checkbox */}
            <FormField
              control={form.control}
              name="gdprAgreement"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mt-4 ml-3">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-gray-300">
                    I agree with the{" "}
                    <Link
                      to="/user-agreement"
                      target="_blank"
                      className="text-dm-accent hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigate("/user-agreement");
                      }}
                    >
                      User Agreement
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/gdpr"
                      target="_blank"
                      className="text-dm-accent hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigate("/gdpr");
                      }}
                    >
                      GDPR Privacy Policy
                    </Link>
                  </FormLabel>
                </FormItem>
              )}
            />
          </form>
        </div>

        <div className="w-full px-4 mt-4">
          <Button
            type="submit"
            className={`bg-dm-dark hover:bg-dm-secondary py-2 px-4${
              !form.watch("gdprAgreement")
                ? "opacity-50 cursor-not-allowed bg-dm-dark"
                : ""
            } w-[200px] ml-[calc(50%-100px)]`}
            disabled={!form.watch("gdprAgreement")}
            onClick={() => {
              form.handleSubmit(onSubmit)(); // Manually trigger the onSubmit function
            }}
          >
            {isCreatingAccount || isSigningIn || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-dm-accent text-small-semibold ml-1 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Form>
  );
};

export default PatientSignUpForm;
