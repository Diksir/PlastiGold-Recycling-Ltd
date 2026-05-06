'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, LogOut, Save, Trash2, Upload } from 'lucide-react';
import { apiRequest, authHeaders } from './api';
import { defaultContent, tokenKey } from './siteData';
import useContent from './useContent';

const buttonBase = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 font-black transition disabled:cursor-not-allowed disabled:opacity-55';
const primaryButton = `${buttonBase} bg-[#7BA717] text-white shadow-[0_14px_30px_rgba(123,167,23,0.24)] hover:bg-[#6a8f13]`;
const secondaryButton = `${buttonBase} border border-[#9DB36B]/35 bg-white text-[#5A7C2E] hover:bg-[#F0F9E3]`;
const iconButton = 'grid h-11 w-11 flex-none place-items-center rounded-full border border-[#9DB36B]/35 bg-white text-[#5A7C2E] disabled:cursor-not-allowed disabled:opacity-55';
const fieldClass = 'min-h-12 w-full min-w-0 rounded-lg border border-[#9DB36B]/35 bg-white px-3 py-3 text-brand-ink outline-none transition focus:border-[#7BA717] focus:ring-2 focus:ring-[#9DB36B]/30';
const labelClass = 'grid min-w-0 gap-2 font-black text-[#5A7C2E]';
const formGridClass = 'grid w-full min-w-0 gap-4';
const responsiveFormGridClass = `${formGridClass} md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end`;

export default function AdminPage() {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem(tokenKey) || '');
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem(tokenKey, newToken);
    setToken(newToken);
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        headers: authHeaders(token),
      });
    } catch {
      // Clearing local auth is still the right recovery if the session expired.
    }
    localStorage.removeItem(tokenKey);
    setToken('');
  };

  return token ? <AdminDashboard token={token} onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />;
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@plastigoldrecycling.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submitLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      onLogin(data.token);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen overflow-x-hidden bg-[#F3F9E9] px-4 py-8 sm:px-6 lg:place-items-center lg:px-8">
      <section className="mx-auto grid w-full max-w-md overflow-hidden rounded-lg border border-[#9DB36B]/30 bg-white shadow-2xl md:max-w-3xl lg:max-w-5xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#E9F3D6] p-5 sm:p-7 lg:flex lg:flex-col lg:justify-between lg:p-8">
          <div>
            <img className="h-16 w-fit" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd" />
            <h1 className="mt-5 text-3xl font-black text-[#5A7C2E] sm:text-4xl">Admin Login</h1>
          </div>
          <p className="mt-3 max-w-sm leading-7 text-brand-muted lg:mt-10">Sign in to update homepage slides and gallery content.</p>
        </div>
        <div className="min-w-0 p-5 sm:p-7 lg:p-8">
          <form className={formGridClass} onSubmit={submitLogin}>
            <label className={labelClass}>
              Email address
              <input className={fieldClass} value={email} type="email" onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className={labelClass}>
              Password
              <input className={fieldClass} value={password} type="password" onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <button className={`${primaryButton} w-full`} type="submit" disabled={busy}>
              Login
            </button>
          </form>
          {message && <p className="mt-4 font-black text-red-700">{message}</p>}
          <a className={`${secondaryButton} mt-5 w-full`} href="/">
            Back to Website
          </a>
        </div>
      </section>
    </main>
  );
}

