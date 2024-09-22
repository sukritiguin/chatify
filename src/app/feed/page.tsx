import Post from "./components/Post";
import PostCreator from "./components/PostCreator";

const FeedPage = () => {
  const postData = {
    id: "1",
    content: "Excited to share my new project!",
    images: [],
    user: {
      name: "Sukriti Guin",
      profileImage:
        "https://res.cloudinary.com/doznopi6d/image/upload/v1726929651/uc1tzgrgekniqagf6y22.png",
    },
    createdAt: new Date().toISOString(),
    visibility: "public",
  };

  return (
    <div className="">
      <PostCreator />
      <Post post={postData} />
      <Post post={postData} />
      <Post post={postData} />
      <Post post={postData} />
      <Post post={postData} />
      <Post post={postData} />
      <Post post={postData} />
      <Post post={postData} />
      <Post post={postData} />
      <Post post={postData} />
    </div>
  );
};

export default FeedPage;
