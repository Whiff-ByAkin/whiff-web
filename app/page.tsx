import { HomeScreen } from "./components/home-screen";

/* The home page is that screen with the explorer on its first role. How the
 * screen is built lives in HomeScreen, because /roles/[role] renders the same
 * one opened on a different tab — a shared object, not a copy. */
export default function Home() {
  return <HomeScreen />;
}