function AdminDashboard({ token, onLogout }) {
  const { content, loading, error, loadContent, setContent } = useContent();
  const [heroDraft, setHeroDraft] = useState(defaultContent.hero);
  const [storyDraft, setStoryDraft] = useState(defaultContent.story);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setHeroDraft(content.hero);
  }, [content.hero]);

  useEffect(() => {
    setStoryDraft(content.story || defaultContent.story);
  }, [content.story]);

  const guarded = async (task, successMessage) => {
    setBusy(true);
    setMessage('');
    try {
      await task();
      setMessage(successMessage);
      await loadContent();
    } catch (err) {
      setMessage(err.message);
      if (err.message.includes('login')) {
        localStorage.removeItem(tokenKey);
      }
    } finally {
      setBusy(false);
    }
  };

  const saveHero = () => guarded(
    () => apiRequest('/api/content/hero', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify(heroDraft),
    }),
    'Homepage text saved.',
  );

  const saveStory = (formData) => guarded(
    () => apiRequest('/api/content/story', {
      method: 'PATCH',
      headers: authHeaders(token),
      body: formData,
    }),
    'Story sections saved.',
  );

  const moveSlide = async (index, direction) => {
    const next = [...content.slides];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setContent((current) => ({ ...current, slides: next }));
    await guarded(
      () => apiRequest('/api/slides/order', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
        body: JSON.stringify({ ids: next.map((slide) => slide.id) }),
      }),
      'Slide order saved.',
    );
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F3F9E9] px-4 py-6 sm:px-6 lg:px-12">
      <section className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href="/">
            <img className="h-14 w-fit" src="/assets/plastigold-logo.svg" alt="PlastiGold Recycling Ltd" />
          </a>
          <div className="grid gap-3 sm:flex sm:items-center">
            <a className={secondaryButton} href="/">
              View Website
            </a>
            <button className={primaryButton} onClick={onLogout}>
              Logout <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="my-7">
          <h1 className="text-3xl font-black text-[#5A7C2E] sm:text-4xl">Website Admin</h1>
          <p className="mt-2 max-w-2xl leading-7 text-brand-muted">Control homepage text, hero slides, slide order, and gallery captions.</p>
          {loading && <p className="mt-3 font-black text-[#5A7C2E]">Loading admin content...</p>}
          {error && <p className="mt-3 font-black text-red-700">{error}</p>}
          {message && <p className={`mt-3 font-black ${message.includes('failed') || message.includes('required') ? 'text-red-700' : 'text-[#5A7C2E]'}`}>{message}</p>}
        </div>

        <AdminSection title="Homepage Text" copy="Change the main company title and tagline displayed on the first screen.">
          <div className={responsiveFormGridClass}>
            <label className={labelClass}>
              Main title
              <input className={fieldClass} value={heroDraft.title} onChange={(event) => setHeroDraft({ ...heroDraft, title: event.target.value })} />
            </label>
            <label className={labelClass}>
              Tagline
              <input className={fieldClass} value={heroDraft.tagline} onChange={(event) => setHeroDraft({ ...heroDraft, tagline: event.target.value })} />
            </label>
            <button className={`${primaryButton} w-full lg:w-auto`} onClick={saveHero} disabled={busy}>
              Save Text <Save size={18} />
            </button>
          </div>
        </AdminSection>

        <AdminSection title="Story Sections" copy="Edit the large image and write-up section, plus the follow-our-story video area on the homepage.">
          <StorySectionEditor storyDraft={storyDraft} setStoryDraft={setStoryDraft} onSave={saveStory} busy={busy} />
        </AdminSection>

        <AdminSection title="Hero Slides" copy="Upload, delete, rename, and rearrange the images used in the top homepage slider.">
          <UploadPanel title="Add Slide" buttonText="Upload Slide" onUpload={(formData) => guarded(() => apiRequest('/api/slides', { method: 'POST', headers: authHeaders(token), body: formData }), 'Slide uploaded.')} />
          <div className="grid gap-4">
            {content.slides.map((slide, index) => (
              <SlideAdminItem key={slide.id} slide={slide} index={index} total={content.slides.length} busy={busy} onMove={moveSlide} onRename={(title) => guarded(() => apiRequest(`/api/slides/${slide.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders(token) }, body: JSON.stringify({ title }) }), 'Slide title saved.')} onDelete={() => guarded(() => apiRequest(`/api/slides/${slide.id}`, { method: 'DELETE', headers: authHeaders(token) }), 'Slide deleted.')} />
            ))}
          </div>
        </AdminSection>

        <AdminSection title="Gallery Images" copy="Add images for the gallery and write the text that appears below each image.">
          <UploadPanel title="Add Gallery Image" buttonText="Upload Gallery Image" includeCaption onUpload={(formData) => guarded(() => apiRequest('/api/gallery', { method: 'POST', headers: authHeaders(token), body: formData }), 'Gallery image uploaded.')} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.gallery.map((item) => (
              <GalleryAdminItem key={item.id} item={item} busy={busy} onSave={(draft) => guarded(() => apiRequest(`/api/gallery/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders(token) }, body: JSON.stringify(draft) }), 'Gallery text saved.')} onDelete={() => guarded(() => apiRequest(`/api/gallery/${item.id}`, { method: 'DELETE', headers: authHeaders(token) }), 'Gallery image deleted.')} />
            ))}
          </div>
        </AdminSection>
      </section>
    </main>
  );
}

