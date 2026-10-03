/* Re-exports the app's own Storybook preview, so the phone-width frame, the accent
 * decorator and the default accent are the same objects the repo renders with. Copying
 * them would let the reference and the app drift without either side noticing. */
export { default } from "../../.storybook/preview";
