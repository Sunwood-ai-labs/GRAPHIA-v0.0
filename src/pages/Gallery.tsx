import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaintBrush, 
  faImage, 
  faCalendarAlt,
  faUser,
  faEye as faEyeIcon,
  faTags,
  faRobot,
  faLink,
  faFilter,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

interface HtmlFile {
  id: string;
  title: string;
  description: string;
  content: string;
  views: number;
  created_at: string;
  user_id: string;
  tags: string[];
  prompt_name: string | null;
  reference_url: string | null;
  profiles: {
    email: string;
    username: string;
  };
}

export function Gallery() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<HtmlFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [uniquePrompts, setUniquePrompts] = useState<string[]>([]);

  useEffect(() => {
    fetchFiles();
  }, [selectedTag, selectedPrompt]);

  async function fetchFiles() {
    try {
      let query = supabase
        .from('html_files')
        .select(`
          *,
          profiles (email, username)
        `)
        .order('created_at', { ascending: false });

      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }

      if (selectedPrompt) {
        query = query.eq('prompt_name', selectedPrompt);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setFiles(data || []);

      // Extract unique tags and prompts
      const allTags = data?.flatMap(file => file.tags || []) || [];
      const allPrompts = data?.map(file => file.prompt_name).filter((p): p is string => p !== null) || [];
      
      setUniqueTags([...new Set(allTags)]);
      setUniquePrompts([...new Set(allPrompts)]);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('グラレコの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  const handleFileClick = (file: HtmlFile) => {
    navigate(`/graphrec/${file.id}`);
  };

  const clearFilters = () => {
    setSelectedTag(null);
    setSelectedPrompt(null);
  };

  const getRandomOpacity = () => {
    return (Math.random() * 0.4 + 0.3).toFixed(2); // Between 0.3 and 0.7
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center font-zen text-gray-600">
          <FontAwesomeIcon icon={faPaintBrush} className="animate-spin text-2xl text-primary mr-2" />
          読み込み中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md font-zen">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center relative mb-12">
        <FontAwesomeIcon 
          icon={faPaintBrush} 
          className="text-4xl text-primary animate-float absolute left-1/2 -ml-40 top-1/2 -translate-y-1/2"
        />
        <h1 className="text-5xl font-kaisei gradient-text inline-block mb-4">グラレコギャラリー</h1>
        <FontAwesomeIcon 
          icon={faImage} 
          className="text-4xl text-primary animate-float absolute left-1/2 ml-24 top-1/2 -translate-y-1/2"
        />
        <div className="speech-bubble max-w-2xl mx-auto mt-4">
          みんなのグラレコ作品を見て、新しいアイデアやインスピレーションを得よう！
        </div>
      </div>

      <div className="mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-kaisei text-dark flex items-center">
            <FontAwesomeIcon icon={faFilter} className="text-secondary mr-2" />
            フィルター
          </h2>
          {(selectedTag || selectedPrompt) && (
            <button
              onClick={clearFilters}
              className="text-sm font-zen text-warning hover:text-accent flex items-center"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
              フィルターをクリア
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-zen text-gray-700 mb-2">
              <FontAwesomeIcon icon={faTags} className="mr-2 text-secondary" />
              タグでフィルター
            </label>
            <select
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">すべてのタグ</option>
              {uniqueTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-zen text-gray-700 mb-2">
              <FontAwesomeIcon icon={faRobot} className="mr-2 text-secondary" />
              プロンプトでフィルター
            </label>
            <select
              value={selectedPrompt || ''}
              onChange={(e) => setSelectedPrompt(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">すべてのプロンプト</option>
              {uniquePrompts.map(prompt => (
                <option key={prompt} value={prompt}>{prompt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center font-zen text-gray-600">
          {selectedTag || selectedPrompt ? (
            <>
              選択したフィルター条件に一致するグラレコ作品が見つかりませんでした。
              <button
                onClick={clearFilters}
                className="text-primary hover:text-secondary block mx-auto mt-2"
              >
                フィルターをクリアする
              </button>
            </>
          ) : (
            'まだグラレコ作品がアップロードされていません。'
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((file) => {
            const opacity = getRandomOpacity();
            return (
              <div 
                key={file.id} 
                className={`bg-white backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1`}
                style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
                onClick={() => handleFileClick(file)}
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold font-kaisei text-dark mb-2">{file.title}</h2>
                  <p className="text-sm font-zen text-gray-600 mb-4">{file.description}</p>
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {file.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-zen bg-secondary/10 text-secondary"
                        >
                          <FontAwesomeIcon icon={faTags} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faEyeIcon} className="mr-1 text-secondary" />
                      <span>{file.views || 0} 回表示</span>
                    </div>
                    {file.prompt_name && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRobot} className="mr-1 text-secondary" />
                        <span>{file.prompt_name}</span>
                      </div>
                    )}
                    {file.reference_url && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faLink} className="mr-1 text-secondary" />
                        <span>参考URL</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`bg-gray-50/50 px-6 py-3 border-t border-gray-100`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-zen text-gray-500 flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-secondary" />
                      {file.profiles?.username || file.profiles?.email.split('@')[0] || '名無し'}
                    </p>
                    <p className="text-sm font-zen text-gray-500 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-secondary" />
                      {new Date(file.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}