function AdminSection({ title, copy, children }) {
  return (
    <section className="mb-6 grid min-w-0 gap-5 overflow-hidden rounded-lg border border-[#9DB36B]/30 bg-white/90 p-4 shadow-sm sm:p-6">
      <div className="min-w-0">
        <h2 className="text-2xl font-black text-[#5A7C2E]">{title}</h2>
        <p className="mt-2 leading-7 text-brand-muted">{copy}</p>
      </div>
      {children}
    </section>
  );
}

function StorySectionEditor({ storyDraft, setStoryDraft, onSave, busy }) {
  const [aboutImage, setAboutImage] = useState(null);
  const [videoPoster, setVideoPoster] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const updateAbout = (key, value) => {
    setStoryDraft((current) => ({
      ...current,
      about: { ...current.about, [key]: value },
    }));
  };

  const updateVideo = (key, value) => {
    setStoryDraft((current) => ({
      ...current,
      video: { ...current.video, [key]: value },
    }));
  };

  const submitStory = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('aboutEyebrow', storyDraft.about.eyebrow);
    formData.append('aboutTitle', storyDraft.about.title);
    formData.append('aboutHighlight', storyDraft.about.highlight);
    formData.append('aboutBody', storyDraft.about.body);
    formData.append('aboutQuote', storyDraft.about.quote);
    formData.append('videoTitle', storyDraft.video.title);
    formData.append('videoCaption', storyDraft.video.caption);
    formData.append('videoUrl', storyDraft.video.videoUrl);
    if (aboutImage) formData.append('aboutImage', aboutImage);
    if (videoPoster) formData.append('videoPoster', videoPoster);
    if (videoFile) formData.append('videoFile', videoFile);
    await onSave(formData);
    setAboutImage(null);
    setVideoPoster(null);
    setVideoFile(null);
  };

  return (
    <form className="grid gap-6" onSubmit={submitStory}>
      <div className="grid gap-5 rounded-lg border border-[#9DB36B]/30 bg-white p-4 sm:p-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="grid gap-3">
          <h3 className="font-black text-[#5A7C2E]">Image and Write-up</h3>
          <img className="aspect-[1.38] w-full rounded-lg object-cover" src={storyDraft.about.image} alt={storyDraft.about.title} />
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#9DB36B]/60 bg-[#F3F9E9] px-4 py-3 font-black text-[#5A7C2E]">
            <Upload size={20} />
            <span className="min-w-0 truncate">{aboutImage ? aboutImage.name : 'Replace section image'}</span>
            <input className="hidden" type="file" accept="image/*" onChange={(event) => setAboutImage(event.target.files?.[0] || null)} />
          </label>
        </div>
        <div className="grid min-w-0 gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className={labelClass}>
              Small label
              <input className={fieldClass} value={storyDraft.about.eyebrow} onChange={(event) => updateAbout('eyebrow', event.target.value)} />
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              Heading
              <input className={fieldClass} value={storyDraft.about.title} onChange={(event) => updateAbout('title', event.target.value)} />
            </label>
          </div>
          <label className={labelClass}>
            Highlighted word
            <input className={fieldClass} value={storyDraft.about.highlight} onChange={(event) => updateAbout('highlight', event.target.value)} placeholder="Example: value" />
          </label>
          <label className={labelClass}>
            Write-up
            <textarea className={`${fieldClass} min-h-44 resize-y`} value={storyDraft.about.body} onChange={(event) => updateAbout('body', event.target.value)} />
          </label>
          <label className={labelClass}>
            Quote
            <textarea className={`${fieldClass} min-h-28 resize-y`} value={storyDraft.about.quote} onChange={(event) => updateAbout('quote', event.target.value)} />
          </label>
        </div>
      </div>

      <div className="grid gap-5 rounded-lg border border-[#9DB36B]/30 bg-white p-4 sm:p-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="grid gap-3">
          <h3 className="font-black text-[#5A7C2E]">Story Video</h3>
          {storyDraft.video.videoUrl ? (
            <video className="aspect-video w-full rounded-lg object-cover" controls poster={storyDraft.video.poster}>
              <source src={storyDraft.video.videoUrl} />
            </video>
          ) : (
            <img className="aspect-video w-full rounded-lg object-cover" src={storyDraft.video.poster} alt={storyDraft.video.title} />
          )}
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#9DB36B]/60 bg-[#F3F9E9] px-4 py-3 font-black text-[#5A7C2E]">
            <Upload size={20} />
            <span className="min-w-0 truncate">{videoPoster ? videoPoster.name : 'Replace video poster'}</span>
            <input className="hidden" type="file" accept="image/*" onChange={(event) => setVideoPoster(event.target.files?.[0] || null)} />
          </label>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#9DB36B]/60 bg-[#F3F9E9] px-4 py-3 font-black text-[#5A7C2E]">
            <Upload size={20} />
            <span className="min-w-0 truncate">{videoFile ? videoFile.name : 'Upload video file'}</span>
            <input className="hidden" type="file" accept="video/*" onChange={(event) => setVideoFile(event.target.files?.[0] || null)} />
          </label>
        </div>
        <div className="grid min-w-0 gap-4">
          <label className={labelClass}>
            Video heading
            <input className={fieldClass} value={storyDraft.video.title} onChange={(event) => updateVideo('title', event.target.value)} />
          </label>
          <label className={labelClass}>
            Video caption
            <textarea className={`${fieldClass} min-h-28 resize-y`} value={storyDraft.video.caption} onChange={(event) => updateVideo('caption', event.target.value)} />
          </label>
          <label className={labelClass}>
            Video URL
            <input className={fieldClass} value={storyDraft.video.videoUrl} onChange={(event) => updateVideo('videoUrl', event.target.value)} placeholder="Optional video URL or uploaded video path" />
          </label>
        </div>
      </div>

      <button className={`${primaryButton} w-full sm:w-fit`} type="submit" disabled={busy}>
        Save Story Sections <Save size={18} />
      </button>
    </form>
  );
}

