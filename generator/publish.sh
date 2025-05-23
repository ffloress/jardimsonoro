#!/usr/bin/env bash


#SETTINGS:
source="content"
destination=".."
theme="theme"
overwrite_images=false  
###########################




#Generate Blog
mkdir "${destination}/blog" 2>/dev/null
pelican "$source" -s pelicanconf.py -o "${destination}/blog" -t "$theme"
########################


######IMG##############
mkdir -p "${destination}/blog/img"



######IMG##############
mkdir -p "${destination}/blog/img"


# Tipos de imagem suportados
image_extensions="jpg jpeg png webp gif bmp tif tiff"

# Percorre todos os arquivos em ./img/ (recursivamente ou não)
printf "%s" 'Imgs:'
find ./img/ -type f | while read -r img; do
  # Extrai a extensão do arquivo (em minúsculas)
  ext="${img##*.}"
  ext="${ext,,}"  # Converte para minúsculas

  # Verifica se a extensão é de uma imagem suportada
  if [[ " $image_extensions " == *" $ext "* ]]; then
    # Extrai o nome do arquivo
    filename=$(basename "$img")
    target_path="${destination}/blog/img/$filename"

    # Verifica se o arquivo já existe e se devemos pular
    if [[ "$overwrite_images" = false && -f "$target_path" ]]; then
     # echo "Pulando $filename (já existe e overwrite_images=false)"
     printf "%s" '.'
      continue
    fi

    # Converte a imagem redimensionando com proporção mantida e limites
    echo "Convertendo $img para $target_path"
    magick convert "$img" -resize '500x400>' "$target_path"
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


