import { GameTypes, Stakes, Location, Session } from "@/lib/interfaces";
import { createClient } from "@/utils/supabase/server";

export const getUserLocations = async (userId: string): Promise<Location[]> => {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase.from("locations").select("location").eq("user_id", userId)
      if (error) {
          console.error("Error fetching locations:", error.message);
          return []
      } else {
          return data
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      return []
    }
}
  
export const getUserStakes = async (userId: string): Promise<Stakes[]> => {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase.from("stakes").select("stake").eq("user_id", userId)
      if (error) {
          console.error("Error fetching stakes:", error.message);
          return []
      } else {
          return data
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      return []
    }
}
  
export const getUserGameTypes = async (userId: string): Promise<GameTypes[]> => {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase.from("game_types").select("game_type").eq("user_id", userId)
      if (error) {
          console.error("Error fetching game types:", error.message);
          return []
      } else {
          return data
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      return []
    }
}

export const getUserSessions = async (userId: string): Promise<Session[]> => {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from("sessions").select("game_type, stake, location, time_played, start_time, end_time, buyin, cashout, net_result").eq("user_id", userId)
        if (error) {
            console.error("Error fetching sessions:", error.message)
        } else {
            return data
        }
    }  catch (err) {
        console.error("Unexpected error:", err);
        return []
    }
    return []
}
