import React, { useState } from "react";
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
import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Select from "react-select";

// Define the type for the skills options
interface SkillOption {
  value: string;
  label: string;
}

const skillOptions: SkillOption[] = [
  { value: "communication", label: "Communication" },
  { value: "teamwork", label: "Teamwork" },
  { value: "PowerPoint", label: "PowerPoint" },
  { value: "Angular", label: "Angular" },
  { value: "C#", label: "C#" },
  { value: "Excel", label: "Excel" },
  { value: "Python", label: "Python" },
  { value: "SQL", label: "SQL" },
  { value: "adaptability", label: "Adaptability" },
  { value: "C++", label: "C++" },
  { value: "LINQ", label: "LINQ" },
];

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  const [selectedSkills, setSelectedSkills] = useState<SkillOption[]>([]); // Correctly type selectedSkills

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount({
      ...values,
      skills: selectedSkills.map((skill) => skill.value),
    });

    if (!newUser) {
      return toast({
        title: "Sign Up failed, Please try again.",
      });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "Sign Up failed, Please try again.",
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
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Please enter your details
        </p>

        <div className="form-container w-full max-h-[80vh] overflow-y-auto px-4 py-2 border rounded-lg shadow-md custom-scrollbar">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-4"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
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
              <FormLabel>Skills</FormLabel>
              <Select
                options={skillOptions}
                isMulti
                value={selectedSkills}
                onChange={(newValue) =>
                  setSelectedSkills(newValue as SkillOption[])
                } // Cast to SkillOption[]
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            <Button type="submit" className="shad-button_primary mt-4">
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
                className="text-primary-500 text-small-semibold ml-1 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default SignupForm;
