QUESTION_BANK = {
    "python": [
        "Explain Python decorators.",
        "What is list comprehension in Python?",
        "Difference between list and tuple?",
        "What is a lambda function?"
    ],

    "aws": [
        "What is AWS S3?",
        "Difference between EC2 and Lambda?",
        "Explain IAM roles in AWS.",
        "What is API Gateway?"
    ],

    "react": [
        "What are React hooks?",
        "Difference between state and props?",
        "What is useEffect?",
        "Explain React Virtual DOM."
    ],

    "docker": [
        "What is Docker?",
        "Difference between Docker and VM?",
        "Explain Docker containers."
    ],

    "fastapi": [
        "Why use FastAPI?",
        "Difference between Flask and FastAPI?",
        "What is asynchronous API?"
    ],

    "mongodb": [
        "What is MongoDB?",
        "Difference between SQL and MongoDB?",
        "Explain collections in MongoDB."
    ]
}


def generate_interview_questions(matched_skills):
    questions = []

    for skill in matched_skills:
        skill = skill.lower()

        if skill in QUESTION_BANK:
            questions.extend(
                QUESTION_BANK[skill][:3]
            )

    return questions