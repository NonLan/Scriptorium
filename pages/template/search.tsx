import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useRouter as useNextNavigationRouter } from 'next/navigation';
import Select, { MultiValue } from "react-select";
import { useCode } from "@/components/codeContext";

interface TemplateData {
    id: number;
    title: string;
    description: string;
    tags: [{name: string}];
}

export default function TemplateSearch() {
    const router = useRouter();
    const pageRouter = useNextNavigationRouter(); 
    const { setLanguage, setCode } = useCode();

    const [templates, setTemplates] = useState<TemplateData[]>([]);
    const [titleSearch, setTitleSearch] = useState<string>("");
    const [descriptionSearch, setDescriptionSearch] = useState<string>("");
    const [tagSearch, setTagSearch] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;
    const [user, setUser] = useState<number | null>(null);

    const [tagSelection, setTagSelection] = useState<{ value: string; label: string; }[]>([]);

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
  
            setTagSelection(formattedTags); // Set the formatted tags
        } catch (error) {
            setError(`Error: ${error}`);
        } 
    };  

    const filteredTemplates = async () => {
        try {
            const response = await fetch(`/api/template/nonauthenticated?title=${encodeURIComponent(titleSearch)}&description=${encodeURIComponent(descriptionSearch)}&authorid=${encodeURIComponent(user ? user : '')}&tags=${encodeURIComponent(tagSearch)}&pageSize=${resultsPerPage}&pageNumber=${currentPage}`, {
                method: 'GET',
            });
            const data = await response.json()

            setTemplates(data);
            setError(null);
        } catch (error) {
            setError(`Erorr: ${error}`);
        } 
    };  

    useEffect(() => {
        filteredTemplates();        
    }, [titleSearch, descriptionSearch, tagSearch, currentPage, user]); 

    // Update search params based on url when router is ready
    useEffect(() => {
        const fetchData = async () => {
            if (router.isReady) {
                if (router.query.title) {
                    setTitleSearch(String(router.query.title));
                }
                if (router.query.description) {
                    setDescriptionSearch(String(router.query.description));
                }        
                if (router.query.tags) {
                    setTagSearch(String(router.query.tags));
                }
                if (router.query.page) {
                    setCurrentPage(Number(router.query.page));
                }
                if (router.query.user) {
                    setUser(Number(router.query.user));
                }

                await tagOptions();
                await filteredTemplates();
            }
        };

        fetchData();
    }, [router.isReady, router.query]);

    // Update the URL query parameters
    useEffect(() => {        
        if (router.isReady) {
            router.push({
                pathname: router.pathname,
                query: { title: titleSearch, description: descriptionSearch, tags: tagSearch, page: currentPage, user: user, },
            }, undefined, { scroll: false });
      }
    }, [titleSearch, descriptionSearch, tagSearch, currentPage, user]);

    const handleTitleChange = (t: ChangeEvent<HTMLInputElement>) => {
        setTitleSearch(t.target.value);
        setCurrentPage(1);
    };

    const handleDescriptionChange = (d: ChangeEvent<HTMLInputElement>) => {
        setDescriptionSearch(d.target.value);
        setCurrentPage(1);
    };

    const handleTagChange = (t: MultiValue<{ value: string; label: string; }>) => {
        const theChange = t.map(tag => tag.label).join(',');
        setTagSearch(theChange);
        setCurrentPage(1);
    };

    // The create template button should open IDE in a fresh state
    const createTemplate = () => {
        // set code context
        setLanguage("");
        setCode("");             
    
        pageRouter.push("/ide");
    }

    return (
        <>
            <Head>
                <title>Search Templates</title>
            </Head>
        
            <main>
                {/* Display an error message banner if fail, but retain all other elements of the page so
                    user can navigate somewhere else!! */}
                {error && (
                        <div id="error-message" className="bg-red-100">
                            <p className="text-red-950">Error: {error}</p>
                        </div>
                    )}

                <button className="mt-8 mb-0 ml-8 mr-8 font-spaceGrotesk hover:bg-opacity-80 text-4xl p-4 pr-10 pl-10 bg-primeBlue text-slate-700 rounded-t font-extrabold select-none"
                    id="create-template"
                    onClick={createTemplate}
                    >
                        CREATE NEW TEMPLATE
                    </button> 

                <div className="flex flex-col sm:flex-row items-start">
                    <input className="mt-8 mb-0 ml-8 text-lg p-4 border-4 text-slate-700 bg-white rounded-t"
                    type="text"
                    id="newge"
                    placeholder="Search titles..."
                    value={titleSearch}
                    onChange={handleTitleChange}
                    />

                    <input className="mt-8 mb-8 ml-8 text-lg p-4 border-4 text-slate-700 bg-white rounded-t"
                    type="text"
                    id="newge"
                    placeholder="Search descriptions..."
                    value={descriptionSearch}
                    onChange={handleDescriptionChange}
                    />                    
                </div>

                <Select isMulti placeholder="Select tags..." options={tagSelection} onChange={handleTagChange}
                    className="mb-8 ml-8 mr-8 border-4 text-slate-700"/>

                    <div id="templates list" className="flex text-lg">
                        {templates.length === 0 ? (
                            <p className="ml-8">No templates found</p>
                        ) : (
                            <ul>
                                {templates.map((template, index) => (
                                    <li key={index} className="mt-8 mb-8 ml-8">
                                        <a href={`/template/${template.id}`}><h3>{template.title}</h3></a>                                    
                                        <p>{template.description}</p>                                   
                                        {template.tags && Array.isArray(template.tags) && template.tags.length > 0 ? (
                                            <p>{template.tags.map((tag, _) => tag.name).join(', ')}</p>
                                            ) : (
                                            <p>No tags available</p>
                                        )}
                                    </li>
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
                        disabled={templates.length === 0 || templates.length != resultsPerPage}
                    >
                        Next
                    </button>
                </div>
            </main>


        </>
    );
}