function UploadPanel({ title, buttonText, includeCaption = false, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [titleText, setTitleText] = useState('');
  const [caption, setCaption] = useState('');
  const previewUrl = useMemo(() => (selectedFile ? URL.createObjectURL(selectedFile) : ''), [selectedFile]);

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const submitUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', titleText || selectedFile.name);
    if (includeCaption) formData.append('caption', caption);
    await onUpload(formData);
    setSelectedFile(null);
    setTitleText('');
    setCaption('');
  };

  return (
    <form className="grid min-w-0 gap-4 overflow-hidden rounded-lg border border-[#9DB36B]/30 bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end" onSubmit={submitUpload}>
      <div className="flex items-center gap-3 lg:block">
        <ImagePlus className="text-[#7BA717]" size={28} />
        <h3 className="font-black text-[#5A7C2E] lg:mt-3">{title}</h3>
      </div>
      <label className={labelClass}>
        Title
        <input className={fieldClass} value={titleText} onChange={(event) => setTitleText(event.target.value)} placeholder="Image title" />
      </label>
      {includeCaption && (
        <label className={`${labelClass} lg:col-span-1`}>
          Caption
          <textarea className={`${fieldClass} min-h-24 resize-y`} value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Text to show below the image" />
        </label>
      )}
      <div className="grid min-w-0 gap-3 md:col-span-2 lg:col-span-1">
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#9DB36B]/60 bg-[#F3F9E9] px-4 py-3 font-black text-[#5A7C2E]">
          <Upload size={20} />
          <span className="min-w-0 truncate">{selectedFile ? selectedFile.name : 'Choose an image'}</span>
          <input className="hidden" type="file" accept="image/*" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
        </label>
        <button className={`${primaryButton} w-full`} type="submit" disabled={!selectedFile}>
          {buttonText}
        </button>
      </div>
      {previewUrl && <img className="aspect-[1.35] w-full rounded-lg object-cover lg:col-span-full" src={previewUrl} alt="Selected preview" />}
    </form>
  );
}

