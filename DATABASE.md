# 📝 データベース構造

## テーブル構成

### プロフィール (profiles)

ユーザープロフィール情報を管理するテーブル

| カラム名 | 型 | 説明 | 制約 |
|---------|-------|------------|------------|
| id | uuid | プロフィールID | PRIMARY KEY |
| email | text | メールアドレス | UNIQUE |
| username | text | ユーザー名 | UNIQUE, NOT NULL |
| created_at | timestamp with time zone | 作成日時 | DEFAULT now() |

#### インデックス
- `profiles_pkey`: PRIMARY KEY (id)
- `profiles_username_unique`: UNIQUE (username)

#### 外部キー制約
- `profiles_id_fkey`: FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE

#### Row Level Security (RLS)
- `Public profiles are viewable by everyone`: 全ユーザーがプロフィールを閲覧可能
- `Users can update own profile`: 認証済みユーザーが自身のプロフィールを更新可能
- `Users can update their own username`: 認証済みユーザーが自身のユーザー名を更新可能

### HTMLファイル (html_files)

グラフィックレコーディング作品を管理するテーブル

| カラム名 | 型 | 説明 | 制約 |
|---------|-------|------------|------------|
| id | uuid | ファイルID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| user_id | uuid | 作成者ID | REFERENCES profiles(id) |
| title | text | タイトル | NOT NULL |
| description | text | 説明文 | - |
| content | text | HTML内容 | NOT NULL |
| views | integer | 閲覧数 | DEFAULT 0 |
| created_at | timestamp with time zone | 作成日時 | DEFAULT now() |
| tags | text[] | タグ配列 | DEFAULT '{}' |
| prompt_name | text | AIプロンプト名 | - |
| reference_url | text | 参考URL | - |
| opacity | numeric | 背景透明度 | DEFAULT 0.5 |

#### インデックス
- `html_files_pkey`: PRIMARY KEY (id)

#### 外部キー制約
- `html_files_user_id_fkey`: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE

#### Row Level Security (RLS)
- `HTML files are viewable by everyone`: 全ユーザーが作品を閲覧可能
- `Users can delete their own HTML files`: 認証済みユーザーが自身の作品を削除可能
- `Users can insert their own HTML files`: 認証済みユーザーが作品を投稿可能
- `Users can update their own HTML files`: 認証済みユーザーが自身の作品を更新可能

## ビュー

### ranked_files_by_views

閲覧数に基づく作品ランキングを提供するビュー

#### カラム
- id: uuid
- user_id: uuid
- title: text
- description: text
- content: text
- views: integer
- created_at: timestamp with time zone
- tags: text[]
- prompt_name: text
- reference_url: text
- username: text
- rank: bigint

## データベース関数

### get_tag_rankings()

タグの使用頻度ランキングを取得する関数

#### 戻り値
- tag: text
- usage_count: bigint
- rank: bigint

### get_prompt_rankings()

プロンプトの使用頻度ランキングを取得する関数

#### 戻り値
- prompt_name: text
- usage_count: bigint
- rank: bigint

## セキュリティ

### Row Level Security (RLS)

すべてのテーブルでRLSが有効化されており、以下のポリシーが設定されています：

1. 閲覧ポリシー
   - 全ユーザーが作品とプロフィールを閲覧可能

2. 更新ポリシー
   - 認証済みユーザーのみが自身の作品とプロフィールを更新可能

3. 削除ポリシー
   - 認証済みユーザーのみが自身の作品を削除可能

4. 挿入ポリシー
   - 認証済みユーザーのみが作品を投稿可能

### データ整合性

- 外部キー制約による参照整合性の保証
- デフォルト値の設定による一貫性の確保
- カスケード削除による関連データの適切な処理