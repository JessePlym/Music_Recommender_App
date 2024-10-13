export function validatePreferences(songPreference: Preference): boolean {
  const key = songPreference.key
  let validKey = false
  let tempo = songPreference.tempo
  let validTempo = false
  const suggestionCount = songPreference.suggestions
  let validSuggestionCount = false

  if (tempo > 200) {
    songPreference.tempo = 200
    tempo = 200
  } else if (tempo < 0) {
    songPreference.tempo = 0
    tempo = 0
  }

  if (!Number.isNaN(tempo) && tempo >= 0 && tempo <= 200) {
    validTempo = true
  }
  if (!Number.isNaN(key) && key >= -1 && key <= 11) {
    validKey = true
  }
  if (!Number.isNaN(suggestionCount) && suggestionCount >= 1 && suggestionCount <= 10) {
    validSuggestionCount = true
  }

  return validKey && validTempo && validSuggestionCount
}