export function formatLanguageName(languageCode) {
  const languageMap = {
    english: "English",
    french: "French",
    spanish: "Spanish",
    chinese: "Chinese",
    japanese: "Japanese",
    korean: "Korean",
    german: "German",
    italian: "Italian",
    portuguese: "Portuguese",
    russian: "Russian",
    arabic: "Arabic",
    hindi: "Hindi",
    "french-polynesia": "French Polynesian",
    "cook-islands": "Cook Islands",
    maori: "Māori",
    samoan: "Samoan",
    tongan: "Tongan",
    fijian: "Fijian",
    "tok-pisin": "Tok Pisin",
    pidgin: "Pidgin",
    "te-reo-maori": "Te Reo Māori",
    uvean: "Uvean",
    tahitian: "Tahitian",
    rotuman: "Rotuman",
  };

  return (
    languageMap[languageCode.toLowerCase()] ||
    languageCode.charAt(0).toUpperCase() + languageCode.slice(1).toLowerCase()
  );
}

export function formatLanguages(languages) {
  if (!languages) return "";

  let languageArray;
  if (Array.isArray(languages)) {
    languageArray = languages;
  } else if (typeof languages === "string") {
    try {
      const parsed = JSON.parse(languages);
      languageArray = Array.isArray(parsed) ? parsed : [languages];
    } catch {
      languageArray = languages
        .split(",")
        .map((lang) => lang.trim())
        .filter(Boolean);
    }
  } else {
    return "";
  }

  if (languageArray.length === 0) return "";

  const formattedLanguages = languageArray.map((lang) =>
    formatLanguageName(lang)
  );

  if (formattedLanguages.length <= 2) {
    return formattedLanguages.join(" & ");
  }

  return `${formattedLanguages.slice(0, 2).join(" & ")} +${
    formattedLanguages.length - 2
  } more`;
}

export function getBadgeStyles(type) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    neutral: "border-gray-200 bg-gray-50 text-gray-700",
    premium: "border-purple-200 bg-purple-50 text-purple-700",
  };
  return styles[type] || styles.neutral;
}
