import { ModeToggle } from "~/components/ui/custom/mode-toggle";
import type { Route } from "./+types/home";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

  const onSignIn = () => {

    const data = authClient.signIn.email({
      email: 'bayuputraefendi993@gmail.com',
      password: '!Bayu1234',
      callbackURL: `${window.location.origin}/dashboard`
    })
    console.log({ data });

  }

  const onSignUp = () => {
    // Handle sign up logic here
    const data = authClient.signUp.email({
      email: 'bayuputraefendi993@gmail.com',
      password: '!Bayu1234',
      callbackURL: `${window.location.origin}/dashboard`,
      name: 'Bayu Putra Efendi'
    })
    console.log({ data });
  }

  return <>
    <ModeToggle />
    <Button onClick={onSignIn}>Login</Button>
    <Button variant="outline" onClick={onSignUp}>Sign Up</Button>
  </>
}
