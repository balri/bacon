import gzip
import csv
import statistics

# Step 1: Find Kevin Bacon's nconst
kevin_bacon_nconst = None
with gzip.open("name.basics.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        if row["primaryName"].lower() == "kevin bacon":
            kevin_bacon_nconst = row["nconst"]
            break

if not kevin_bacon_nconst:
    raise ValueError("Kevin Bacon not found in name.basics.tsv.gz")

print(f"Kevin Bacon nconst: {kevin_bacon_nconst}")

# Step 2: Find all movies Kevin Bacon acted in
kevin_bacon_movies = set()
with gzip.open("title.principals.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        if row["nconst"] == kevin_bacon_nconst and row["category"] in ("actor", "actress"):
            kevin_bacon_movies.add(row["tconst"])

print(f"Number of titles Kevin Bacon appeared in: {len(kevin_bacon_movies)}")

# Step 3: Load movie ratings and filter for Kevin Bacon's movies
movie_ratings = []
movie_votes = []
with gzip.open("title.ratings.tsv.gz", "rt", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter="\t")
    for row in reader:
        tconst = row["tconst"]
        if tconst in kevin_bacon_movies:
            rating = float(row["averageRating"])
            votes = int(row["numVotes"])
            movie_ratings.append(rating)
            movie_votes.append(votes)

print(f"Number of Kevin Bacon movies with ratings: {len(movie_ratings)}")

# Step 4: Compute average and median
if movie_ratings:
    avg_rating = sum(movie_ratings) / len(movie_ratings)
    avg_votes = sum(movie_votes) / len(movie_votes)
    median_rating = statistics.median(movie_ratings)
    median_votes = statistics.median(movie_votes)

    print(f"Average rating: {avg_rating:.2f}")
    print(f"Median rating: {median_rating:.2f}")
    print(f"Average votes: {avg_votes:.0f}")
    print(f"Median votes: {median_votes:.0f}")

    # Optional: rating distribution
    rating_buckets = {}
    for r in movie_ratings:
        bucket = int(r)
        rating_buckets[bucket] = rating_buckets.get(bucket, 0) + 1

    print("Rating distribution (approx):")
    for b in sorted(rating_buckets):
        print(f"{b} stars: {rating_buckets[b]} movies")
else:
    print("No ratings available for Kevin Bacon movies.")
