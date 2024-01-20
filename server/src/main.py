from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

application = FastAPI()


application.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"],
                           allow_headers=["*"])


@application.get("/")
async def root():
    return {"message": "Hello World"}
