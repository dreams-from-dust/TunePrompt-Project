// app/index.tsx
import IntroScreen from "./intro";

export default function RootIndex() {
  // By rendering the IntroScreen directly, the app will 
  // always display the intro sequence on every startup.
  return <IntroScreen />;
}