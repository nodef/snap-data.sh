#!/usr/bin/env bash
# Clone all types of datasets

# Clone a type
clone() {
mkdir "$1"
cd "$1"
snap-data clone --type "$1" || true
cd ..
}


# Clone all types
clone navigation
clone wikipedia
clone directed
clone social
clone communities
clone temporal
clone communication
clone signed
clone edits
clone wiki-markup
clone bipartite
clone reddit-requests
clone online-communities
clone reddit-embeddings
clone reddit-submissions
clone web
clone movie-reviews
clone online-reviews
clone images
clone food-reviews
clone weighted
clone subreddit-hyperlinks
clone attributed
clone road
clone peer-to-peer
clone autonomous-systems
clone memes
clone memetracker
clone geo-location
clone time-series
clone tweets
clone twitter
clone communication
clone face-to-face
clone labeled
clone citation
clone collaboration
clone co-purchase
clone metadata
clone user-actions
