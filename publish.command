cd "$(dirname "$0")" || exit 1
# traz antes os posts que o GitHub Actions publicou (issues), para gerar o blog com eles
git pull --rebase --autostash || exit 1
cd generator || exit 1
bash publish.sh || exit 1
cd ..


git add .
git commit -m "auto"
# o GitHub Actions do blog também faz commits: traz esses antes de enviar
git pull --rebase --autostash || exit 1
if ! git push origin main; then
git push origin master
fi
