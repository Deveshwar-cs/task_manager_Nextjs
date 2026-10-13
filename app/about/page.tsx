type Post = {
  id: number;
  title: string;
  body: string;
};

async function getPosts(): Promise<Post[]> {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json() as Promise<Post[]>;
}

export default async function AboutPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>

        <p className="mt-2 text-gray-600">
          Posts fetched by a Next.js Server Component.
        </p>

        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <h2 className="font-semibold text-gray-900">{post.title}</h2>

              <p className="mt-2 text-sm text-gray-600">{post.body}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
