import gzip
import csv
import sqlite3

# === 1. Create database ===
conn = sqlite3.connect("imdb_filtered.db")
cur = conn.cursor()

cur.executescript("""
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS actors;
DROP TABLE IF EXISTS appearances;

CREATE TABLE movies (
    id TEXT PRIMARY KEY,
    title TEXT,
    year INTEGER,
    rating REAL,
    votes INTEGER
);

CREATE TABLE actors (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE appearances (
    movie_id TEXT,
    actor_id TEXT
);
""")

# === 2. Load movie ratings into memory (only ratings >= 6 and votes >= 3000) ===
print("Loading ratings...")
ratings = {}
with gzip.open("title.ratings.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        rating = float(row["averageRating"])
        votes = int(row["numVotes"])
        if rating >= 6 and votes >= 3000:
            ratings[row["tconst"]] = (
                rating,
                votes
            )

# === 3. Import movies (only type=movie and with rating >= 6) ===
print("Importing movies...")
movie_ids = set()
with gzip.open("title.basics.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        if row["titleType"] != "movie" or row["isAdult"] != "0":
            continue
        if row["tconst"] not in ratings:
            continue
        rating, votes = ratings[row["tconst"]]
        cur.execute(
            "INSERT INTO movies VALUES (?, ?, ?, ?, ?)",
            (
                row["tconst"],
                row["primaryTitle"],
                int(row["startYear"]) if row["startYear"].isdigit() else None,
                rating,
                votes
            )
        )
        movie_ids.add(row["tconst"])

conn.commit()

# === 4. Collect actor IDs who appear in imported movies ===
print("Collecting actor IDs...")
actor_ids = set()
with gzip.open("title.principals.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        if row["category"] not in ("actor", "actress"):
            continue
        if row["tconst"] in movie_ids:
            actor_ids.add(row["nconst"])

# === 5. Import only actors who appear in imported movies ===
print("Importing actors...")
with gzip.open("name.basics.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        if row["nconst"] in actor_ids:
            cur.execute(
                "INSERT INTO actors VALUES (?, ?)",
                (row["nconst"], row["primaryName"])
            )

conn.commit()

# === 6. Import only actor/actress roles for imported movies and actors ===
print("Importing appearances...")
with gzip.open("title.principals.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        if row["category"] not in ("actor", "actress"):
            continue
        if row["tconst"] in movie_ids and row["nconst"] in actor_ids:
            cur.execute(
                "INSERT INTO appearances VALUES (?, ?)",
                (row["tconst"], row["nconst"])
            )

conn.commit()
conn.close()
print("✅ Done. Database ready: imdb_filtered.db")
