from fastapi import FastAPI
import httpx
import asyncio

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/time")
async def get_time():
    pass

async def get_weather(city: str, api_key: str):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

@app.get("/weather/")
async def weather(city: str = "Jackson Hole Mountain", api_key: str = "d52092a91a73683272328dcc5f22014f"):
    return await get_weather(city, api_key)

async def main():
    pass

if __name__ == "__main__":
    asyncio.run(main())