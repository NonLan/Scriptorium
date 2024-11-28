import React, { ChangeEvent, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useRouter as useNextNavigationRouter } from 'next/navigation';


interface TemplateData {
    id: number;
    title: string;
}

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    accountType: string;
    error: string;
};

export default function NewPost() {
    const pageRouter = useNextNavigationRouter();

    const [user, setUser] = useState<User | null>(null);    
    const [title, setTitle] = useState<string | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [tags, setTags] = useState<String[] | null>(null);
    const [template, setTemplate] = useState<TemplateData | null>(null);

    // Get the template id from the url
    const router = useRouter(); 
    const { templateid } = router.query; 

    const [error, setError] = useState<string | null>(null);

    // We call this when the user hits create post
    const createPost = async () => {
        if (user?.id) {
            const requestData = {
                author: user?.id,
                title: title,
                content: content,
                tags: tags,
                template: templateid,
            }

            // Attempt to send postdata json to post api
            const postResponse = await fetch(`/api/blogPost/authenticated/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const postData = await postResponse.json();

            // Display the error to the user so user knows why the post didn't go through
            if (postData.error) {
                setError(postData.error);
            } else {
                setError("Post success!! Redirecting to post...");
                setTimeout(() => {
                    pageRouter.push(`/blog/${postData.id}`);
                }, 5000);
            }
        }
    };

    const handleTitleChange = (t: ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(t.target.value);
    };

    const handleContentChange = (t: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(t.target.value);

        t.target.style.height = 'auto';
        t.target.style.height = `${t.target.scrollHeight}px`;
    };

    const handleTagChange = (t: ChangeEvent<HTMLTextAreaElement>) => {
        const tags = t.target.value.split(',').map(str => str.trim()).filter(str => str !== '');
        setTags(tags);
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
            setError("Please log in to create a post.");
          }
        };
    
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await fetch(`/api/template/${templateid}`);
                const data: TemplateData = await response.json();

                setTemplate(data);
            } catch {
                setError("Couldn't reach template.")
            }
        }
        
        if (templateid) {
            fetchTemplate();
        }
    }, [templateid]);

    return (
        <>
        <Head>
            <title>New Post</title>
        </Head>

        {/* Display an error message banner if post fails!!! */}
        {!(user?.error) && error && (
                <div id="error-message" className="bg-red-100">
                    <p className="text-red-950">{error}</p>
                </div>
            )}

        {!(user?.error) ? (
        <main>   
            <h2 className="text-left m-10">NEW POST</h2>

            <h2 className="text-left text-3xl mt-12 ml-12">TITLE</h2>
            <textarea className="flex ml-12 mr-12 mb-12 text-lg p-4 border-4 border-primeRed text-slate-700 bg-white box-border"
                    id="newge"
                    placeholder="Post title..."
                    onChange={handleTitleChange}
                    rows={1}
                    style={{width: 'calc(100% - 6rem)'}}
                    />

            <h2 className="text-left text-3xl mt-12 ml-12">CONTENT</h2>
            <textarea className="flex ml-12 mr-12 mb-12 text-lg p-4 border-4 border-primeRed text-slate-700 bg-white box-border"
                    id="newge"
                    placeholder="Post content..."
                    onChange={handleContentChange}
                    rows={5}
                    style={{width: 'calc(100% - 6rem)'}}
                    />

            <h2 className="text-left text-3xl mt-12 ml-12">TAGS (SEPARATED BY COMMAS)</h2>
            <textarea className="flex ml-12 mr-12 mb-12 text-lg p-4 border-4 border-primeRed text-slate-700 bg-white box-border"
                    id="newge"
                    placeholder="Post tags, separated by commas..."
                    onChange={handleTagChange}
                    rows={1}
                    style={{width: 'calc(100% - 6rem)'}}
                    />

            {template ? (
                <a className="m-12" href={`/template/${templateid}`}><h3>Linked Template: {template?.title}</h3></a>
             ) : null } 

            <button className="m-12 mt-8 font-spaceGrotesk hover:bg-opacity-80 text-4xl p-4 pr-10 pl-10 bg-primeBlue text-slate-700 rounded-t font-extrabold select-none"
                    id="create-post"
                    onClick={createPost}
                    >
                    POST!
                    </button> 

        </main>
        ) : <h2 className="m-8">Log in to create a new post!</h2>}
        </>
    )
}