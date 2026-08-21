const projects = [
  {
    id: 5,
    name: "Financial Intelligence System",
    date: "Feb 2026 – Present",
    description:
      "A causal, decision-time behavioral bias detection engine and wealth forecasting system. Features NOTEARS causal structure learning and DoWhy do-calculus to quantify biases driving sell decisions (achieving 85.7% Macro F1), a personalized long-horizon Monte Carlo simulator (10,000 paths × 30 years) for hold vs. sell projections, and an explainable AI layer using multi-agent adversarial debate (AutoGen) with SHA-256 cryptographic audit trails.",
    tech: [
      "Python",
      "XGBoost",
      "DoWhy",
      "AutoGen",
      "FastAPI",
      "Monte Carlo",
      "SHAP",
    ],
    github: "",
    deployed: false,
    deployedUrl: "",
    image: "https://placehold.co/600x400/1a1a1a/f97316?text=Financial Intelligence System",
    bullets: [
      "Engineered a causal, decision-time behavioral bias detection engine, the only system that intervenes at the exact moment an investor decides, not retrospectively. Used NOTEARS causal structure learning and DoWhy do-calculus to quantify how much each bias causally drives a sell decision, achieving 85.7% Macro F1 with per-prediction SHAP attributions, filling a gap no existing robo-advisor addresses.",
      "Engineered a personalised long-horizon Monte Carlo simulator (10,000 paths × 30 years) producing individual HOLD vs SELL wealth projections with P10/P50/P90 uncertainty bands, personalised to age, risk tolerance, and financial obligations.",
      "Architected a decision-centric Explainable AI layer using a multi-agent adversarial debate system (AutoGen) that replaces static SHAP/LIME explanations with counterfactual narratives grounded in Monte Carlo simulation numbers paired with a blockchain-style SHA-256 cryptographic audit trail making every AI decision independently verifiable and tamper-evident."
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
      "Designed and developed a Python-based ML microservice using FastAPI and REST APIs for resume parsing, ATS scoring and job matching, integrated with resume builder workflow.",
      "Used NLP with Sentence Transformers (BERT) and feature engineering for skill extraction and measuring semantic similarity between resumes and job descriptions.",
      "Trained and integrated an XGBoost model with a hybrid ML + rule-based scoring pipeline, for generating realistic ATS scores with robust fallback mechanisms.",
      "Incorporated Google Gemini API for context aware, AI-driven career guidance, resume improvement suggestions and intelligent job analysis and matching."
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
