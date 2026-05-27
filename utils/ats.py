REQUIRED_SKILLS = [
    "python",
    "aws",
    "docker",
    "kubernetes",
    "react",
    "fastapi",
    "mongodb",
    "sql",
    "git",
    "javascript"
]

def calculate_ats_score(resume_text):
    resume_text = resume_text.lower()

    matched_skills = []
    missing_skills = []

    for skill in REQUIRED_SKILLS:
        if skill in resume_text:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    score = int(
        (len(matched_skills) / len(REQUIRED_SKILLS)) * 100
    )

    suggestions = []

    # Missing skills suggestion
    if missing_skills:
        suggestions.append(
            f"Add these missing skills: {', '.join(missing_skills)}"
        )

    # Weak ATS score
    if score < 70:
        suggestions.append(
            "Improve project descriptions with strong technical keywords."
        )

    # Experience section
    if "experience" not in resume_text:
        suggestions.append(
            "Add professional experience or internship section."
        )

    # Summary section
    if "summary" not in resume_text and "objective" not in resume_text:
        suggestions.append(
            "Add a strong professional summary section."
        )

    # Achievement section
    if "%" not in resume_text and "improved" not in resume_text:
        suggestions.append(
            "Add measurable achievements using numbers or percentages."
        )

    # GitHub links
    if "github" not in resume_text:
        suggestions.append(
            "Add GitHub profile or project links."
        )

    # LinkedIn profile
    if "linkedin" not in resume_text:
        suggestions.append(
            "Add LinkedIn profile for better professional visibility."
        )

    # Deployment links
    if "vercel" not in resume_text and "netlify" not in resume_text:
        suggestions.append(
            "Add deployed project links like Vercel or Netlify."
        )

    # Certifications
    if "certification" not in resume_text:
        suggestions.append(
            "Add certifications to strengthen your resume."
        )

    # React projects suggestion
    if "project" in resume_text and "react" not in resume_text:
        suggestions.append(
            "Add modern frontend projects using React.js."
        )

    return {
        "ats_score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }