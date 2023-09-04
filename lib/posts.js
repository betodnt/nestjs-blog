import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Obtém os nomes dos arquivos em/posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remova ".md" do nome do arquivo para obter id
    const id = fileName.replace(/\.md$/, '');

    // Ler arquivo markdown como string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter para analisar a seção de metadados de postagem
    const matterResult = matter(fileContents);

    // Combine os dados com o id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Classifique os posts por data
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter para analisar a seção de metadados de postagem
  const matterResult = matter(fileContents);

  // Use remark para converter markdown em HTML string
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine os dados com o id e contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
