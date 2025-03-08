import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Maximize2, Minimize2, ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser,
  faCalendarAlt,
  faEye,
  faTags,
  faRobot,
  faLink,
  faSpinner,
  faPalette,
  faPlus,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

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
  opacity: number;
  profiles: {
    email: string;
    username: string;
  };
}

export function GraphRec() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<HtmlFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFile, setEditedFile] = useState<Partial<HtmlFile>>({});
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [existingPrompts, setExistingPrompts] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [opacity, setOpacity] = useState(0.5);

  useEffect(() => {
    fetchFile();
    fetchExistingTagsAndPrompts();
  }, [id]);

  async function fetchFile() {
    try {
      const { data, error } = await supabase
        .from('html_files')
        .select(`
          *,
          profiles (email, username)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setFile(data);
      setEditedFile(data);
      setOpacity(data.opacity || 0.5);

      // Increment views only when not editing
      if (!isEditing) {
        await supabase
          .from('html_files')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      }
    } catch (err) {
      console.error('Error fetching file:', err);
      setError('グラレコの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }

  async function fetchExistingTagsAndPrompts() {
    try {
      const { data, error } = await supabase
        .from('html_files')
        .select('tags, prompt_name');

      if (error) throw error;

      const allTags = data?.flatMap(file => file.tags || []) || [];
      const uniqueTags = [...new Set(allTags)];
      setExistingTags(uniqueTags);

      const allPrompts = data?.map(file => file.prompt_name).filter((p): p is string => p !== null) || [];
      const uniquePrompts = [...new Set(allPrompts)];
      setExistingPrompts(uniquePrompts);
    } catch (err) {
      console.error('Error fetching tags and prompts:', err);
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedFile(file || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFile(file || {});
    setOpacity(file?.opacity || 0.5);
  };

  const handleSave = async () => {
    if (!file || !editedFile) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('html_files')
        .update({
          title: editedFile.title,
          description: editedFile.description,
          tags: editedFile.tags,
          prompt_name: editedFile.prompt_name,
          reference_url: editedFile.reference_url,
          opacity: opacity
        })
        .eq('id', file.id);

      if (error) throw error;

      await fetchFile();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating file:', err);
      setError('更新に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleTagAdd = (tag: string) => {
    setEditedFile(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag]
    }));
  };

  const handleTagRemove = (tagToRemove: string) => {
    setEditedFile(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleNewTagAdd = () => {
    if (newTag.trim() && !editedFile.tags?.includes(newTag.trim())) {
      handleTagAdd(newTag.trim());
      setNewTag('');
      setShowTagInput(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center font-zen text-gray-600">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-primary mr-2" />
          読み込み中...
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md font-zen">
          {error || 'グラレコが見つかりませんでした。'}
        </div>
      </div>
    );
  }

  const isOwner = user?.id === file.user_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="font-zen">戻る</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            {isEditing ? (
              <input
                type="text"
                value={editedFile.title || ''}
                onChange={(e) => setEditedFile(prev => ({ ...prev, title: e.target.value }))}
                className="text-2xl font-kaisei w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <h1 className="text-2xl font-kaisei gradient-text">{file.title}</h1>
            )}
            {isOwner && (
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-3 py-1 bg-primary hover:bg-secondary text-white rounded-md transition-colors"
                    >
                      {saving ? (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" />
                      ) : (
                        <Save className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-zen">保存</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      <span className="font-zen">キャンセル</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    <span className="font-zen">編集</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={editedFile.description || ''}
              onChange={(e) => setEditedFile(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4 font-zen"
              rows={3}
            />
          ) : (
            <p className="text-gray-600 font-zen mb-4">{file.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-secondary" />
              <span className="font-zen">
                {file.profiles?.username || file.profiles?.email.split('@')[0] || '名無し'}
              </span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-secondary" />
              <span className="font-zen">
                {new Date(file.created_at).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEye} className="mr-2 text-secondary" />
              <span className="font-zen">{file.views || 0} 回表示</span>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-zen text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faTags} className="mr-2 text-secondary" />
                  タグ
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editedFile.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-zen bg-secondary/10 text-secondary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="新しいタグを入力"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleNewTagAdd();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleNewTagAdd}
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
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    新しいタグを追加
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faRobot} className="mr-2 text-secondary" />
                  プロンプト名
                </label>
                <select
                  value={editedFile.prompt_name || ''}
                  onChange={(e) => setEditedFile(prev => ({ ...prev, prompt_name: e.target.value || null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">プロンプトなし</option>
                  {existingPrompts.map(prompt => (
                    <option key={prompt} value={prompt}>{prompt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faLink} className="mr-2 text-secondary" />
                  参考URL
                </label>
                <input
                  type="url"
                  value={editedFile.reference_url || ''}
                  onChange={(e) => setEditedFile(prev => ({ ...prev, reference_url: e.target.value || null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-zen text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faPalette} className="mr-2 text-secondary" />
                  背景の透明度
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 font-zen w-16">
                    {Math.round(opacity * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
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

              {(file.prompt_name || file.reference_url) && (
                <div className="flex flex-wrap gap-4 text-sm">
                  {file.prompt_name && (
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faRobot} className="mr-2 text-secondary" />
                      <span className="font-zen">{file.prompt_name}</span>
                    </div>
                  )}
                  {file.reference_url && (
                    <a
                      href={file.reference_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-secondary hover:text-accent"
                    >
                      <FontAwesomeIcon icon={faLink} className="mr-2" />
                      <span className="font-zen">参考URL</span>
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all"
              title={isFullscreen ? '全画面解除' : '全画面表示'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
          </div>
          <div 
            className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-[600px]'}`}
            style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
          >
            <iframe
              srcDoc={file.content}
              className="w-full h-full border-0"
              sandbox="allow-scripts"
              title={file.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}