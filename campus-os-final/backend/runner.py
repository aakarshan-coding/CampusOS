import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

load_dotenv()

async def main():
    project_dir = Path(__file__).parent
    server_script = project_dir/"mcp_server.py"

    async with MCPServerStdio(
        name="Local python MCP server",
        params={
            "command": sys.executable,
            "args": [str(server_script)],
        },
        client_session_timeout_seconds=30.0
    ) as server:
        agent = Agent(
            name="CampusCopilot",
            instructions="You are a helpful assistant that can answer questions about the campus and help with tasks. Use MCP tools to read Canvas data.",
            mcp_servers=[server],
        )
        result = await Runner.run(agent, "please list all of my courses and my upcoming assignments.")
        print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())