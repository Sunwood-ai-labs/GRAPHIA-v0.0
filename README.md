<div align="center">

![Image](https://github.com/user-attachments/assets/1fb884c1-8d42-45c9-baef-d52d1a97988b)

# GRAPHIA
### Graphic Recording Application for Presenting HTML Illustrated Archives

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.7-3ECF8E?style=flat-square&logo=supabase)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

GRAPHIAは、会議、イベント、論文、資料、ブログなど、あらゆる情報をグラフィックレコーディングで可視化し、インタラクティブなHTMLグラレコとして共有できるプラットフォームです。

https://github.com/user-attachments/assets/7d984d8f-5058-44d2-8148-46e038914ab0

## 🌟 特徴

### 多様な表現
- HTMLとCSSを使用した視覚的な表現
- 会議録から論文まで、様々な情報を可視化
- インタラクティブな要素の追加が可能

### 知識の共有
- 作成したグラレコを簡単に共有
- 複雑な情報を分かりやすく伝達
- コミュニティでの知識共有を促進

### 学びの場
- 様々な分野のグラレコから学習
- 新しい表現方法やアイデアの発見
- コミュニティからのインスピレーション

## 🚀 主な機能

### 作品管理
- グラレコの投稿・編集
- タイトル、説明、タグの設定
- 参考URLの追加
- 背景の透明度調整
- AIプロンプト名の記録

### ギャラリー
- 全作品の一覧表示
- タグによるフィルタリング
- プロンプトによるフィルタリング
- 4列レイアウトでの効率的な表示
- ランダムな背景透明度による視覚的な変化

### ランキング
- 閲覧数ランキング（TOP 50）
- 人気タグランキング
- プロンプトランキング
- 検索機能付き

## 📦 インストール

```bash
# リポジトリのクローン
git clone [repository-url]

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 🔧 環境設定

1. Supabaseプロジェクトの作成
2. 環境変数の設定
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## 📝 データベース

データベースの詳細な構造とセキュリティ設定については、[DATABASE.md](./DATABASE.md)を参照してください。

## 👥 認証機能

- メールアドレスとパスワードによる登録
- ログイン/ログアウト
- プロフィール編集
- ユーザー名の設定

## 🎨 デザイン

### カラーパレット
- Primary: #F2D22E
- Secondary: #F2A922
- Accent: #F27F1B
- Warning: #F26A1B
- Dark: #59200B

### フォント
- Kaisei Decol: 見出し
- Yomogi: コンテンツテキスト
- Zen Kurenaido: 一般テキスト

## 🔒 セキュリティ

- Supabaseによる認証
- Row Level Security (RLS)の実装
- クロスサイトスクリプティング（XSS）対策
- コンテンツセキュリティポリシー

## 📱 レスポンシブデザイン

- モバイルファースト
- 4段階のブレイクポイント
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## 🌐 ブラウザサポート

- Chrome
- Firefox
- Safari
- Edge

## 🤝 コントリビューション

1. Forkする
2. フィーチャーブランチを作成する
3. 変更をコミットする
4. ブランチにプッシュする
5. Pull Requestを作成する

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👨‍💻 開発者

GRAPHIA Team

## 📞 サポート

問題や提案がある場合は、Issueを作成してください。
