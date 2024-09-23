import { HOSTNAME } from "../../constants"

export async function sendPreferences(preference: Preference) {
  try {
    const response = await fetch(`${HOSTNAME}/api/songs/features`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (err) {
    console.log(err)
  }
} 