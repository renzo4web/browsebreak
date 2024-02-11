const phrases = [
  {
    title: "Time for a Mini-Mindbreak!",
    subtitle:
      "Let's take a quick pause to recharge and come back feeling fresh."
  },
  {
    title: "Just a Gentle Reminder...",
    subtitle:
      "You've been conquering this website for a while. How about a short break?"
  },
  {
    title: "Feeling Stuck? Let's Refresh!",
    subtitle: "Sometimes a quick break can help you see things with new eyes."
  }
]

export default function getRandomPhrase() {
  return phrases[Math.floor(Math.random() * phrases.length)]
}
