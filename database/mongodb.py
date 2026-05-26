from pymongo import MongoClient
import certifi
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(
    MONGO_URL,
    tlsCAFile=certifi.where()
)

db = client["resume_analyzer"]

user_collection = db["users"]

resume_collection = db["resumes"]