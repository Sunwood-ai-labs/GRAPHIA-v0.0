import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Upload as UploadIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaintBrush,
  faFileUpload,
  faInfoCircle,
  faImage,
  faSpinner,
  faTags,
  faRobot,
  faLink,
  faPlus,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

export function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [promptName, setPromptName] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [existingPrompts, setExistingPrompts] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');

  useEffect(() => {
    fetchExistingTagsAndPrompts();
  }, []);

  async function fetchExistingTagsAndPrompts() {
    try {
      const { data, error } = await supabase
        .from('html_files')
        .select('tags, prompt_name');

      if (error) throw error;

      // Extract unique tags
      const allTags = data?.flatMap(file => file.tags || []) || [];
      const uniqueTags = [...new Set(allTags)];
      setExistingTags(uniqueTags);

      // Extract unique prompts
      const allPrompts = data?.map(file => file.prompt_name).filter((p): p is string => p !== null) || [];
      const uniquePrompts = [...new Set(allPrompts)];
      setExistingPrompts(uniquePrompts);
    } catch (err) {
      console.error('Error fetching tags and prompts:', err);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    setLoading(true);
    setError('');

    try {
      const content = await file.text();

      const { error: uploadError } = await supabase
        .from('html_files')
        .insert([{
          user_id: user.id,
          title,
          description,
          content,
          tags,
          prompt_name: promptName || null,
          reference_url: referenceUrl || null
        }]);

      if (uploadError) throw uploadError;

      navigate('/gallery');
    } catch (err) {
      console.error('Upload error:', err);
      setError('グラレコのアップロードに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setPromptName(prompt);
    setShowPromptInput(false);
  };

  const handleAddNewPrompt = () => {
    if (newPrompt.trim()) {
      setPromptName(newPrompt.trim());
      setNewPrompt('');
      setShowPromptInput(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center relative mb-12">
          <FontAwesomeIcon 
            icon={faPaintBrush} 
            className="text-4xl text-primary animate-float absolute left-1/2 -ml-40 top-1/2 -translate-y-1/2"
          />
          <h1 className="text-5xl font-kaisei gradient-text inline-block mb-4">グラレコを投稿</h1>
          <FontAwesomeIcon 
            icon={faFileUpload} 
            className="text-4xl text-primary animate-float absolute left-1/2 ml-24 top-1/2 -translate-y-1/2"
          />
          <div className="speech-bubble max-w-2xl mx-auto mt-4">
            あなたのグラレコ作品を共有して、みんなとアイデアを交換しよう！
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 font-zen">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="title" className="flex items-center text-sm font-zen text-gray-700 mb-1">
              <FontAwesomeIcon icon={faImage} className="mr-2 text-secondary" />
              タイトル
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
              placeholder="グラレコのタイトルを入力"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="flex items-center text-sm font-zen text-gray-700 mb-1">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-secondary" />
              説明（元となった会議、資料、論文などの情報）
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 h-32"
              required
              placeholder="グラレコの説明や元となった情報について記入してください"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-zen text-gray-700 mb-1">
              <FontAwesomeIcon icon={faTags} className="mr-2 text-secondary" />
              タグ
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-zen bg-secondary/10 text-secondary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-secondary hover:text-warning"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            {showTagInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/70 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="新しいタグを入力"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-accent transition-colors"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTagInput(false);
                    setNewTag('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {existingTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className={`px-2.5 py-1 rounded-full text-sm font-zen transition-colors ${
                      tags.includes(tag)
                        ? 'bg-secondary/10 text-secondary cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-secondary/10 hover:text-secondary'
                    }`}
                    disabled={tags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="px-2.5 py-1 rounded-full text-sm font-zen bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  新しいタグを追加
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-zen text-gray-700 mb-1">
              <FontAwesomeIcon icon={faRobot} className="mr-2 text-secondary" />
              プロンプト名（AIツールを使用した場合）
            </label>
            {promptName && (
              <div className="mb-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-zen bg-secondary/10 text-secondary">
                  {promptName}
                  <button
                    type="button"
                    onClick={() => setPromptName('')}
                    className="ml-1 text-secondary hover:text-warning"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}
            {showPromptInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/70 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="新しいプロンプト名を入力"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewPrompt();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddNewPrompt}
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-accent transition-colors"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPromptInput(false);
                    setNewPrompt('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            ) : !promptName && (
              <div className="flex flex-wrap gap-2">
                {existingPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handlePromptSelect(prompt)}
                    className="px-2.5 py-1 rounded-full text-sm font-zen bg-gray-100 text-gray-600 hover:bg-secondary/10 hover:text-secondary transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowPromptInput(true)}
                  className="px-2.5 py-1 rounded-full text-sm font-zen bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  新しいプロンプトを追加
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="referenceUrl" className="flex items-center text-sm font-zen text-gray-700 mb-1">
              <FontAwesomeIcon icon={faLink} className="mr-2 text-secondary" />
              参考URL
            </label>
            <input
              type="url"
              id="referenceUrl"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label htmlFor="file" className="flex items-center text-sm font-zen text-gray-700 mb-1">
              <FontAwesomeIcon icon={faFileUpload} className="mr-2 text-secondary" />
              HTMLファイル
            </label>
            <div className="relative">
              <input
                type="file"
                id="file"
                accept=".html"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-zen file:bg-primary file:text-white hover:file:bg-secondary"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-primary to-secondary text-white font-zen py-3 px-4 rounded-full transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                アップロード中...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                グラレコを投稿
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}