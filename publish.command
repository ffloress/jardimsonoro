cd "$(dirname "$0")" || exit 1
cd generator || exit 1
bash publish.sh || exit 1
cd ..


git add .
git commit -m "auto"
if ! git push origin main; then
git push origin master
fi
