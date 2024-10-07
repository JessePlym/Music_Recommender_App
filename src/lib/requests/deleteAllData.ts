import { HOSTNAME } from "../../../constants";

export async function deleteUserData(userId: string) {

  let message: string = ""

  try {
    const response = await fetch(`${HOSTNAME}/api/home?id=${userId}`, {
      method: "DELETE"
    })

    if (response.ok) {
      message = "User data deleted successfully"
    } else {
      message = "Something went wrong while deleting user data"
    }
  } catch (err) {
    message = "Could not delete data"
    console.log(message)
  } finally {
    return message
  }
}