import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

import matter from 'gray-matter';

export async function loadBlogFiles() {
  const files = import.meta.glob('../blog/*.md?raw', {
    eager: true,
  });

  console.log("✅ Glob matched files:", Object.keys(files));

  const posts = [];

  for (const path in files) {
    const raw = files[path];
    if (typeof raw !== 'string') {
      console.error("❌ Expected string, got:", raw);
      continue;
    }

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
