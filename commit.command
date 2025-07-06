#!/bin/bash

cd "$(dirname "$0")"
git add .
git commit -m "auto"
if ! git push origin main; then
git push origin master
fi
