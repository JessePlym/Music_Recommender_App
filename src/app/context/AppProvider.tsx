import { ReactNode } from "react";
import AuthProvider from "./AuthProvider";
import TrackProvider from "./TrackProvider";
import PlayerProvider from "./PlayerProvider";

export default function AppProvider({ children }: { children: ReactNode }) {
  
  return (
    <AuthProvider>
      <TrackProvider>
        <PlayerProvider>
          { children }
        </PlayerProvider>
      </TrackProvider>
    </AuthProvider>
  )
}