function SlideAdminItem({ slide, index, total, busy, onMove, onRename, onDelete }) {
  const [title, setTitle] = useState(slide.title);

  useEffect(() => {
    setTitle(slide.title);
  }, [slide.title]);

  return (
    <article className="grid min-w-0 overflow-hidden rounded-lg border border-[#9DB36B]/30 bg-white shadow-sm md:grid-cols-[210px_minmax(0,1fr)]">
      <img className="aspect-[1.4] h-full w-full object-cover md:aspect-auto" src={slide.image} alt={slide.title} />
      <div className="grid min-w-0 gap-4 p-4">
        <label className={labelClass}>
          Slide title
          <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button className={iconButton} disabled={busy || index === 0} onClick={() => onMove(index, -1)} aria-label="Move slide up"><ArrowUp size={18} /></button>
          <button className={iconButton} disabled={busy || index === total - 1} onClick={() => onMove(index, 1)} aria-label="Move slide down"><ArrowDown size={18} /></button>
          <button className={`${secondaryButton} flex-1 sm:flex-none`} disabled={busy} onClick={() => onRename(title)}>Save</button>
          <button className={`${iconButton} text-red-700`} disabled={busy || total <= 1} onClick={onDelete} aria-label="Delete slide"><Trash2 size={18} /></button>
        </div>
      </div>
    </article>
  );
}

function GalleryAdminItem({ item, busy, onSave, onDelete }) {
  const [draft, setDraft] = useState({ title: item.title, caption: item.caption || '' });

  useEffect(() => {
    setDraft({ title: item.title, caption: item.caption || '' });
  }, [item.title, item.caption]);

  return (
    <article className="min-w-0 overflow-hidden rounded-lg border border-[#9DB36B]/30 bg-white shadow-sm">
      <img className="aspect-[1.25] w-full object-cover" src={item.image} alt={item.title} />
      <div className="grid min-w-0 gap-4 p-4">
        <label className={labelClass}>
          Title
          <input className={fieldClass} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </label>
        <label className={labelClass}>
          Caption
          <textarea className={`${fieldClass} min-h-24 resize-y`} value={draft.caption} onChange={(event) => setDraft({ ...draft, caption: event.target.value })} />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button className={`${secondaryButton} flex-1`} disabled={busy} onClick={() => onSave(draft)}>Save Text</button>
          <button className={`${iconButton} text-red-700`} disabled={busy} onClick={onDelete} aria-label="Delete gallery image"><Trash2 size={18} /></button>
        </div>
      </div>
    </article>
  );
}
