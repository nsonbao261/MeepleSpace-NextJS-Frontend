"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { FieldShell } from "@/components/auth/field-shell";
import { Button } from "@/components/ui/button";
import { PASSWORD_RULE } from "@/lib/auth-schemas";

/**
 * The password field, and the shared pair, for all three routes that ask for
 * one. Register and reset render the pair; login renders the single field.
 *
 * Both controls share one visibility flag on purpose. A form that hides the
 * first password but shows the second is answering a question nobody asked, and
 * when someone does need to check what they typed they almost always want both.
 */

type PasswordFieldsProps = {
  /**
   * `new` for register and reset, `current` for login. This is the whole reason
   * the two are different components' props rather than two hardcoded fields:
   * the correct `autocomplete` token is a security-relevant difference, not a
   * cosmetic one. Sign-in wants `current-password` so a password manager offers
   * the stored credential instead of offering to save a new one, and — the
   * reason the spec calls it out — so the browser stops offering to *generate*
   * a password on the sign-in form.
   */
  intent: "new" | "current";
  /** `false` at login, where there is nothing to confirm against. */
  confirm?: boolean;
};

/**
 * Not generic over the form values, unlike `FieldShell`. The two field names are
 * fixed strings, and `useFormContext` is an unchecked cast, so a type parameter
 * here would promise a `FieldPath` check that never actually runs. A form that
 * wants the real thing passes it to `FieldShell` directly.
 */
export function PasswordFields({
  intent,
  confirm = true,
}: PasswordFieldsProps) {
  const [visible, setVisible] = React.useState(false);
  const type = visible ? "text" : "password";

  // A factory, not one shared element: the two names have to differ. A page with
  // two buttons both announced as "Show password, button" gives a screen reader
  // user no way to tell which field they are about to reveal, and a button is not
  // a label, so nothing else on the page disambiguates them.
  const toggle = (subject: string) => (
    <Button
      // Not optional in a form. A toggle that submits the page is the single
      // most common bug in this component, and the default for a `<button>`
      // inside a `<form>` is `type="submit"`.
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setVisible((value) => !value)}
      // The accessible name states the action, so a screen reader announces
      // "Show password" while the password is hidden and "Hide password" when it
      // is not. That matches the `ThemeToggle` convention. Deliberately no
      // `aria-pressed`: with a label that already changes, the pressed state
      // restates it and reads as a contradiction.
      aria-label={`${visible ? "Hide" : "Show"} ${subject}`}
    >
      {visible ? <EyeOffIcon /> : <EyeIcon />}
    </Button>
  );

  return (
    <>
      <FieldShell
        name="password"
        label="Password"
        autoComplete={intent === "new" ? "new-password" : "current-password"}
        type={type}
        trailing={toggle("password")}
        // The rule is help text, shown *before* the first failed submit, and
        // only where a password is actually being chosen. On login it would be a
        // lie: `loginSchema` deliberately has no strength check (§5.4), so
        // telling someone at the sign-in form that a password needs eight
        // characters invites them to fix the wrong field.
        description={intent === "new" ? PASSWORD_RULE : undefined}
      />

      {confirm ? (
        <FieldShell
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          type={type}
          trailing={toggle("password confirmation")}
        />
      ) : null}
    </>
  );
}
