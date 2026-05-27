from fastapi import (
    FastAPI,
    File,
    UploadFile,
    Header
)
from fastapi.middleware.cors import CORSMiddleware
import boto3
from dotenv import load_dotenv
import os
from utils.pdf_parser import extract_text_from_pdf
from utils.ats import calculate_ats_score
from utils.interview_questions import generate_interview_questions
from datetime import datetime
from pydantic import BaseModel, EmailStr

from database.mongodb import (
    user_collection,
    resume_collection
)

from auth.auth_handler import (
    hash_password,
    verify_password
)

from auth.jwt_handler import (
    create_access_token,
    verify_token
)

from bson import ObjectId
import uuid

load_dotenv()

app = FastAPI()
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class RenameResume(BaseModel):
    new_name: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION,
)

@app.get("/")
def home():
    return {
        "message": "Backend running successfully"
    }

@app.post("/signup")
def signup(user: UserSignup):

    existing_user = user_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "message": "User already exists"
        }

    hashed_password = hash_password(
        user.password
    )

    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }

    user_collection.insert_one(user_data)

    return {
        "message": "User created successfully"
    }

@app.post("/login")
def login(user: UserLogin):

    existing_user = user_collection.find_one(
        {"email": user.email}
    )

    if not existing_user:
        return {
            "message": "User not found"
        }

    is_password_correct = verify_password(
        user.password,
        existing_user["password"]
    )

    if not is_password_correct:
        return {
            "message": "Incorrect password"
        }

    token = create_access_token({
        "email": user.email
    })

    return {
        "message": "Login successful",
        "token": token,
        "name": existing_user["name"],
        "email": existing_user["email"],
}

@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    try:
        if file.content_type != "application/pdf":
            return {
                "error": "Only PDF files are allowed"
            }

        token = authorization.split(" ")[1]

        user_data = verify_token(token)

        if not user_data:
            return {
                "message": "Invalid token"
            }

        user_email = user_data["email"]

        contents = await file.read()

        resume_text = extract_text_from_pdf(contents)

        ats_result = calculate_ats_score(resume_text)

        questions = generate_interview_questions(
            ats_result["matched_skills"]
        )

        unique_filename = f"{uuid.uuid4()}_{file.filename}"

        s3.put_object(
            Bucket=AWS_BUCKET_NAME,
            Key=unique_filename,
            Body=contents,
            ContentType=file.content_type
        )

        file_url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": AWS_BUCKET_NAME,
                "Key": unique_filename
            },
            ExpiresIn=604800
        )

        resume_data = {
            "filename": file.filename,
            "s3_key": unique_filename,
            "ats_score": ats_result["ats_score"],
            "matched_skills": ats_result["matched_skills"],
            "missing_skills": ats_result["missing_skills"],
            "suggestions": ats_result["suggestions"],
            "interview_questions": questions,
            "uploaded_at": datetime.utcnow(),
            "user_email": user_email,
            "is_favorite": False
        }

        resume_collection.insert_one(resume_data)

        return {
            "message": "Resume uploaded successfully",
            "filename": file.filename,
            "file_url": file_url,
            "ats_analysis": ats_result,
            "interview_questions": questions
        }

    except Exception as e:
        return {
            "error": str(e)
        }
    
@app.get("/my-resumes")
def get_my_resumes(
    authorization: str = Header(None)
):

    token = authorization.split(" ")[1]

    user_data = verify_token(token)

    if not user_data:
        return {
            "message": "Invalid token"
        }

    user_email = user_data["email"]

    resumes = list(
        resume_collection.find(
            {"user_email": user_email}
        )
    )

    for resume in resumes:
        resume["_id"] = str(resume["_id"])

    return {
        "resumes": resumes
    }

@app.delete("/delete-resume/{resume_id}")
async def delete_resume(
    resume_id: str,
    authorization: str = Header(None)
):
    try:
        token = authorization.split(" ")[1]

        user_data = verify_token(token)

        if not user_data:
            return {
                "message": "Invalid token"
            }

        user_email = user_data["email"]

        # Find resume first
        resume = resume_collection.find_one({
            "_id": ObjectId(resume_id),
            "user_email": user_email
        })

        if not resume:
            return {
                "message": "Resume not found"
            }
        
        s3.delete_object(
            Bucket=AWS_BUCKET_NAME,
            Key=resume["s3_key"]
        )
        
        # Delete from S3 bucket
        s3.delete_object(
            Bucket=AWS_BUCKET_NAME,
            Key=resume["filename"]
        )

        # Delete from MongoDB
        resume_collection.delete_one({
            "_id": ObjectId(resume_id)
        })

        return {
            "message": "Resume deleted successfully"
        }

    except Exception as e:
        print(e)

        return {
            "message": "Delete failed"
        }
    
@app.get("/resume-link/{resume_id}")
async def get_resume_link(
    resume_id: str,
    authorization: str = Header(None)
):
    try:
        token = authorization.split(" ")[1]

        user_data = verify_token(token)

        if not user_data:
            return {
                "message": "Invalid token"
            }

        user_email = user_data["email"]

        resume = resume_collection.find_one({
            "_id": ObjectId(resume_id),
            "user_email": user_email
        })

        if not resume:
            return {
                "message": "Resume not found"
            }

        fresh_file_url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": AWS_BUCKET_NAME,
                "Key": resume["s3_key"]
            },
            ExpiresIn=604800
        )

        return {
            "file_url": fresh_file_url
        }

    except Exception as e:
        print(e)

        return {
            "message": "Failed to generate resume link"
        }
    

@app.put("/rename-resume/{resume_id}")
async def rename_resume(
    resume_id: str,
    data: RenameResume,
    authorization: str = Header(None)
):
    try:
        token = authorization.split(" ")[1]

        user_data = verify_token(token)

        if not user_data:
            return {
                "message": "Invalid token"
            }

        user_email = user_data["email"]

        resume = resume_collection.find_one({
            "_id": ObjectId(resume_id),
            "user_email": user_email
        })

        if not resume:
            return {
                "message": "Resume not found"
            }

        if not data.new_name.endswith(".pdf"):
            new_filename = data.new_name + ".pdf"
        else:
            new_filename = data.new_name

        resume_collection.update_one(
            {"_id": ObjectId(resume_id)},
            {
                "$set": {
                    "filename": new_filename
                }
            }
        )

        return {
            "message": "Resume renamed successfully"
        }

    except Exception as e:
        print(e)

        return {
            "message": "Rename failed"
        }
    
@app.put("/favorite-resume/{resume_id}")
async def favorite_resume(
    resume_id: str,
    authorization: str = Header(None)
):
    try:
        token = authorization.split(" ")[1]

        user_data = verify_token(token)

        if not user_data:
            return {
                "message": "Invalid token"
            }

        user_email = user_data["email"]

        resume = resume_collection.find_one({
            "_id": ObjectId(resume_id),
            "user_email": user_email
        })

        if not resume:
            return {
                "message": "Resume not found"
            }

        new_value = not resume.get("is_favorite", False)

        resume_collection.update_one(
            {
                "_id": ObjectId(resume_id)
            },
            {
                "$set": {
                    "is_favorite": new_value
                }
            }
        )

        return {
            "message": "Favorite updated"
        }

    except Exception as e:
        print(e)

        return {
            "message": "Favorite update failed"
        }
    
@app.get("/")
async def root():
    return {"message": "API running"}