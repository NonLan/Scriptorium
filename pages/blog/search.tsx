import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { useRouter as useNextNavigationRouter } from 'next/navigation';
import Head from "next/head";
import Select, { MultiValue } from "react-select";

interface PostData {
    id: number;
    authorId: number;
    title: string;
    content: string;
    tags: [{name: string}];
    hidden: boolean;
}

type User = {
    id: number;
    error: string;
};

export default function PostSearch() {
    const router = useRouter();
    const pageRouter = useNextNavigationRouter();

    const [user, setUser] = useState<User | null>(null);    
    const [posts, setPosts] = useState<PostData[]>([]);
    const [titleSearch, setTitleSearch] = useState<string>("");
    const [contentSearch, setContentSearch] = useState<string>("");
    const [tagSearch, setTagSearch] = useState<string>("");
    const [templateSearch, setTemplateSearch] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [userSearch, setUserSearch] = useState<number | null>(null);
    const resultsPerPage = 5;

    const [tags, setTags] = useState<{ value: string; label: string; }[]>([]);

    const [error, setError] = useState<string | null>(null);

    const tagOptions = async () => {
        try {
            const response = await fetch(`/api/tag/`, {
                method: 'GET',
            });
            const data: string[] = await response.json();

            // Map the array of strings to the format required by react-select
            const formattedTags = data.map(tag => ({
                label: tag,
                value: tag.toLowerCase(),
            }));
  
            setTags(formattedTags); // Set the formatted tags
        } catch (error) {
            setError(`Erorr: ${error}`);
        } 
    };  

    const filteredPosts = async () => {
        try {
            const response = await fetch(
                `/api/blogPost/nonauthenticated?title=${encodeURIComponent(titleSearch)}&content=${encodeURIComponent(contentSearch)}&tags=${encodeURIComponent(tagSearch)}&pageSize=${resultsPerPage}&pageNumber=${encodeURIComponent(currentPage)}&template=${templateSearch ? encodeURIComponent(templateSearch) : ''}&authorid=${userSearch ? encodeURIComponent(userSearch) : ''}&userId=${user ? encodeURIComponent(user.id) : 0}`, {
                method: 'GET',
            });
            const data = await response.json();

            setPosts(data);
            setError(null);
        } catch (error) {
            setError(`Error: ${error}`);
        } 
    };  

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const res = await fetch("/api/user", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
    
            if (!res.ok) {
              throw new Error("Failed to fetch user data");
            }
    
            const data: User = await res.json();
            setUser(data);
          } catch (error) {
            console.error("Error fetching user data:", error);
            setError(error instanceof Error ? error.message : String(error));
          }
        };
    
        fetchUserData();
    }, []);

    useEffect(() => {
        filteredPosts();        
    }, [titleSearch, contentSearch, tagSearch, templateSearch, userSearch, currentPage]); 

    // Update search params based on url when router is ready
    useEffect(() => {
        const fetchData = async () => {
            if (router.isReady) {
                if (router.query.title) {
                    setTitleSearch(String(router.query.title));
                }
                if (router.query.description) {
                    setContentSearch(String(router.query.description));
                }        
                if (router.query.tags) {
                    setTagSearch(String(router.query.tags));
                }
                if (router.query.page) {
                    setCurrentPage(Number(router.query.page));
                }    
                if (router.query.templateid) {
                    setTemplateSearch(Number(router.query.templateid));
                }
                if (router.query.user) {
                    setUserSearch(Number(router.query.user));
                }    

                await tagOptions();
                await filteredPosts();
            }
        };
    
        fetchData();
    }, [router.isReady, router.query]);

    // Update the URL query parameters
    useEffect(() => {        
        if (router.isReady) {
            router.push({
                pathname: router.pathname,
                query: { title: titleSearch, content: contentSearch, tags: tagSearch, page: currentPage, templateid: templateSearch, user: userSearch },
            }, undefined, { scroll: false });
      }
    }, [titleSearch, contentSearch, tagSearch, currentPage, templateSearch, userSearch]);

    const handleTitleChange = (t: ChangeEvent<HTMLInputElement>) => {
        setTitleSearch(t.target.value);
        setCurrentPage(1);
    };

    const handleContentChange = (d: ChangeEvent<HTMLInputElement>) => {
        setContentSearch(d.target.value);
        setCurrentPage(1);
    };

    const handleTagChange = (t: MultiValue<{ value: string; label: string; }>) => {
        const theChange = t.map(tag => tag.label).join(',');
        setTagSearch(theChange);
        setCurrentPage(1);
    };

    const postButton = () => {
        pageRouter.push("/blog/new");
    }
    
    return (
        <>
            <Head>
                <title>Search Posts</title>
            </Head>
        
            <main>
                {/* Display an error message banner if fail, but retain all other elements of the page so
                    user can navigate somewhere else!! */}
                {error && (
                        <div id="error-message" className="bg-red-100">
                            <p className="text-red-950">Error: {error}</p>
                        </div>
                    )}

                {!(user?.error) ? (
                <button className="mt-8 mb-0 ml-8 mr-8 font-spaceGrotesk hover:bg-opacity-80 text-4xl p-4 pr-10 pl-10 bg-primeBlue text-slate-700 rounded-t font-extrabold select-none"
                    id="create-post"
                    onClick={postButton}
                    >
                    CREATE NEW POST
                    </button> 
                ) : ''}  

                <div className="flex flex-col sm:flex-row items-start">
                    <input className="mt-8 mb-0 ml-8 text-lg p-4 border-4 text-slate-700 bg-white rounded-t"
                    type="text"
                    id="newge"
                    placeholder="Search titles..."
                    value={titleSearch}
                    onChange={handleTitleChange}
                    />

                    <input className="mt-8 mb-8 ml-8 mr-8 text-lg p-4 border-4 text-slate-700 bg-white rounded-t"
                    type="text"
                    id="newge"
                    placeholder="Search contents..."
                    value={contentSearch}
                    onChange={handleContentChange}
                    />          
                </div>

                <Select isMulti placeholder="Select tags..." options={tags} onChange={handleTagChange}
                    className="mb-8 ml-8 mr-8 rounded-t border-4 border- text-slate-700"/>

                <div id="posts list" className="flex text-lg">
                    {!Array.isArray(posts) || posts.length === 0 ? (
                        <p className="ml-8">No posts found</p>
                    ) : (
                        <ul>
                            {posts.map((post, index) => (
                                (!post.hidden || post.authorId === user?.id) && (
                                    <li key={index} className="mt-8 mb-8 ml-8">
                                        <a href={`/blog/${post.id}`}><h3>{post.title}</h3></a>                                    
                                        <p>{post.content.length > 300 ? `${post.content.substring(0, 300)} (...)` : post.content}</p>                                   
                                        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 ? (
                                            <p>{post.tags.map((tag, _) => tag.name).join(', ')}</p>
                                            ) : (
                                            <p>No tags available</p>
                                        )}
                                    </li>
                                )
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex flex-row justify-center gap-8 md:gap-24 items-center mt-4 mb-16">
                    <button
                        id="prev-page"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-6 py-4 text-lg bg-primeRed text-light rounded-2xl disabled:opacity-50" 
                    >
                        Previous
                    </button>
                    <span className="text-lg">
                        Page {currentPage}
                    </span>
                    <button
                        id="next-page"
                        className="px-6 py-4 text-lg bg-primeRed text-light rounded-2xl disabled:opacity-50"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={posts.length === 0 || posts.length != resultsPerPage}
                    >
                        Next
                    </button>
                </div>
            </main>
        </>
    );
}
