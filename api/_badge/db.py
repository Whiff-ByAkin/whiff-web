"""MongoDB access — the CSV/JSON registry from your script now lives here, in
the SAME database the Next app uses (olettrasocials)."""

import os
from datetime import datetime, timezone

from pymongo import ASCENDING, MongoClient, ReturnDocument

# Collections (namespaced like the app's whiff_match_games).
COUNTER_COLLECTION = "whiff_counters"
BADGE_COLLECTION = "whiff_founder_badges"

_client = None
_indexes_ready = False


def _db():
    global _client
    if _client is None:
        uri = os.environ.get("MONGODB_URI")
        if not uri:
            raise RuntimeError("MONGODB_URI is not configured.")
        _client = MongoClient(uri)
    return _client[os.getenv("MONGODB_DB", "olettrasocials")]


def _ensure_indexes():
    global _indexes_ready
    if _indexes_ready:
        return
    col = _db()[BADGE_COLLECTION]
    # A hidden code and a founder number each identify exactly one badge.
    col.create_index([("hiddenCode", ASCENDING)], unique=True)
    col.create_index([("founderNumber", ASCENDING)], unique=True)
    col.create_index([("email", ASCENDING)])
    _indexes_ready = True


def next_founder_number():
    """Atomically hand out the next founder number. Replaces the START/END loop
    in your script — one call = one badge. First ever call returns 1."""
    doc = _db()[COUNTER_COLLECTION].find_one_and_update(
        {"_id": "founderNumber"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return doc["seq"]


def save_badge(record):
    _ensure_indexes()
    _db()[BADGE_COLLECTION].insert_one(record)


def find_badge(hidden_code):
    return _db()[BADGE_COLLECTION].find_one({"hiddenCode": hidden_code})


def mark_sent(hidden_code):
    _db()[BADGE_COLLECTION].update_one(
        {"hiddenCode": hidden_code},
        {"$set": {"sent": True, "sentAt": datetime.now(timezone.utc)}},
    )
