from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from database import init_db
from routers import auth, profile, mentors, requests

app = FastAPI(title="Mentor-Mentee Matching API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(mentors.router, prefix="/api")
app.include_router(requests.router, prefix="/api")


@app.get("/")
def root():
    return RedirectResponse(url="/docs")
