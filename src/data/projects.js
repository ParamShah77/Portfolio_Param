const projects = [
  {
    id: 6,
    name: "FOLIUM",
    subtitle: "Explainable Causal Intelligence for Behavioural Bias in Investing",
    date: "Feb 2026 – Oct 2026",
    description:
      "Detects behavioural bias at the moment an investor decides to sell. XGBoost with SHAP attributions and DoWhy causal inference quantify what drives each decision, a Monte Carlo simulator projects HOLD vs SELL wealth, and a bilingual explainable-AI layer sits on a tamper-evident audit trail.",
    tech: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "XGBoost",
      "SHAP",
      "DoWhy",
      "React",
      "TypeScript",
    ],
    github: "https://github.com/ParamShah77/Folium",
    deployed: false,
    deployedUrl: "",
    image: "https://placehold.co/600x400/1a1a1a/f97316?text=FOLIUM",
    bullets: [
      "Developed the full-stack platform with FastAPI, PostgreSQL (Row-Level Security), Redis, and React + TypeScript, with JWT/OAuth2 auth, live SSE progress, and 630+ tests.",
      "Engineered a causal, decision-time behavioral bias detection engine using XGBoost (87.9% accuracy, 0.84 Macro F1) with per-prediction SHAP attributions, and DoWhy causal inference to quantify how much each bias drives a sell decision.",
      "Built a personalized Monte Carlo simulator (NumPy/pandas, real NIFTY and gold history) projecting HOLD vs SELL after-tax wealth over up to 30 years, with P10/P50/P90 uncertainty bands.",
      "Designed an Explainable AI layer with bilingual (English/Hindi) Jinja2 explanations and a SHA-256 hash-chained audit trail that makes every analysis verifiable and tamper-evident."
    ]
  },
  {
    id: 7,
    name: "ARCHON",
    subtitle: "AI Engineering Intelligence Platform",
    date: "Sep 2026 – Oct 2026",
    description:
      "Turns a codebase into a navigable, queryable graph. tree-sitter parses 6 languages into a cross-file code graph that powers cited codebase chat, security and tech-debt analyzers, 13 AI debugging and review tools, and an interactive Next.js code map.",
    tech: [
      "Python",
      "FastAPI",
      "tree-sitter",
      "PostgreSQL",
      "SQLite",
      "Next.js",
      "TypeScript",
      "Gemini API",
      "Groq API",
      "Docker",
    ],
    github: "https://github.com/ParamShah77/ArchonAI",
    deployed: false,
    deployedUrl: "",
    image: "https://placehold.co/600x400/1a1a1a/f97316?text=ARCHON",
    bullets: [
      "Built a FastAPI backend using tree-sitter to parse 6 languages (Python, JS/TS, Go, Java, SQL, Prisma) into a cross-file code graph of imports, calls and inheritance, stored in SQLite/PostgreSQL.",
      "Implemented codebase chat with hybrid BM25 + Gemini embedding retrieval and cited answers, backed by a provider-agnostic LLM layer with automatic Gemini/Groq fallback to handle free-tier rate limits.",
      "Developed security, performance and tech-debt analyzers on a shared Finding model, plus 13 AI tools for root-cause debugging, change-impact scoring, test generation and diff code review.",
      "Created an interactive Next.js + TypeScript code map using Canvas2D, d3-zoom and Web Workers for smooth rendering of large graphs; containerized with Docker Compose and covered by a 35-test pytest suite."
    ]
  },
  {
    id: 1,
    name: "CareerPath360.AI",
    date: "Aug 2025 – Dec 2025",
    description:
      "A full-stack AI-powered career platform featuring ML-based resume parsing, ATS scoring, and intelligent job matching. Integrated BERT-based NLP for semantic similarity, XGBoost for scoring, and Google Gemini API for career guidance.",
    tech: [
      "React.js",
      "Tailwind",
      "Node.js",
      "MongoDB",
      "Python",
      "FastAPI",
      "NLP",
      "BERT",
      "XGBoost",
      "Gemini API",
      "REST APIs",
    ],
    github: "https://github.com/ParamShah77/CareerPath360",
    deployed: true,
    deployedUrl: "https://careerpath360.onrender.com/",
    image: "https://placehold.co/600x400/1a1a1a/f97316?text=CareerPath360.AI",
    bullets: [
      "Built the Node.js/Express.js backend with JWT authentication, REST API routes, and MongoDB persistence for the resume builder, and deployed the full-stack app on Render.",
      "Developed a Python-based ML microservice using FastAPI for resume parsing, ATS scoring, and job matching, applying NLP with Sentence Transformers (BERT) and feature engineering for skill extraction and resume–JD semantic similarity.",
      "Trained an XGBoost model within a hybrid ML + rule-based scoring pipeline with robust fallbacks for realistic ATS scores, using Gemini for grounded, LLM-based resume feedback."
    ]
  },
  {
    id: 2,
    name: "P2P Rental MarketPlace",
    date: "April 2025",
    description:
      "A full-stack peer-to-peer rental platform where users can list, discover, and rent items. Features an integrated Gemini AI assistant for natural language queries, verified user profiles, reputation scoring, and in-app chat.",
    tech: [
      "JavaScript",
      "React.js",
      "MySQL",
      "Node.js",
      "Express.js",
      "Gemini API",
    ],
    github: "",
    deployed: false,
    deployedUrl: "",
    image:
      "https://placehold.co/600x400/1a1a1a/f97316?text=P2P+Rental+MarketPlace",
    bullets: [
      "Developed a full-stack peer-to-peer rental platform enabling users to list, discover, and rent items using React.js, MySQL, and Node.js.",
      "Integrated Google’s Gemini AI API to develop an intelligent in-app assistant that answers user queries about rentals, listings, policies, and booking help via natural language prompts.",
      "Implemented user trust mechanisms such as verified profiles, reputation scores, and secure in-app chat to enhance transparency and reduce friction in rentals."
    ]
  },
  {
    id: 3,
    name: "Cryptocurrency Prediction & Analysis",
    date: "Oct 2024 – Feb 2025",
    description:
      "A machine learning system for cryptocurrency prediction with an interactive Python GUI. Features EDA with Pandas/NumPy, a trained Random Forest Classifier, and 10+ data visualizations for real-time prediction.",
    tech: [
      "Python",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Matplotlib",
      "Seaborn",
      "Tkinter",
    ],
    github: "",
    deployed: false,
    deployedUrl: "",
    image:
      "https://placehold.co/600x400/1a1a1a/f97316?text=Crypto+Prediction",
    bullets: [
      "Performed Exploratory Data Analysis (EDA) using NumPy and Pandas, and engineered features like open-close, low-high, and is-quarter-end to improve model accuracy.",
      "Trained a Random Forest Classifier using Scikit-learn, and evaluated it with F1 Score, Confusion Matrix, and ROC-AUC curves.",
      "Created a Python-based GUI using Tkinter with real-time prediction and 10+ interactive data visualizations using Matplotlib and Seaborn."
    ]
  },
  {
    id: 4,
    name: "Franchise Management System",
    date: "Sep 2024 – Dec 2024",
    description:
      "A full-stack web-based franchise management system with multi-role dashboards (Admin, Distributor, Franchise Owner, Customer). Built on a 3NF MySQL schema with secure session handling and role-based access.",
    tech: ["MySQL", "HTML", "CSS", "PHP", "XAMPP"],
    github: "",
    deployed: false,
    deployedUrl: "",
    image:
      "https://placehold.co/600x400/1a1a1a/f97316?text=Franchise+Management",
    bullets: [
      "Developed a full-stack web-based franchise management system with multi-role dashboards (Admin, Distributor, Franchise Owner, Customer).",
      "Designed a 3NF MySQL schema to optimize database performance and ensure data integrity.",
      "Implemented secure session handling and role-based access control (RBAC) to protect sensitive company and user information."
    ]
  },
];

export default projects;
