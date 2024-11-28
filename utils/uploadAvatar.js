import { Dropbox } from "dropbox";
import fetch from "isomorphic-fetch";
import axios from "axios";


const refreshAccessToken = async () => {
    try {
        const response = await axios.post("https://api.dropboxapi.com/oauth2/token", null, {
            params: {
                grant_type: "refresh_token",
                refresh_token: process.env.DROPBOX_REFRESH_TOKEN,
                client_id: process.env.DROPBOX_CLIENT_ID,
                client_secret: process.env.DROPBOX_CLIENT_SECRET,
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error("Error refreshing token:");
        if (error.response) {
            // Log detailed error if available
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            // Fallback for other errors
            console.error("Message:", error.message);
        }
        throw new Error("Failed to refresh access token");
    }
    
};



const dbx = new Dropbox({
    accessToken: await refreshAccessToken(),
    fetch,
});

export default async function uploadAvatar(userId, avatarBuffer) {
    try {
        const fileName = `${userId}-${Date.now()}.jpg`;
        const filePath = `/avatars/${fileName}`; // App folder scope

        // Upload the file to Dropbox
        const uploadResponse = await dbx.filesUpload({
            path: filePath,
            contents: avatarBuffer,
            mode: { ".tag": "overwrite" },
        });

        // Create a shared link for the uploaded file
        const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
            path: uploadResponse.result.path_lower,
        });

        return sharedLinkResponse.result.url.replace("dl=0", "raw=1");
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Dropbox API Error Response:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Dropbox API Error:", error.message);
        }
        throw new Error("Avatar upload failed");
    }
}
