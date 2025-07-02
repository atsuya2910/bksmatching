# Meetup マッチングサービス

イベントの作成・参加・管理ができる現代的なマッチングサービスです。

## 🚀 機能

### ✅ 実装済み機能
- **ユーザー認証**: 登録・ログイン・JWT認証
- **イベント管理**: 作成・編集・削除・参加・離脱
- **高度な検索**: キーワード・場所・日付・並び順での検索
- **カテゴリ・タグシステム**: イベントの分類と整理
- **レスポンシブUI**: スマートフォンからデスクトップまで対応

### 🔄 開発中機能
- カテゴリ・タグのフロントエンドUI
- ユーザープロフィール機能
- 画像アップロード機能
- レビュー・評価システム

## 🏗️ 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **バックエンド**: NestJS, Prisma, PostgreSQL
- **認証**: JWT
- **インフラ**: Docker Compose

## 📋 セットアップ手順

### 1. 前提条件
- Node.js 18.0.0以上
- Docker & Docker Compose

### 2. リポジトリのクローン
```bash
git clone <repository-url>
cd bksmatching
```

### 3. 環境変数の設定
```bash
# プロジェクトルートに.envファイルを作成
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=bksmatching

# backend/.envファイルを作成
DATABASE_URL="postgresql://postgres:password@localhost:5432/bksmatching?schema=public"
JWT_SECRET="your-jwt-secret-key-here"
PORT=4000
```

### 4. Docker Composeでデータベース起動
```bash
docker compose up -d db
```

### 5. バックエンドの設定
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # 初期データ投入（任意）
npm run start:dev
```

### 6. フロントエンドの設定
```bash
cd frontend
npm install
npm run dev
```

### 7. アクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:4000

## 📝 APIエンドポイント

### 認証
- `POST /auth/signup` - ユーザー登録
- `POST /auth/login` - ログイン

### イベント
- `GET /events` - イベント一覧・検索
- `POST /events` - イベント作成
- `GET /events/:id` - イベント詳細
- `PUT /events/:id` - イベント更新
- `DELETE /events/:id` - イベント削除
- `POST /events/:id/join` - イベント参加
- `POST /events/:id/leave` - イベント離脱

### カテゴリ
- `GET /categories` - カテゴリ一覧
- `POST /categories` - カテゴリ作成

### タグ
- `GET /tags` - タグ一覧
- `POST /tags` - タグ作成

## 🔍 検索機能

以下のパラメータでイベントを検索できます：

- `search`: タイトル・説明文でのキーワード検索
- `location`: 開催場所での検索
- `dateFrom`: 開始日での絞り込み
- `dateTo`: 終了日での絞り込み
- `categoryId`: カテゴリでの絞り込み
- `tags`: タグでの絞り込み（カンマ区切り）
- `sortBy`: 並び順（eventDate, createdAt, title）
- `sortOrder`: 順序（asc, desc）

## 🎨 UIの特徴

- **モダンなカードデザイン**: ホバー効果付きのイベントカード
- **モーダル詳細表示**: スムーズなイベント詳細表示
- **検索フィルタ**: 折りたたみ可能な詳細フィルタ
- **日本語対応**: 完全日本語インターフェース

## 🛠️ 開発

### コードの品質チェック
```bash
# バックエンド
cd backend
npm run lint
npm run test

# フロントエンド
cd frontend
npm run lint
npm run build
```

### データベースの管理
```bash
# マイグレーション作成
npx prisma migrate dev --name <migration-name>

# データベース初期化
npx prisma migrate reset

# Prisma Studio起動
npx prisma studio
```

## 📚 今後の拡張予定

1. **ユーザープロフィール**: アバター・自己紹介・興味設定
2. **画像アップロード**: イベント画像の管理
3. **通知システム**: リアルタイム通知
4. **地図統合**: 開催場所の地図表示
5. **レビューシステム**: イベント・ユーザー評価
6. **チャット機能**: 参加者間のコミュニケーション

## 🤝 貢献

プルリクエストや課題報告を歓迎いたします。大きな変更を行う前に、まずissueを作成してください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で提供されています。