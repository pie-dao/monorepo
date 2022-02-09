const twitterPosts = async (tweets) => {
  const headers = {
    Authorization: `Bearer ${process.env.TWITTER_TOKEN}`,
  };

  const twitterPosts = await fetch(
    `https://api.twitter.com/2/tweets?ids=${tweets}&expansions=author_id&tweet.fields=created_at,text,author_id&user.fields=name,username`,
    { headers }
  );

  const twitterPostsJson = await twitterPosts.json();
  const twitterPostsData = twitterPostsJson.data;

  for (const post of twitterPostsData) {
    const author = post["author_id"];
    const fetchProfile = await fetch(
      `https://api.twitter.com/2/users/${author}?user.fields=name,username,profile_image_url`,
      { headers }
    );
    const fetchProfileJson = await fetchProfile.json();
    post.author = fetchProfileJson.data;
  }

  return twitterPostsData;
};

export default twitterPosts;
