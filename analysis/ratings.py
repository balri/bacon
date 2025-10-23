import gzip
import csv

# Step 1: Load ratings
ratings = []
with gzip.open("title.ratings.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        ratings.append({
            "tconst": row["tconst"],
            "rating": float(row["averageRating"]),
            "votes": int(row["numVotes"])
        })

print(f"Total rated titles: {len(ratings)}")

# Step 2: Optionally filter only movies from title.basics.tsv.gz
movies_set = set()
with gzip.open("title.basics.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        if row["titleType"] == "movie" and row["isAdult"] == "0":
            movies_set.add(row["tconst"])

# Keep only movies with ratings
movie_ratings = [r for r in ratings if r["tconst"] in movies_set]

print(f"Number of non-adult movies with ratings: {len(movie_ratings)}")

# Step 3: Compute simple stats
avg_rating = sum(r["rating"] for r in movie_ratings) / len(movie_ratings)
avg_votes = sum(r["votes"] for r in movie_ratings) / len(movie_ratings)

print(f"Average rating: {avg_rating:.2f}")
print(f"Average votes: {avg_votes:.0f}")

# Step 4: Optional distributions
# Ratings by integer bucket
rating_buckets = {}
for r in movie_ratings:
    bucket = int(r["rating"])
    rating_buckets[bucket] = rating_buckets.get(bucket, 0) + 1

print("Rating distribution (approx):")
for b in sorted(rating_buckets):
    print(f"{b} stars: {rating_buckets[b]} movies")

# Votes by category
vote_buckets = {"<1k": 0, "1k–10k":0, "10k–100k":0, "100k+":0}
for r in movie_ratings:
    v = r["votes"]
    if v < 1000: vote_buckets["<1k"] += 1
    elif v < 10000: vote_buckets["1k–10k"] += 1
    elif v < 100000: vote_buckets["10k–100k"] += 1
    else: vote_buckets["100k+"] += 1

print("Vote distribution:")
for k,v in vote_buckets.items():
    print(f"{k}: {v} movies")
