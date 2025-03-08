import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy,
  faEye,
  faTags,
  faRobot,
  faChartLine,
  faMedal,
  faAward,
  faSpinner,
  faSearch,
  faSync
} from '@fortawesome/free-solid-svg-icons';

interface RankedFile {
  id: string;
  title: string;
  views: number;
  email: string;
  rank: number;
}

interface TagRanking {
  tag: string;
  usage_count: number;
  rank: number;
}

interface PromptRanking {
  prompt_name: string;
  usage_count: number;
  rank: number;
}

export function Rankings() {
  const navigate = useNavigate();
  const [topFiles, setTopFiles] = useState<RankedFile[]>([]);
  const [topTags, setTopTags] = useState<TagRanking[]>([]);
  const [topPrompts, setTopPrompts] = useState<PromptRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchRankings();
  }, [retryCount]);

  async function fetchRankings() {
    setLoading(true);
    setError('');

    try {
      const [filesData, tagsData, promptsData] = await Promise.all([
        supabase
          .from('ranked_files_by_views')
          .select('id, title, views, email, rank')
          .order('rank', { ascending: true })
          .limit(50),
        supabase.rpc('get_tag_rankings')
          .limit(50),
        supabase.rpc('get_prompt_rankings')
          .limit(50)
      ]);

      // Check for errors in each request
      const errors = [];
      if (filesData.error) errors.push('ファイルランキング');
      if (tagsData.error) errors.push('タグランキング');
      if (promptsData.error) errors.push('プロンプトランキング');

      if (errors.length > 0) {
        throw new Error(`${errors.join('、')}の取得に失敗しました`);
      }

      setTopFiles(filesData.data || []);
      setTopTags(tagsData.data || []);
      setTopPrompts(promptsData.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError('ランキングの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleFileClick = (file: RankedFile) => {
    navigate(`/graphrec/${file.id}`);
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />;
      case 2:
        return <FontAwesomeIcon icon={faMedal} className="text-gray-400" />;
      case 3:
        return <FontAwesomeIcon icon={faAward} className="text-amber-600" />;
      default:
        return <span className="text-gray-500">{rank}</span>;
    }
  };

  const filteredFiles = searchTerm
    ? topFiles.filter(file => 
        file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : topFiles;

  const filteredTags = searchTerm
    ? topTags.filter(tag => 
        tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : topTags;

  const filteredPrompts = searchTerm
    ? topPrompts.filter(prompt => 
        prompt.prompt_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : topPrompts;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center font-zen text-gray-600">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-primary mr-2" />
          ランキング集計中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <p className="text-red-500 font-zen mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md transition-colors font-zen"
          >
            <FontAwesomeIcon icon={faSync} className="mr-2" />
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center relative mb-12">
        <FontAwesomeIcon 
          icon={faTrophy} 
          className="text-4xl text-primary animate-float absolute left-1/2 -ml-40 top-1/2 -translate-y-1/2"
        />
        <h1 className="text-5xl font-kaisei gradient-text inline-block mb-4">ランキング TOP 50</h1>
        <FontAwesomeIcon 
          icon={faChartLine} 
          className="text-4xl text-primary animate-float absolute left-1/2 ml-24 top-1/2 -translate-y-1/2"
        />
        <div className="speech-bubble max-w-2xl mx-auto mt-4">
          人気のグラレコ、よく使われているタグ、プロンプトをチェックしよう！
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="タイトル、メールアドレス、タグ、プロンプトで検索..."
            className="w-full px-4 py-2 pl-10 bg-white/70 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 閲覧数ランキング */}
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-kaisei text-dark mb-4 flex items-center">
            <FontAwesomeIcon icon={faEye} className="text-secondary mr-2" />
            閲覧数ランキング
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredFiles.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-8 flex-shrink-0 text-center">{getMedalIcon(file.rank)}</span>
                  <div className="min-w-0">
                    <p className="font-zen truncate">{file.title}</p>
                    <p className="text-xs text-gray-500 truncate">{file.email.split('@')[0]}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex-shrink-0">
                  {file.views}回
                </div>
              </div>
            ))}
            {filteredFiles.length === 0 && (
              <p className="text-center text-gray-500 font-zen py-4">
                該当するグラレコが見つかりません
              </p>
            )}
          </div>
        </div>

        {/* タグランキング */}
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-kaisei text-dark mb-4 flex items-center">
            <FontAwesomeIcon icon={faTags} className="text-secondary mr-2" />
            人気タグランキング
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredTags.map((tag) => (
              <div key={tag.tag} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="w-8 text-center">{getMedalIcon(tag.rank)}</span>
                  <span className="font-zen">{tag.tag}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {tag.usage_count}件
                </div>
              </div>
            ))}
            {filteredTags.length === 0 && (
              <p className="text-center text-gray-500 font-zen py-4">
                該当するタグが見つかりません
              </p>
            )}
          </div>
        </div>

        {/* プロンプトランキング */}
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-kaisei text-dark mb-4 flex items-center">
            <FontAwesomeIcon icon={faRobot} className="text-secondary mr-2" />
            プロンプトランキング
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredPrompts.map((prompt) => (
              <div key={prompt.prompt_name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="w-8 text-center">{getMedalIcon(prompt.rank)}</span>
                  <span className="font-zen">{prompt.prompt_name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {prompt.usage_count}件
                </div>
              </div>
            ))}
            {filteredPrompts.length === 0 && (
              <p className="text-center text-gray-500 font-zen py-4">
                該当するプロンプトが見つかりません
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}