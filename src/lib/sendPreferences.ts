import { HOSTNAME } from "../../constants"

export async function sendPreferences(preference: Preference, userId: string) {
  try {
    const response = await fetch(`${HOSTNAME}/api/songs/features?id=${userId}`, {
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