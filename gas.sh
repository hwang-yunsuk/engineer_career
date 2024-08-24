#!/bin/bash
echo -e "\n### GAS: Build for Google Apps Script ###\n"

GAS_DIR="./gas"
DIST_DIR="./dist"

# ./dist フォルダが作成されているか確認
if [ ! -d $DIST_DIR ]
then
    echo -e "\n### GAS: まずプロジェクトをビルドする必要があります! ###\n"
    return 0
fi

# gas ルートフォルダが作成されていない場合は作成
if [ ! -d $GAS_DIR ]
then
    mkdir $GAS_DIR
fi

# ./dist/index.html を ./gas/index.html にコピー

cat dist/index.html | \
sed -E "s|(<head>)|\1\n<link href=\"https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css\" rel=\"stylesheet\">|" | \
sed -E "s/<script.+script>/<?!= includes(\"js.html\"); ?>/" | \
sed -E "s/<link rel=\"stylesheet\".+>/<?!= includes(\"css.html\"); ?>/" > ./gas/index.html

echo -e "### GAS: index.html 作成完了! ###"

# ./dist/assets/index.*.js を ./gas/js.html にコピー
echo "<script type=\"module\" crossorigin>" > ./gas/js.html
cat ./dist/assets/index-*.js >> ./gas/js.html
echo "</script>" >> ./gas/js.html
echo -e "### GAS: js.html 作成完了! ###"

# ./dist/assets/index.*.css を ./gas/css.html にコピー
echo "<style>" > ./gas/css.html
cat ./dist/assets/index-*.css >> ./gas/css.html
echo "</style>" >> ./gas/css.html
echo -e "### GAS: css.html 作成完了! ###"

echo -e "\n### GAS: 完了! ###\n"
