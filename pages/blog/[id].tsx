import React, { ChangeEvent, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useRouter as useNextNavigationRouter } from 'next/navigation';


// When we call [id].js, we retrieve all the post information we need and store in interface format.
interface BlogData {
    id: number;
    authorid: number;
    title: string;
    content: string;
    tags: [{ name: string }];
    templatesid: number;
    rating: number;
    hidden: boolean;
}

interface Author {
    name: string;
}

interface TemplateData {
    id: number;
    title: string;
}

interface Comment {
    id: number;
    authorid: number;
    content: string;
    username: string;
    rating: number;
    hidden: boolean;
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


export default function PostInfo() {
    const [user, setUser] = useState<User | null>(null);    
    const [post, setPost] = useState<BlogData | null>(null);
    const [author, setAuthor] = useState<string | null>(null);
    const [template, setTemplate] = useState<TemplateData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [currPage, setCurrPage] = useState<number>(1);
    const [currComment, setCurrComment] = useState<Comment | null>(null);
    const [prevCurrs, setPrevCurrs] = useState<Comment[]>([]);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [commentContent, setCommentContent] = useState<string>('');
    const [upvote, setUpvote] = useState<Boolean>(false);
    const [downvote, setDownvote] = useState<Boolean>(false);
    const [commentUpvote, setCommentUpvote] = useState<Boolean>(false);
    const [commentDownvote, setCommentDownvote] = useState<Boolean>(false);
    const [goBack, setGoBack] = useState<Boolean>(false);

    const commentsPerPage = 5;   

    // Get the template id from the url
    const router = useRouter(); 
    const { id } = router.query; 
    const pageRouter = useNextNavigationRouter(); 

    // We call this whenever we fetch post comments
    const fetchPostComments = async () => {
        if (post) {
            const commentResponse = await fetch(`/api/comment/nonauthenticated/?blogPostid=${encodeURIComponent(post.id)}&pageSize=${encodeURIComponent(commentsPerPage*currPage)}&pageNumber=${encodeURIComponent(1)}`)
            const commentData: Comment[] = await commentResponse.json();
            setComments(commentData);
        }
    };

    const fetchReplies = async () => {
        if (currComment) {
            const commentResponse = await fetch(
                `/api/comment/nonauthenticated/?&commentid=${encodeURIComponent(currComment.id)}&userId=${encodeURIComponent(user ? user.id : 0)}&pageSize=${encodeURIComponent(commentsPerPage*currPage)}&pageNumber=${encodeURIComponent(1)}`)
            const commentData: Comment[] = await commentResponse.json();
            setComments(commentData);
        }
    };

    const handleCommentContent = async (t: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentContent(t.target.value);

        t.target.style.height = 'auto';
        t.target.style.height = `${t.target.scrollHeight}px`;
    };

    const handleUpvote = async () => {
        if (!user || !post) {
            return;
        }

        if (downvote) {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, BlogPostid: post.id}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setDownvote(!downvote);
            }
        }

