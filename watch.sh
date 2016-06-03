#/bin/sh
# Install fswatch first
fswatch -o . | xargs -n1 -I{} ./refresh.sh