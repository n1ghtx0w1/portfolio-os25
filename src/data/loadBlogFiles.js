import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
import matter from 'gray-matter';

export async function loadBlogFiles() {
  const files = import.meta.glob('/src/blog/*.md', {
  eager: true,
  query: '?raw',
});
  const posts = [];
  for (const path in files) {
    let raw = files[path];
    if (typeof raw === 'object' && raw.default) raw = raw.default;
    if (typeof raw !== 'string') continue;
    const { content, data } = matter(raw);

    const filename = path.split('/').pop();
    posts.push({
      filename,
      content,
      date: data?.date ? new Date(data.date) : new Date(0),
      title: data?.title || filename,
    });
  }

  posts.sort((a, b) => b.date - a.date);

  const fileMap = {};
  posts.forEach(post => {
    fileMap[post.filename] = {
      content: post.content,
      date: post.date,
      title: post.title,
    };
  });

  return fileMap;
}
