// returns what the text area should start like depending on the language
import languages from "@/components/ideComponents/languages";

export default function handler(req, res) {
  if (req.method === "GET") {
    let { language } = req.query;

    if (!language) {
      return res.status(400).json({ error: "Missing language" });
    }

    if (languages[language]) {
      return res.status(200).json({ starterCode: languages[language].starter });
    }

    return res.status(400).json({ error: "Language isn't supported" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