        if (!upvote) {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, liked: true, BlogPostid: post.id,}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setUpvote(!upvote);
            }
        } else {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, BlogPostid: post.id}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setUpvote(!upvote);
            }
        }
    };

    const handleDownvote = async () => {
        if (!user || !post) {
            return;
        }

        if (upvote) {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, BlogPostid: post.id}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setUpvote(!upvote);
            }
        }

        if (!downvote) {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, liked: false, BlogPostid: post.id,}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setDownvote(!downvote);
            }
        } else {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, BlogPostid: post.id}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setDownvote(!downvote);
            }
        }
    };

    const handleCommentUpvote = async () => {
        if (!user || !post || !currComment) {
            return;
        }

        if (commentDownvote) {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, Commentid: currComment.id}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setCommentDownvote(!commentDownvote);
            }
        }

        if (!commentUpvote) {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, liked: true, Commentid: currComment.id,}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setCommentUpvote(!commentUpvote);
            }
        } else {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, Commentid: currComment.id}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setCommentUpvote(!commentUpvote);
            }
        }
    };

    const handleCommentDownvote = async () => {
        if (!user || !post || !currComment) {
            return;
        }

        if (commentUpvote) {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, Commentid: currComment.id}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setCommentUpvote(!commentUpvote);
            }
        }

        if (!commentDownvote) {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, liked: false, Commentid: currComment.id,}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setCommentDownvote(!commentDownvote);
            }
        } else {
            const rateResponse = await fetch(`/api/rating/`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({authorid: user.id, Commentid: currComment.id}),
            });
            const rateData = await rateResponse.json();

            if (rateData.error) {
                setError(rateData.error);
            } else {
                setCommentDownvote(!commentDownvote);
            }
        }
    };

    const postComment = async () => {
        // Final user auth check
        if (!user || !post) {
            setError("Could not verify.");
            return;
        }

        if (commentContent == '' || !user || !post) {
            return;
        }
            
        if (!currComment) {
            // Comment under blogpost
            const commentResponse = await fetch(`/api/comment/authenticated/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({author: user.id, content: commentContent, BlogPostid: post.id}),
            });
            const commentData = await commentResponse.json();

            if (commentData.error) {
                setError(commentData.error);
            } else {
                setCommentContent('');
                fetchPostComments();
            }
        } else {
            // Commenting a reply to the current comment
            const commentResponse = await fetch(`/api/comment/authenticated/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({author: user.id, content: commentContent, Commentid: currComment?.id}),
            });
            const commentData = await commentResponse.json();

            if (commentData.error) {
                setError(commentData.error);
            } else {
                setCommentContent('');
                fetchReplies();
            }
        }
    }

    const editPost = async () => {
        pageRouter.push(`/blog/edit?postid=${post?.id}`);
    };

    const deletePost = async () => {
        // Final user auth check
        if (!user || !post || user.id != post?.authorid) {
            setError("Could not verify user as post author.");
            return;
        }
        
        const postResponse = await fetch(`/api/blogPost/authenticated/`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({id: post?.id}),
        });
        const postData = await postResponse.json();

        if (postData.error) {
            setError(postData.error);
        } else {
            setError("Post deleted, returning to home...");
            setTimeout(() => {
                pageRouter.push("/blog/search");
            }, 5000);
        }
    };

    // Update the URL query parameters
    useEffect(() => {
        if (currComment) {
            fetchReplies();
        } else {
            fetchPostComments();
        }
    }, [currComment, currPage]);

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
            setError(error instanceof Error ? error.message : String(error));
          }
        };
    
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchComment = async () => {
            if (post && user && currComment) {
                const voteResponse = await fetch(`/api/rating/?authorid=${user.id}&Commentid=${currComment.id}`);
                const voteData = await voteResponse.json();
                if (!voteData.error) {
                    setCommentUpvote(voteData.upvote);
                    setCommentDownvote(voteData.downvote);
                } else {
                    setError(voteData.error);
                }
            }
        }

        fetchComment();
    }, [currComment])

    useEffect(() => {
        const fetchComment = async () => {
            if (post && user && currComment) {
                const voteResponse = await fetch(`/api/comment/${currComment.id}`);
                const voteData = await voteResponse.json();
                if (!voteData.error) {
                    const authorResponse = await fetch(`/api/user/${currComment?.authorid}`);
                    const authorData: Author = await authorResponse.json();
                    voteData.username = authorData.name;
                    setCurrComment(voteData);
                } else {
                    setError(voteData.error);
                }
            }
        }

        fetchComment();
    }, [commentUpvote, commentDownvote])

    // Attempt to retrieve template data from provided id, or set appropriate error code
    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await fetch(`/api/blogPost/${id}`);
                const data: BlogData = await response.json();
                setPost(data);

                if (post) {
                    if (post?.authorid) {
                        const authorResponse = await fetch(`/api/user/${post?.authorid}`);
                        const authorData: Author = await authorResponse.json();
                        setAuthor(authorData.name);
                    }

                    if (post.templatesid) {
                        const templateResponse = await fetch(`/api/template/${post?.templatesid}`);
                        const templateData: TemplateData = await templateResponse.json();
                        setTemplate(templateData);                            
                    }

                    if (id) {
                        fetchPostComments();
                    }

                    if (response.status == 400) {
                        setError("Failed to retrieve post information.");
                    } {
                        setError(null);
                    }
                }

                setIsReady(true);
                       
                if (post && user) {
                    const voteResponse = await fetch(`/api/rating/?authorid=${user.id}&BlogPostid=${post.id}`);
                    const voteData = await voteResponse.json();
                    if (!voteData.error) {
                        setUpvote(voteData.upvote);
                        setDownvote(voteData.downvote);
                    } else {
                        setError(voteData.error);
                    }
                }
            } catch (error) {
                setError(`${error}`);
            } 
        }

        if (id) {
            fetchTemplate();
            setError(null);
        }
    }, [id, post?.authorid, post?.templatesid, upvote, downvote]);

    useEffect(() => {
        if (goBack) {
            setCommentUpvote(false);
            setCommentDownvote(false);

            setPrevCurrs(prev => {
                const updatedPrevCurrs = prev.slice(0, -1);
                if (updatedPrevCurrs.length === 0) {
                    setCurrComment(null);
                } else {
                    setCurrComment(updatedPrevCurrs[updatedPrevCurrs.length - 1]);
                }
                return updatedPrevCurrs;
            });
            
            setCurrPage(1);

            setGoBack(false);
        }        
    }, [goBack]);

    const [showReportForm, setShowPostReportForm] = useState(false);
    const [showCommentReportForm, setShowCommentReportForm] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const handleReportForm = async (contentType: string) => {
        if (!reportReason) {
            alert("Please provide a reason for reporting this post.");
            return;
        }
        const reportId = contentType === "BlogPost" ? post?.id : currComment?.id;
        try {
            const response = await fetch("/api/report/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?.id,
                    type: contentType,
                    id: reportId,
                    reasoning: reportReason,
                }),
            });
            if (response.ok) {
                alert("Post reported successfully.");
                setShowPostReportForm(false);
                setShowCommentReportForm(false);
                setReportReason("");
            } else {
                const { error } = await response.json();
                alert(`Failed to submit report: ${error}`);
            }
        } catch (error) {
            console.error("Error reporting post:", error);
            alert("An error occurred while reporting this post.");
        }
    };

        const shouldHidePost = post && post.hidden && user?.id !== post.authorid;
    
        return (
            <>
                <Head>
                    <title>Template Viewer</title>
                </Head>
    
                {/* Display an error message banner if [id] fails, but retain all other elements of the page so
                    user can navigate somewhere else!! */}
                {error && (
                    <div id="error-message" className="bg-red-100">
                        <p className="text-red-950">{error}</p>
                    </div>
                )}
    
                {/* Post doesn't exist */}
                {post && !post.title ? (
                    <div className="flex flex-col items-center text-center my-36 mx-24 gap-8">
                    <h2>This post is unavailable.</h2>
                    <p className="mb-16">
                        It may not exist, has been deleted, or was removed because it went against Scriptorium's Terms of Service.
                    </p>
                    <button
                        id="internal-link"
                        onClick={() => (window.location.href = "/blog/search")}
                    >
                        Go Back
                    </button>
                    </div>
                ) : (
                    <>
                        {/* If post should be hidden (i.e., if it was reported). */}
                        {shouldHidePost ? (
                            <div className="flex flex-col items-center text-center my-36 mx-24 gap-8">
                                <h2>This post is unavailable.</h2>
                                <p className="mb-16">
                                    It may not exist, has been deleted, or was removed because it went against Scriptorium's Terms of Service.
                                </p>
                                <button
                                    id="internal-link"
                                    onClick={() => (window.location.href = "/blog/search")}
                                >
                                    Go Back
                                </button>
                            </div>
                            // If post is ready to be displayed
                        ) : isReady && post ? (
                            <main>
                                <div className="flex justify-left text-left">
                                    {user && user.id === post?.authorid ? (
                                        <>
                                            <div>
                                                <button
                                                    className="text-left mt-8 mb-2 ml-10 font-spaceGrotesk hover:bg-opacity-80 p-4 pr-8 pl-8 bg-primeBlue text-slate-700 rounded-t font-extrabold select-none"
                                                    id="edit-post"
                                                    onClick={editPost}
                                                >
                                                    EDIT
                                                </button>
                                                <button
                                                    className="text-left mt-8 mb-2 ml-5 font-spaceGrotesk hover:bg-opacity-80 p-4 pr-5 pl-5 bg-primeRed text-slate-700 rounded-t font-extrabold select-none"
                                                    id="delete-post"
                                                    onClick={deletePost}
                                                >
                                                    DELETE
                                                </button>
                                            </div>
                                            {/* Tell author if the post has been hidden. */}
                                            {post?.hidden ? (
                                                <h2 className="m-10">
                                                    This post has been hidden for going against Scriptorium's Terms of Service.
                                                </h2>
                                            ) : null}
                                        </>
                                    ) : ''}
                                </div>

                                {/* Show Report Form */}
                                {showReportForm && (
                                    <div className="fixed inset-0 bg-light bg-opacity-20 flex justify-center items-center">
                                        <div className="bg-dark p-6 rounded-xl shadow-md max-w-md">
                                            <h2 className="text-xl text-light font-bold mb-4">Report Blog Post</h2>
                                            <textarea
                                                className="w-full bg-dark p-2 border rounded"
                                                placeholder="Enter your reasoning."
                                                value={reportReason}
                                                onChange={(e) => setReportReason(e.target.value)}
                                            ></textarea>
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    className="mr-2 px-4 py-2 bg-primeRed rounded hover:bg-primeRedDark"
                                                    onClick={() => setShowPostReportForm(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-primeBlue text-light rounded hover:bg-primeBlueDark"
                                                    onClick={async () => await handleReportForm("BlogPost")}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
    
                                {/* Post Information */}
                                <section id="post info" className="text-left items-left mt-0 ml-0">
                                    <h2 className="text-left text-6xl mb-4 flex justify-left">
                                        Title: {post?.title}
                                    </h2>
                                    <h2 className="text-left text-4xl mb-2 flex justify-left">
                                        Author: {author}
                                    </h2>
                                    <h2 className="text-left text-4xl mb-2 flex justify-left">
                                        Tags:{" "}
                                        {Array.isArray(post?.tags)
                                            ? post?.tags.map((tag) => tag.name).join(", ")
                                            : ""}
                                    </h2>
                                    <h2 className="text-left text-4xl mb-2 flex justify-left">
                                        Content: {post?.content}
                                    </h2>
                                    {template != null ? (
                                        <a
                                            className="text-left mb-2"
                                            href={`/template/${template.id}`}
                                        >
                                            <h3 className="text-left">Template: {template.title}</h3>
                                        </a>
                                    ) : null}
                                    <h2 className="text-4xl mb-2 flex justify-left">
                                        Rating: {post?.rating}
                                    </h2>
    
                                    {/* User actions (upvote, downvote, report) */}
                                    {user && !user.error ? (
                                        <div>
                                            <button
                                                className={`mt-5 mb-2 font-spaceGrotesk hover:bg-lime-500 p-4 pr-5 pl-5 ${
                                                    upvote ? "bg-lime-500" : "bg-lime-400"
                                                } text-slate-700 rounded-t font-extrabold select-none`}
                                                id="upvote"
                                                onClick={handleUpvote}
                                            >
                                                Like
                                            </button>
                                            <button
                                                className={`mt-5 mb-2 ml-5 font-spaceGrotesk hover:bg-primeRedDark p-4 pr-5 pl-5 ${
                                                    downvote ? "bg-primeRedDark" : "bg-primeRed"
                                                } text-slate-700 rounded-t font-extrabold select-none`}
                                                id="downvote"
                                                onClick={handleDownvote}
                                            >
                                                Dislike
                                            </button>
                                            <button
                                                className="text-left mt-8 mb-2 ml-10 font-spaceGrotesk hover:bg-opacity-80 p-4 pr-5 pl-5 bg-primeRed text-slate-700 rounded-t font-extrabold select-none"
                                                id="report-post"
                                                onClick={() => setShowPostReportForm(true)}
                                            >
                                                REPORT
                                            </button>
                                        </div>
                                    ) : ''}
                                </section>
    
                                {/* Comments Section */}
                                <section id="comments section" className="flex items-left ml-1">
                                    {!Array.isArray(comments) || (comments.length === 0 && !currComment) ? (
                                        <div>
                                            <h3
                                                className="text-left mb-8 cursor-pointer"
                                                onClick={() => {
                                                    setCommentUpvote(false);
                                                    setCommentDownvote(false);
                                                    setPrevCurrs([]);
                                                    setCurrComment(null);
                                                    setCurrPage(1);
                                                }}
                                            >
                                                No comments.
                                            </h3>

                                            {/* Add a comment */}
                                            {user && !user.error ? (
                                                <div className="flex justify-left">
                                                    <textarea
                                                        className="flex m-8 mr-0 text-lg p-4 border-4 border-primeRed text-slate-700 bg-white box-border"
                                                        id="comment content"
                                                        placeholder="Add a comment..."
                                                        value={commentContent}
                                                        onChange={handleCommentContent}
                                                        rows={1}
                                                        style={{ width: "calc(100% - 6rem)" }}
                                                    />
                                                    <button
                                                        className="text-left m-8 font-spaceGrotesk hover:bg-opacity-80 pl-4 pr-4 bg-primeBlue text-slate-700 rounded-t font-extrabold select-none"
                                                        id="comment"
                                                        onClick={postComment}
                                                    >
                                                        COMMENT
                                                    </button>
                                                </div>
                                            ) : ''}
                                        </div>
                                    ) : (
                                        <ul>
                                            <h3
                                                className="text-left mb-8 cursor-pointer"
                                                onClick={() => {
                                                    setCommentUpvote(false);
                                                    setCommentDownvote(false);
                                                    setCurrComment(null);
                                                    setPrevCurrs([]);
                                                    setCurrPage(1);
                                                }}
                                            >
                                                Comments
                                            </h3>

                                            {user && !user.error ? (
                                                <div className="flex justify-left">
                                                    <textarea
                                                        className="flex m-8 mr-0 text-lg p-4 border-4 border-primeRed text-slate-700 bg-white box-border"
                                                        id="comment content"
                                                        placeholder="Add a comment..."
                                                        value={commentContent}
                                                        onChange={handleCommentContent}
                                                        rows={1}
                                                        style={{ width: "calc(100% - 6rem)" }}
                                                    />
                                                    <button
                                                        className="text-left m-8 font-spaceGrotesk hover:bg-opacity-80 pl-4 pr-4 bg-primeBlue text-slate-700 rounded-t font-extrabold select-none"
                                                        id="comment"
                                                        onClick={postComment}
                                                    >
                                                        COMMENT
                                                    </button>
                                                </div>
                                            ) : ''}
                                            {currComment ? <div className="ml-4 m-8 max-w-screen-sm overflow-y-auto cursor-pointer">
                                <p className="text-2xl break-words" onClick={() => {
                                setGoBack(true);
                                }}> {currComment.username}: {currComment.content} </p>
                                <p className="text-xl"> rating: {currComment.rating} </p>
                                
                                {user && !user.error ? (
                                    <div>
                                        <button className={`hover:text-primeBlueDark ${commentUpvote ? "text-primeBlueDark" : "text-primeBlue"}`} onClick={handleCommentUpvote}>Like</button>
                                        <br></br>
                                        <button className={`hover:text-primeBlueDark ${commentDownvote ? "text-primeBlueDark" : "text-primeBlue"}`} onClick={handleCommentDownvote}>Dislike</button>
                                        <br></br>
                                        <button className="hover:text-opacity-50 text-primeBlue" onClick={() => setShowCommentReportForm(true)}>Report</button>
                                    </div>
                                    ) : ''}
                                </div>
                                : ''
                            }
                            {showCommentReportForm && (
                                <div className="fixed inset-0 bg-light bg-opacity-20 flex justify-center items-center">
                                <div className="bg-dark p-6 rounded-xl shadow-md max-w-md">
                                <h2 className="text-xl text-light font-bold mb-4">Report Comment</h2>
                                {/* Report Reason */}
                                <textarea className="w-full bg-dark p-2 border rounded" placeholder="Enter your reasoning." value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}></textarea>
                                <div className="mt-4 flex justify-end">
                                {/* Cancel */}
                                <button className="mr-2 px-4 py-2 bg-primeRed rounded hover:bg-primeRedDark" onClick={() => setShowCommentReportForm(false)}>Cancel</button>
                                {/* Submit */}
                                <button className="px-4 py-2 bg-primeBlue text-light rounded hover:bg-primeBlueDark" onClick={async () => await handleReportForm("Comment")}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}


                                            {/*  */}
                                            {comments.map((comment, index) => {
                                                const shouldHideComment =
                                                    comment.hidden && user?.id !== comment.authorid;
                                                return shouldHideComment ? (
                                                    <li
                                                        key={index}
                                                        className="text-gray-500 italic mb-8 ml-8 max-w-screen-sm overflow-y-auto"
                                                    >
                                                        This comment has been hidden due to violations of
                                                        Scriptorium's terms of service.
                                                    </li>
                                                ) : (
                                                    <li
                                                        key={index}
                                                        className="mb-8 ml-8 max-w-screen-sm overflow-y-auto"
                                                    >
                                                        <p className="text-2xl break-words">
                                                            {comment.username}: {comment.content}
                                                        </p>
                                                        <p className="text-xl">Rating: {comment.rating}</p>
                                                        <button
                                                            className="hover:text-opacity-50 text-primeBlue"
                                                            onClick={() => {
                                                                setCommentUpvote(false);
                                                                setCommentDownvote(false);
                                                                setPrevCurrs((prev) =>
                                                                    prev.concat(comment)
                                                                );
                                                                setCurrComment(comment);
                                                                setCurrPage(1);
                                                            }}
                                                        >
                                                            Replies
                                                        </button>
                                                        <br />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </section>
    
                                <div>
                                    <button
                                        id="more-button"
                                        className={`px-10 mx-12 mb-8 h-12 rounded font-spaceGrotesk font-extrabold text-4xl ${
                                            comments.length < commentsPerPage * currPage
                                                ? "text-transparent"
                                                : ""
                                        }`}
                                        onClick={async () => {
                                            setCurrPage(currPage + 1);
                                        }}
                                        disabled={comments.length < commentsPerPage * currPage}
                                    >
                                        See More Comments
                                    </button>
                                </div>
                            </main>
                        ) : (
                            <h2 className="m-10">Loading...</h2>
                        )}
                    </>
                )}
            </>
        );
    }