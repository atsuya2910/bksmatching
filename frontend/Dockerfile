# ベースイメージを指定
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# 依存関係のファイルをコピーして、キャッシュを活用
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsが使用するポートを公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
