export async function loadBlogFiles() {
  const files = import.meta.glob('../content/blog/*.md', {
    query: '?raw',
    import: 'default',
  });

  const blog = {};
  for (const path in files) {
    const filename = path.split('/').pop();
    const content = await files[path]();
    blog[filename] = content;
  }

  return blog;
}
