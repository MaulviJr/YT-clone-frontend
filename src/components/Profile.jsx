// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import authService from '@/api/auth.service';
// import { Button } from './ui/button';
// import { useParams } from 'react-router-dom';

// export default function Profile() {
//   const [channelInfo, setChannelInfo] = useState(null);
//   const { username } = useParams();
//   const userData = useSelector(state => state.auth.userData);

//   const isOwnProfile = !username || username === userData?.user.username;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         if (isOwnProfile) {
//           setChannelInfo(userData.user); // own profile from Redux
//         } else {
//           const data = await authService.getChannelInfo(username); // fetch other user
//           setChannelInfo(data);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchProfile();
//   }, [username, userData, isOwnProfile]);

//   if (!channelInfo) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>{isOwnProfile ? "My Profile" : channelInfo.fullName}</h1>
//       <h2>{`Name: ${channelInfo?.fullName || "John Doe"}`}</h2>
//       <p>{`Subscribers: ${channelInfo?.subscribersCount || 0}`}</p>
//       <img
//         src={channelInfo?.avatar}
//         alt="Avatar"
//         style={{ width: "150px", height: "150px", borderRadius: "50%" }}
//       />
//       {channelInfo?.coverImage && (
//         <img
//           src={channelInfo.coverImage}
//           alt="Cover"
//           style={{ width: "100%", height: "200px", objectFit: "cover", marginTop: "20px" }}
//         />
//       )}

//       {/* Edit profile button only for logged-in user */}
//       {isOwnProfile && (
//         <Button variant="outline" className="mt-4">
//           Edit Profile
//         </Button>
//       )}

//       {/* Subscribe button for other users */}
//       {!isOwnProfile && (
//         channelInfo.isSubscribed ? (
//           <Button variant="outline" className="mt-4">Subscribed</Button>
//         ) : (
//           <Button variant="outline" className="mt-4">Subscribe</Button>
//         )
//       )}
//     </div>
//   );
// }
import { Link, NavLink } from 'react-router-dom';

import { Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import authService from '@/api/auth.service';
import { Button } from './ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Share2, Settings } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { ImageUpdateDialog } from './profileComponents/profCompIndex';
/**
 * Profile Component
 * Redesigned with a YouTube-like interface while maintaining 
 * the original logic and data structures.
 */
export default function Profile() {
  const [channelInfo, setChannelInfo] = useState(null);
  const { username } = useParams();
  const userData = useSelector(state => state.auth.userData);
const navigate = useNavigate()

const [avatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
const [coverDialogOpen, setIsCoverDialogOpen] = useState(false);
const [uploading, setUploading] = useState(false);

const handleImageUpdate = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type === 'avatar' ? 'avatar' : 'coverImage', file);

    try {
        setUploading(true);
        if (type === 'avatar') {
            await authService.updateAvatar(formData);
        } else {
            await authService.updateCoverImage(formData);
        }
        // Refresh profile data after success
        window.location.reload(); 
    } catch (error) {
        console.error(`Error updating ${type}:`, error);
    } finally {
        setUploading(false);
        setIsAvatarDialogOpen(false);
        setIsCoverDialogOpen(false);
    }
};

const tabs = [
  { label: "Home", path: "" },
  { label: "Videos", path: "videos" },
  { label: "Playlists", path: "playlists" },
  { label: "Community", path: "community" },
  { label: "About", path: "about" },
];


  const isOwnProfile = !username || username === userData?.user.username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isOwnProfile) {
          setChannelInfo(userData.user); // own profile from Redux
        } else {
          const data = await authService.getChannelInfo(username); // fetch other user
          setChannelInfo(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [username, userData, isOwnProfile]);

  if (!channelInfo) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-background pb-10">
      {/* 1. Cover Image (Banner) */}
     <div 
  className={`w-full aspect-[6/1] min-h-[150px] max-h-[280px] bg-secondary overflow-hidden relative 
    ${isOwnProfile ? "cursor-pointer hover:opacity-75 transition-opacity" : ""}`}
  onClick={isOwnProfile ? () => setIsCoverDialogOpen(true) : undefined}
>
  {channelInfo?.coverImage ? (
    <img 
      src={channelInfo.coverImage} 
      alt="Cover" 
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-r from-secondary to-muted opacity-50" />
  )}

  {/* Optional: Add a visual indicator like a camera icon only for the owner */}
  {isOwnProfile && (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity">
      <span className="text-white font-medium bg-black/40 px-4 py-2 rounded-full">
        Change Cover
      </span>
    </div>
  )}
</div>

      {/* 2. Channel Header Section */}
      <div className="container max-w-7xl mx-auto px-4 md:px-8 mt-4 md:mt-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
       <div 
  className={`shrink-0 relative group ${isOwnProfile ? "cursor-pointer" : ""}`}
  onClick={isOwnProfile ? () => setIsAvatarDialogOpen(true) : undefined}
>
  <img
    src={channelInfo?.avatar || 'https://github.com/shadcn.png'}
    alt="Avatar"
    className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background object-cover bg-secondary shadow-sm transition-all 
      ${isOwnProfile ? "group-hover:brightness-90" : ""}`}
  />

  {/* Edit Overlay */}
  {isOwnProfile && (
    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-black/50 p-3 rounded-full text-white">
        {/* You can use a Camera icon from lucide-react here */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
      </div>
    </div>
  )}
</div>

          {/* Channel Stats & Info */}
          <div className="flex-1 space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {channelInfo.fullName}
                
              </h1>
              <CheckCircle2 size={18} className="text-muted-foreground fill-current" />
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base text-muted-foreground font-medium">
              <span>@{channelInfo?.username}</span>
              <span>•</span>
              <span>{`${channelInfo?.subscribersCount || 0} subscribers`}</span>
              <span>•</span>
              <span>Videos</span> {/* Placeholder for video count if needed later */}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {isOwnProfile ? (
                <>
                  <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 font-semibold transition-all"
                  onClick = {()=>{navigate('/editProfile')}}
                  >
                    Customize Channel
                  </Button>
                  <Button variant="secondary" className="rounded-full flex items-center gap-2 font-semibold">
                    <Settings size={18} /> Manage Videos
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Button 
                    className={`rounded-full px-8 font-semibold transition-all ${
                      channelInfo.isSubscribed 
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" 
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    {channelInfo.isSubscribed ? "Subscribed" : "Subscribe"}
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                    <Share2 size={20} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs (Static UI) */}
       <div className="mt-8 border-b border-border overflow-x-auto no-scrollbar">
  <div className="flex items-center gap-8 min-w-max">

    {tabs.map((tab) => (
      <NavLink
        key={tab.label}
        to={tab.path}
        end={tab.path === ""}
        className={({ isActive }) =>
          `pb-3 text-sm md:text-base font-medium transition-colors relative ${
            isActive
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`
        }
      >
        {tab.label}
      </NavLink>

    ))}

    <ImageUpdateDialog 
        isOpen={avatarDialogOpen} 
        onClose={() => setIsAvatarDialogOpen(false)}
        onFileSelect={(e) => handleImageUpdate(e, 'avatar')}
        title="Update Profile Picture"
        uploading={uploading}
    />
    
    <ImageUpdateDialog 
        isOpen={coverDialogOpen} 
        onClose={() => setIsCoverDialogOpen(false)}
        onFileSelect={(e) => handleImageUpdate(e, 'cover')}
        title="Update Banner Image"
        uploading={uploading}
    />

  </div>
</div>


        {/* 4. Content Area Placeholder */}
        <div className="mt-12 py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl opacity-50">
         <Outlet />
        </div>
      </div>
    </div>
  );
}