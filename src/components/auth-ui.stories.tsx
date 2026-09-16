import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { withAuth, withRouter } from "../../.storybook/decorators";
import {
  AuthLayout,
  Field,
  FormError,
  PrimaryButton,
  RememberMe,
  SocialButtons,
  TermsNote,
  TrustList,
} from "./auth-ui";

/* Sign-in and sign-up screens are built from these pieces. AuthGate (the route guard that
 * decides whether to show them at all) is logic, not a visual block, so it isn't mapped here.
 * All stories need router context; SocialButtons and the full layout also need the real
 * AuthProvider, same as the app when signed out. */

const meta = {
  title: "App/AuthUI",
  parameters: { layout: "fullscreen" },
  decorators: [withAuth, withRouter("/login")],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignInLayout: Story = {
  render: function SignInLayout() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    return (
      <AuthLayout title="Welcome back" subtitle="Sign in to continue" art="mood">
        <div className="grid gap-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <Field label="Password" type="password" value={password} onChange={setPassword} />
          <RememberMe checked={remember} onChange={setRemember} />
          <PrimaryButton>Sign in</PrimaryButton>
          <SocialButtons onError={() => {}} />
          <TrustList />
        </div>
        <TermsNote />
      </AuthLayout>
    );
  },
};

export const FieldStates: Story = {
  render: function FieldStates() {
    const [value, setValue] = useState("not-an-email");
    return (
      <div className="grid gap-4 p-6">
        <Field
          label="Email"
          type="email"
          value={value}
          onChange={setValue}
          error="Enter a valid email address"
        />
        <Field
          label="Password"
          type="password"
          value=""
          onChange={() => {}}
          hint="At least 8 characters"
        />
      </div>
    );
  },
};

export const Buttons: Story = {
  render: () => (
    <div className="grid gap-3 p-6">
      <PrimaryButton>Continue</PrimaryButton>
      <PrimaryButton busy>Signing in…</PrimaryButton>
      <PrimaryButton disabled>Continue</PrimaryButton>
      <FormError message="Wrong email or password." />
    </div>
  ),
};
