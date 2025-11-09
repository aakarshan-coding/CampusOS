# actual call of the mcp server
from fastmcp import FastMCP
from typing import List, Dict, Any
from services import (
    mcp_list_courses,
    mcp_list_assignments
)

app = FastMCP("Canvas MCP")

@app.tool
def list_courses() -> List[Dict[str, Any]]:
    return mcp_list_courses()

@app.tool
def list_assignments(course_id: int, due_within_days: int = 14) -> List[Dict[str, Any]]:
    return mcp_list_assignments(course_id, due_within_days)

if __name__ == "__main__":
    app.run()