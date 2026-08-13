// `type` splits paid/professional work from campus leadership roles so the
// resume page can list them under separate headings.
const experience = [
  {
    id: 3,
    type: "work",
    role: "Technology Summer Intern",
    organization: "Barclays",
    location: "Pune, India",
    duration: "Jun 2026 – Aug 2026",
    bullets: [
      "Built and extended backend services in Java with Spring Boot, designing and consuming REST APIs against existing enterprise systems.",
      "Developed server-rendered interfaces using Thymeleaf, HTML, CSS, and JavaScript, wiring them to Spring Boot controllers.",
      "Managed builds and dependencies with Maven, and deployed and debugged applications across Linux environments using PuTTY and WinSCP.",
    ],
  },
  {
    id: 1,
    type: "leadership",
    role: "Training & Placement Coordinator",
    organization: "S.P.I.T. Placement Office",
    location: "Mumbai, India",
    duration: "Dec 2023 – Present",
    bullets: [
      "Served as the primary Point of Contact between recruiters and students, managing campus drives and pre-placement sessions and analyzing placement data to identify target companies.",
    ],
  },
  {
    id: 2,
    type: "leadership",
    role: "Head of Marketing & Tournament Admin",
    organization: "S.P.I.T. Sports Committee",
    location: "Mumbai, India",
    duration: "Sep 2023 – Aug 2025",
    bullets: [
      "Led marketing, PR and event operations for large-scale sports events, including a Half Marathon (1,500+ participants) and Spoorthi Sports Fest (5,000+ participants), ensuring seamless execution and strong brand visibility.",
    ],
  },
];

export default experience;
