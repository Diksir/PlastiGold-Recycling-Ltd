import { requireAdmin } from '@/lib/auth';
import { defaultContent, readContent, removeUploadedFileIfUnused, saveMediaFile, writeContent } from '@/lib/content';
import { errorResponse, json, unauthorized } from '@/lib/responses';

const stringValue = (formData, key, fallback = '') => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : fallback;
};

const fileValue = (formData, key) => {
  const value = formData.get(key);
  return value && typeof value !== 'string' && value.size > 0 ? value : null;
};

export async function PATCH(request) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const content = await readContent();
    const currentStory = {
      about: { ...defaultContent.story.about, ...(content.story?.about || {}) },
      video: { ...defaultContent.story.video, ...(content.story?.video || {}) },
    };

    const nextStory = {
      about: {
        ...currentStory.about,
        eyebrow: stringValue(formData, 'aboutEyebrow', currentStory.about.eyebrow),
        title: stringValue(formData, 'aboutTitle', currentStory.about.title),
        highlight: stringValue(formData, 'aboutHighlight', currentStory.about.highlight),
        body: stringValue(formData, 'aboutBody', currentStory.about.body),
        quote: stringValue(formData, 'aboutQuote', currentStory.about.quote),
      },
      video: {
        ...currentStory.video,
        title: stringValue(formData, 'videoTitle', currentStory.video.title),
        caption: stringValue(formData, 'videoCaption', currentStory.video.caption),
        videoUrl: stringValue(formData, 'videoUrl', currentStory.video.videoUrl),
      },
    };

    const aboutImage = fileValue(formData, 'aboutImage');
    if (aboutImage) {
      nextStory.about.image = await saveMediaFile(aboutImage, { allowedPrefixes: ['image/'], maxSizeMb: 5, label: 'image' });
      await removeUploadedFileIfUnused(currentStory.about.image);
    }

    const videoPoster = fileValue(formData, 'videoPoster');
    if (videoPoster) {
      nextStory.video.poster = await saveMediaFile(videoPoster, { allowedPrefixes: ['image/'], maxSizeMb: 5, label: 'image' });
      await removeUploadedFileIfUnused(currentStory.video.poster);
    }

    const videoFile = fileValue(formData, 'videoFile');
    if (videoFile) {
      nextStory.video.videoUrl = await saveMediaFile(videoFile, { allowedPrefixes: ['video/'], maxSizeMb: 50, label: 'video' });
      await removeUploadedFileIfUnused(currentStory.video.videoUrl);
    }

    content.story = nextStory;
    await writeContent(content);
    return json(nextStory);
  } catch (error) {
    return errorResponse(error, 400);
  }
}
