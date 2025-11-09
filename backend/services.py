import os
import httpx
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

load_dotenv()


CANVAS_BASE = os.getenv("CANVAS_BASE")
CANVAS_TOKEN = os.getenv("CANVAS_TOKEN")

if not CANVAS_BASE or not CANVAS_TOKEN:
    pass

HEADERS = {"Authorization": f"Bearer {CANVAS_TOKEN}"}

def _require_env():
    if not CANVAS_BASE or not CANVAS_TOKEN:
        raise RuntimeError("Missing base or token in env")

def _get(url: str, params: Optional[Dict[str, Any]] = None) -> httpx.Response:
    _require_env()
    r = httpx.get(url, headers=HEADERS, params=params, timeout=30.0, follow_redirects = True)
    r.raise_for_status()
    return r

# important function -> collects all canvas data as raw, to be formatted by later functions

def _collect(url: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Run through canvas pages -> pull all of it into a list.
    """
    out: List[Dict[str, Any]] = []
    resp = _get(url, params)
    data = resp.json()
    if isinstance(data, list):
        out.extend(data)

    while "link" in resp.headers:
        links_raw = resp.headers["link"]
        parts = [p.strip() for p in links_raw.split(",")]
        rels = {}
        for p in parts:
            segs = p.split(";")
            href = segs[0].strip("<> ")
            rel = None
            for s in segs[1:]:
                s = s.strip()
                if s.startswith("rel="):
                    rel = s.split("=")[1].strip('"')
            if rel:
                rels[rel] = href

        if "next" not in rels:
            break
        resp = _get(rels["next"])
        data = resp.json()
        if isinstance(data, list):
            out.extend(data)
        else:
            break
    return out

# implmenetation for each hookup right here, add more as more features are required
def list_courses_raw() -> List[Dict[str, Any]]:
    return _collect(f"{CANVAS_BASE}/api/v1/courses", params={"per_page": 100, "include[]": ["term", "enrollments"], "enrollment_state": "active"})

def list_assignments_raw(course_id: int) -> List[Dict[str, Any]]:
    return _collect(f"{CANVAS_BASE}/api/v1/courses/{course_id}/assignments")

def list_submissions_raw(course_id: int, assignment_id: int) -> List[Dict[str, Any]]:
    return _collect(f"{CANVAS_BASE}/api/v1/courses/{course_id}/students/submissions", params={"student_ids[]": "self", "per_page": 100},)

def list_calendar_events_raw(start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Dict[str, Any]]:
    params: Dict[str, Any] = {"type": "assignment"}
    if start_date: params["start_date"] = start_date
    if end_date: params["end_date"] = end_date
    return _collect(f"{CANVAS_BASE}/api/v1/calendar_events", params=params)

# all functions to parse data points from original canvas data and return cleanly

def mcp_list_courses() -> List[Dict[str, Any]]:
    out = []
    for c in list_courses_raw():
        out.append({
            "id": c.get("id"),
            "name": c.get("name"),
            "code": c.get("course_code"),
            "term": (c.get("term") or {}).get("name"),
        })
    return out


