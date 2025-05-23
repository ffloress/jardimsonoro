#!/bin/bash

#SETTINGS:
source="content"
destination=".."
theme="theme"
###########################




#Generate Blog
mkdir "${destination}/blog" 2>/dev/null
pelican "$source" -s pelicanconf.py -o "${destination}/blog" -t "$theme"
########################


######IMG##############
mkdir -p "${destination}/blog"

# Percorre todos os arquivos em ./img/ (recursivamente ou não)
find ./img/ -type f | while read -r img; do
  # Verifica se o arquivo é uma imagem reconhecida pelo ImageMagick
  if magick identify "$img" &> /dev/null; then
    # Extrai o nome do arquivo
    filename=$(basename "$img")
    # Converte a imagem redimensionando com proporção mantida e limites
    echo "$img"
    magick convert "$img" -resize '500x400>' "${destination}/blog/$filename"
  fi
done



#Generate Linktree
mkdir "${destination}/linktree" 2>/dev/null
cp "${destination}/blog/linktree.html" "${destination}/linktree/index.html"
############################


####sitemapfix
grep -v '</urlset>' "${destination}"/blog/sitemap.xml >"${destination}"/sitemap.xml
rm "${destination}"/blog/sitemap.xml
cat "${destination}"/indexmap.xml >> "${destination}"/sitemap.xml
####################

echo "Done!"


