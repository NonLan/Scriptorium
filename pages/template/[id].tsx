import React, { useEffect, useState } from "react";
import Head from "next/head";
import CodeSpace from "../../components/ideComponents/codeSpace";
import { Language, useCode } from "@/components/codeContext";
import { useRouter } from 'next/router';
import { useRouter as useNextNavigationRouter } from 'next/navigation';

// When we call [id].js, we retrieve all the template information we need and store in interface format.
interface TemplateData {
    id: number;
    language: string;
    authorid: number;
    title: string;
    description: string;
    tags: [{"name": string}];
    code: string;
    stdin: string
}

// same kinda thing for author
interface Author {
    name: string;
}

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    accountType: string;
}; 

export default function TemplateInfo() {
    const [user, setUser] = useState<User | null>(null);
    const [template, setTemplate] = useState<TemplateData | null>(null);
    const [author, setAuthor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    const { setId, setAuthorId, setLanguage, setCode, setForkFrom, setTitle, setDescription, setTags, setStdin } = useCode();

    // Get the template id from the url
    const router = useRouter(); 
    const { id } = router.query;
    const pageRouter = useNextNavigationRouter(); 

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

    // Attempt to retrieve template data from provided id, or set appropriate error code
    useEffect(() => {
        if (id) {
            const fetchTemplate = async () => {
                try {
                    const response = await fetch(`/api/template/${id}`);

                    const data: TemplateData = await response.json();
                    setTemplate(data);

                    if (template) {
                        setLanguage(template.language as Language);
                        setCode(template.code);

                        const authorResponse = await fetch(`/api/user/${template?.authorid}`);
                        const authorData: Author = await authorResponse.json();
                        setAuthor(authorData.name);
                    }

                    if (response.status == 400) {
                        setError("Failed to retrieve template information.");
                    } else {
                        setError(null);
                    }
                    
                } catch (error) {
                    setError("Internal error.");
                } 
            }

            fetchTemplate();

            setTimeout(() => {
                setReady(true);
              }, 1000);

            
        }
    }, [id, template?.authorid, template?.language, template?.code]);

    // The FORK button should set the required code fields and open the IDE
    const forkButton = () => {
        if (template) {
            // set code context
            setForkFrom(template.id);
            setTitle(template.title);
            setDescription(template.description);
            setTags(template.tags.map((tag: { name: string }) => tag.name));             

            pageRouter.push("/ide");
        }
    }

    // This takes you to the search page with only associated templates
    const linkedBlogsButton = () => {
        if (template) {
            // set code context
            pageRouter.push(`/blog/search?title=&content=&tags=&page=1&templateid=${template.id}`);
        }
    }

    const postButton = () => {
        pageRouter.push(`/blog/new?templateid=${template?.id}`);
    }

    const editTemplate = async () => {
        if (template) {
            // set code context
            setTitle(template.title);
            setDescription(template.description);
            setTags(template.tags.map((tag: { name: string }) => tag.name));
            setAuthorId(template.authorid);
            setId(template.id);
            setStdin(template.stdin);

            pageRouter.push("/ide");
        }
    };

    const deleteTemplate = async () => {
        // Final user auth check
        if (!user || !template || user.id != template?.authorid) {
            setError("Could not verify user as post author.");
            return;
        }

        const postResponse = await fetch(`/api/template/authenticated/`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({id: template?.id}),
        });
        const postData = await postResponse.json();

        if (postData.error) {
            setError(postData.error);
        } else {
            setError("Template deleted, returning to home...");
            setTimeout(() => {
                pageRouter.push("/template/search");
            }, 5000);
        }
    };
    
    return (
        <>
        <Head>
            <title>Template Viewer</title>
        </Head>

        {/* Display an error message banner if [id] fails, but retain all other elements of the page so
            user can navigate somewhere else!! */}
        {error && (
                <div id="error-message" className="bg-red-100">
                    <p className="text-red-950">Error: {error}</p>
                </div>
            )}

        {template && !template.title ? <h2 className="m-8">TEMPLATE DELETED.</h2> : 
        <main>          
            {user && user.id == template?.authorid ? (
            <div className="flex justify-start"> 
                <button className="mt-8 mb-2 ml-10 font-spaceGrotesk hover:bg-opacity-80 p-4 pr-8 pl-8 bg-primeBlue text-slate-700 rounded-t font-extrabold select-none"
                    id="edit-template"
                    onClick={editTemplate}
                    >
                    EDIT
                </button>
                <button className="mt-8 mb-2 ml-5 font-spaceGrotesk hover:bg-opacity-80 p-4 pr-5 pl-5 bg-primeRed text-slate-700 rounded-t font-extrabold select-none"
                    id="delete-template"
                    onClick={deleteTemplate}
                    >
                    DELETE
                </button>      
            </div>  
            ) : ''}

            <section id="template info" className="items-left mt-0 ml-0">
                <h2 className="mb-4 flex justify-left">Title: {template?.title} </h2>
                <h2 className="text-4xl mb-2 flex justify-left">Author: {author} </h2>
                <h2 className="text-4xl mb-2 flex justify-left">Language: {template?.language} </h2>
                <h2 className="text-4xl mb-2 flex justify-left">Tags: {
                    Array.isArray(template?.tags) 
                    ? template?.tags.map(tag => tag.name).join(', ')
                    : ''
                }</h2>
                <h2 className="text-4xl flex justify-left">Description: {template?.description} </h2>                
            </section>

            <div className="bg-primeBlue rounded-t flex justify-between items-center">
                <button
                className="px-10 mx-12 my-4 h-12 rounded hover:bg-opacity-80 font-spaceGrotesk font-extrabold text-4xl select-none terminal"
                onClick={forkButton}
                >
                FORK
                </button>     

                <button
                className="px-10 mx-12 my-4 h-12 rounded hover:bg-opacity-80 font-spaceGrotesk font-extrabold text-4xl select-none terminal"
                onClick={linkedBlogsButton}
                >
                SEARCH LINKED BLOGPOSTS
                </button>    

                <button
                className="px-10 mx-12 my-4 h-12 rounded hover:bg-opacity-80 font-spaceGrotesk font-extrabold text-4xl select-none terminal"
                onClick={postButton}
                >
                CREATE POST
                </button>        
            </div>

        {/* code loading screen */}
        {ready ? (
            <div className="z-10 pointer-events-none"><CodeSpace></CodeSpace></div>
        ) : <h2 className="text-4xl m-5"> Loading code.... </h2>}
        </main> 
        }       
        </>
    );
}