import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Large realistic dataset (20+ roles)
const rolesData = {
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "Redux", "TypeScript", "Tailwind CSS", "Git", "REST APIs", "Responsive Design"
  ],
  "Backend Developer": [
    "Node.js", "Express", "MongoDB", "SQL", "Authentication", "APIs", "Error Handling", "JWT", "Docker", "Server Deployment"
  ],
  "Full Stack Developer": [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Git", "REST APIs", "Docker"
  ],
  "Data Scientist": [
    "Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "Data Visualization", "Statistics", "SQL", "Machine Learning"
  ],
  "Machine Learning Engineer": [
    "Python", "TensorFlow", "PyTorch", "Numpy", "Scikit-learn", "Model Deployment", "Flask", "Data Preprocessing", "Computer Vision", "NLP"
  ],
  "AI Engineer": [
    "Python", "Deep Learning", "PyTorch", "TensorFlow", "Transformers", "LLMs", "Prompt Engineering", "APIs", "Data Engineering", "Cloud AI"
  ],
  "DevOps Engineer": [
    "Linux", "AWS", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Git", "Terraform", "Ansible", "Networking"
  ],
  "Cloud Engineer": [
    "AWS", "Azure", "GCP", "Linux", "Networking", "Cloud Security", "Kubernetes", "CI/CD", "APIs", "Scripting"
  ],
  "Database Administrator": [
    "SQL", "MySQL", "PostgreSQL", "Oracle", "MongoDB", "Database Design", "Backup and Recovery", "Indexes", "Query Optimization"
  ],
  "Cybersecurity Analyst": [
    "Network Security", "Firewalls", "Penetration Testing", "Linux", "Incident Response", "Threat Analysis", "Cryptography", "SIEM", "Vulnerability Scanning"
  ],
  "UI/UX Designer": [
    "Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Typography", "Color Theory", "Usability Testing", "Design Systems"
  ],
  "Mobile App Developer": [
    "Flutter", "Dart", "React Native", "Android", "iOS", "APIs", "Firebase", "UI Design", "Version Control"
  ],
  "Game Developer": [
    "Unity", "C#", "3D Modeling", "Physics Engines", "Game Design", "AI for Games", "Animation", "Graphics Programming"
  ],
  "Software Engineer": [
    "Data Structures", "Algorithms", "OOP", "Design Patterns", "Testing", "Version Control", "Debugging", "Problem Solving"
  ],
  "Data Engineer": [
    "Python", "SQL", "ETL", "Big Data", "Apache Spark", "Airflow", "Data Pipelines", "AWS", "Hadoop"
  ],
  "AI Researcher": [
    "Machine Learning", "Deep Learning", "Mathematics", "Statistics", "Research Papers", "NLP", "Computer Vision", "Python", "Transformers"
  ],
  "Blockchain Developer": [
    "Solidity", "Ethereum", "Smart Contracts", "Web3.js", "Cryptography", "Node.js", "Blockchain Architecture", "DeFi", "React"
  ],
  "Embedded Systems Engineer": [
    "C", "C++", "Microcontrollers", "RTOS", "IoT", "PCB Design", "Sensors", "Debugging", "Firmware"
  ],
  "Cloud Security Engineer": [
    "AWS", "Azure", "Cloud Security", "IAM", "Network Security", "Encryption", "Pen Testing", "Monitoring", "Incident Response"
  ],
  "AR/VR Developer": [
    "Unity", "C#", "3D Modeling", "VR SDKs", "OpenXR", "Blender", "Physics Engines", "Graphics Programming"
  ],
  "Prompt Engineer": [
    "Prompt Design", "LLMs", "ChatGPT", "APIs", "Python", "AI Safety", "Content Generation", "Fine-tuning", "Data Curation"
  ]
};

// ✅ Get all roles
app.get("/roles", (req, res) => {
  res.json(Object.keys(rolesData));
});

// ✅ Get required skills for a role
app.get("/role-skills", (req, res) => {
  const role = req.query.role;
  if (!role || !rolesData[role]) {
    return res.status(404).json({ error: "Role not found" });
  }
  res.json({ role, skills: rolesData[role] });
});

// ✅ Analyze skill gap
app.post("/analyze", (req, res) => {
  const { role, userSkills } = req.body;
  if (!role || !rolesData[role]) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const required = rolesData[role];
  const missing = required.filter(s => !userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase()));
  const recommendations = missing.map(s => `Try learning ${s} — explore YouTube tutorials, freeCodeCamp, or Coursera.`);

  res.json({
    role,
    total: required.length,
    missingSkills: missing,
    recommendations
  });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});
