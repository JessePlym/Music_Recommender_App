import { HOSTNAME } from "../../../constants"

export async function getPreferences(userId: string) {
  try {
    const response = await fetch(`${HOSTNAME}/api/home?id=${userId}`) 
    
    if (response.ok) {
      return await response.json()
    }
  } catch (err) {
    console.log(err)
  }
} 