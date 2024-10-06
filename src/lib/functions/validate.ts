export function validatePreferences(songPreference: Preference): boolean {
  const key = songPreference.key
  let validKey = false
  const tempo = songPreference.tempo
  let validTempo = false

  if (!Number.isNaN(tempo) && tempo >= 0 && tempo <= 200) {
    validTempo = true
  }
  if (!Number.isNaN(key) && key >= -1 && key <= 11) {
    validKey = true
  }

  if (validKey && validTempo) {
    return true
  } else {
    return false
  }
}