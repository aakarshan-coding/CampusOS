# actual call of the mcp server
from fastmcp import FastMCP
from typing import List, Dict, Any
from services import (
    mcp_list_courses
)

app = FastMCP("Canvas MCP")

@app.tool
def list_courses() -> List[Dict[str, Any]]:
    return mcp_list_courses()

if __name__ == "__main__":
    app.run()