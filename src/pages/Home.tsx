import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaintBrush, 
  faPalette, 
  faPencilAlt,
  faLightbulb,
  faChartPie,
  faFileAlt,
  faEye,
  faShareAlt,
  faUsers,
  faNetworkWired,
  faCheckCircle,
  faGraduationCap,
  faBookOpen,
  faMagic,
  faCopyright
} from '@fortawesome/free-solid-svg-icons';

export function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center relative mb-12">
          <FontAwesomeIcon 
            icon={faPaintBrush} 
            className="text-4xl text-primary animate-float absolute left-1/2 -ml-40 top-1/2 -translate-y-1/2"
          />
          <h1 className="text-5xl md:text-6xl font-kaisei gradient-text inline-block mb-4">
            GRAPHIA
          </h1>
          <FontAwesomeIcon 
            icon={faPalette} 
            className="text-4xl text-primary animate-float absolute left-1/2 ml-24 top-1/2 -translate-y-1/2"
          />
          <p className="text-xl font-zen text-gray-600 mb-4">
            <FontAwesomeIcon icon={faPencilAlt} className="text-secondary mr-2" />
            Graphic Recording Application for Presenting HTML Illustrated Archives
          </p>
          <div className="speech-bubble max-w-2xl mx-auto">
            会議、イベント、論文、資料、ブログなど、あらゆる情報をグラフィックレコーディングで可視化。
            インタラクティブなHTMLグラレコで、知識共有をより魅力的に。
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="flex items-center text-xl font-kaisei text-blue-800 mb-4">
              <FontAwesomeIcon icon={faLightbulb} className="text-secondary mr-2 animate-pulse-slow" />
              多様な表現
            </h2>
            <FontAwesomeIcon icon={faChartPie} className="text-5xl text-warning mb-4 mx-auto block" />
            <p className="font-zen text-gray-700">
              会議録から論文まで、
              <span className="font-bold text-blue-800">
                様々な情報
                <FontAwesomeIcon icon={faFileAlt} className="text-secondary ml-1" />
              </span>
              をHTMLとCSSを使って
              <span className="font-bold text-blue-800">
                視覚的
                <FontAwesomeIcon icon={faEye} className="text-secondary ml-1" />
              </span>
              に表現できます。
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="flex items-center text-xl font-kaisei text-blue-800 mb-4">
              <FontAwesomeIcon icon={faShareAlt} className="text-secondary mr-2 animate-pulse-slow" />
              知識の共有
            </h2>
            <FontAwesomeIcon icon={faUsers} className="text-5xl text-warning mb-4 mx-auto block" />
            <p className="font-zen text-gray-700">
              作成したグラレコを通じて、
              <span className="font-bold text-blue-800">
                複雑な情報
                <FontAwesomeIcon icon={faNetworkWired} className="text-secondary ml-1" />
              </span>
              を
              <span className="font-bold text-blue-800">
                分かりやすく
                <FontAwesomeIcon icon={faCheckCircle} className="text-secondary ml-1" />
              </span>
              伝えることができます。
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="flex items-center text-xl font-kaisei text-blue-800 mb-4">
              <FontAwesomeIcon icon={faGraduationCap} className="text-secondary mr-2 animate-pulse-slow" />
              学びの場
            </h2>
            <FontAwesomeIcon icon={faBookOpen} className="text-5xl text-warning mb-4 mx-auto block" />
            <p className="font-zen text-gray-700">
              様々な分野のグラレコから
              <span className="font-bold text-blue-800">
                新しい表現方法
                <FontAwesomeIcon icon={faMagic} className="text-secondary ml-1" />
              </span>
              や
              <span className="font-bold text-blue-800">
                アイデア
                <FontAwesomeIcon icon={faLightbulb} className="text-secondary ml-1" />
              </span>
              を発見しましょう。
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-zen text-lg transition-all hover:shadow-lg hover:-translate-y-1"
          >
            グラレコを始める
          </Link>
          <Link
            to="/gallery"
            className="px-8 py-3 bg-gradient-to-r from-accent to-warning text-white rounded-full font-zen text-lg transition-all hover:shadow-lg hover:-translate-y-1"
          >
            作品を見る
          </Link>
        </div>

        <footer className="text-center mt-16 text-sm font-yomogi text-gray-600">
          <p>このグラフィックレコーディングは{new Date().toLocaleDateString('ja-JP')}に作成されました</p>
          <p className="mt-2">
            <FontAwesomeIcon icon={faCopyright} className="mr-2" />
            2025 GRAPHIA
          </p>
        </footer>
      </div>
    </div>
  );
}