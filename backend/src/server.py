from fastapi import FastAPI
import asyncio

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

# Time endpoint
@app.get("/time")
async def get_time():
    pass

# Weather endpoint
@app.get("/weather")
async def get_weather():
    pass


async def main():
    pass

if __name__ == "__main__":
    asyncio.run(main())