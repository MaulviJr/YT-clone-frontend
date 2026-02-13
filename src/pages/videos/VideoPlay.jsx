import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import videoService from '../../api/video.service';
import commentService from '../../api/comment.service';
import likeService from '../../api/like.service';
import subscriptionService from '../../api/subscription.service';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import VideoCard from '../../components/VideoCard';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  MoreHorizontal, 
  CheckCircle2,
  MessageSquare
} from 'lucide-react';



// const VideoPlay = () => {
//   const { videoId } = useParams();
//   const navigate = useNavigate();
//   const userData = useSelector((state) => state.auth?.userData);
  
//   const [video, setVideo] = useState(null);
//   const [relatedVideos, setRelatedVideos] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

//   useEffect(() => {
//     const fetchVideoData = async () => {
//       setLoading(true);
//       try {
//         // 1. Fetch Video Details
//         const videoResponse = await videoService.getVideoById(videoId);
//         console.log("hellow", videoResponse);
//         setVideo(videoResponse);

//         // 2. Fetch Related Videos (Showing latest videos for now)
//         const relatedResponse = await videoService.fetchVideos({ limit: 10 });
//         // setRelatedVideos(relatedResponse.data.filter(v => v._id !== videoId));

//         // 3. Fetch Comments
//         const commentsResponse = await commentService.getVideoComments(videoId);
//         // setComments(commentsResponse.data || []);
        
//       } catch (error) {
//         console.error("Error fetching video data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideoData();
//     // Scroll to top on video change
//     window.scrollTo(0, 0);
//   }, [videoId]);

//   if (loading) return (
//     <div className="flex items-center justify-center h-[80vh]">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
//     </div>
//   );

//   if (!video) return <div className="p-8 text-center">Video not found.</div>;

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-6 lg:px-10 py-6 bg-background min-h-screen">
      
//       {/* LEFT COLUMN: Main Video Content */}
//       <div className="flex-1 max-w-full lg:max-w-[calc(100%-400px)]">
        
//         {/* Video Player */}
//         <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
//           <video 
//             src={video.videoFile} 
//             controls 
//             autoPlay
//             className="w-full h-full"
//             poster={video.thumbnail}
//           />
//         </div>

//         {/* Video Title */}
//         <h1 className="text-xl md:text-2xl font-bold mt-4 text-foreground line-clamp-2">
//           {video.title}
//         </h1>

//         {/* Channel & Interactions Bar */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3">
          
//           {/* Channel Info */}
//           <div className="flex items-center gap-3">
//             <div 
//               className="cursor-pointer shrink-0"
//               onClick={() => navigate(`/channel/${video.owner?.username}`)}
//             >
//               <img 
//                 src={video.owner?.avatar || 'https://github.com/shadcn.png'} 
//                 alt="avatar" 
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             </div>
//             <div className="flex flex-col min-w-0">
//               <div className="flex items-center gap-1">
//                 <span className="font-bold text-base truncate">
//                   {video.owner?.fullName || video.owner?.username}
//                 </span>
//                 <CheckCircle2 size={14} className="text-muted-foreground fill-current" />
//               </div>
//               <span className="text-xs text-muted-foreground">
//                 {video.owner?.subscribersCount || 0} subscribers
//               </span>
//             </div>
//             <Button className="rounded-full px-5 ml-2 font-semibold text-sm h-9 bg-foreground text-background hover:bg-foreground/90">
//               Subscribe
//             </Button>
//           </div>

//           {/* Action Buttons (Like, Share, etc.) */}
//           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
//             <div className="flex items-center bg-secondary rounded-full">
//               <button className="flex items-center gap-2 px-4 py-2 hover:bg-muted-foreground/10 rounded-l-full border-r border-border transition-colors">
//                 <ThumbsUp size={20} />
//                 <span className="text-sm font-medium">{video.likesCount || 0}</span>
//               </button>
//               <button className="px-4 py-2 hover:bg-muted-foreground/10 rounded-r-full transition-colors">
//                 <ThumbsDown size={20} />
//               </button>
//             </div>
            
//             <Button variant="secondary" className="rounded-full gap-2 font-semibold">
//               <Share2 size={18} /> Share
//             </Button>
            
//             <Button variant="secondary" className="rounded-full gap-2 font-semibold hidden sm:flex">
//               <Download size={18} /> Download
//             </Button>
            
//             <Button variant="secondary" size="icon" className="rounded-full shrink-0">
//               <MoreHorizontal size={20} />
//             </Button>
//           </div>
//         </div>

//         {/* Description Box */}
//         <div className="mt-4 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
//              onClick={() => !isDescriptionExpanded && setIsDescriptionExpanded(true)}>
//           <div className="flex gap-2 text-sm font-bold mb-1">
//             <span>{video.views} views</span>
//             <span>{new Date(video.createdAt).toLocaleDateString()}</span>
//           </div>
          
//           <p className={`text-sm whitespace-pre-wrap leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
//             {video.description}
//           </p>
          
//           <button 
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsDescriptionExpanded(!isDescriptionExpanded);
//             }}
//             className="text-sm font-bold mt-2"
//           >
//             {isDescriptionExpanded ? 'Show less' : '...more'}
//           </button>
//         </div>

//         {/* Comments Section */}
//         <div className="mt-6">
//           <div className="flex items-center gap-6 mb-6">
//             <h3 className="text-xl font-bold">{comments.length} Comments</h3>
//             <div className="flex items-center gap-2 cursor-pointer">
//               <span className="text-sm font-bold">Sort by</span>
//             </div>
//           </div>
          
//           {/* Add Comment Input */}
//           <div className="flex gap-4 mb-8">
//             <img 
//               src={userData?.user?.avatar || 'https://github.com/shadcn.png'} 
//               className="w-10 h-10 rounded-full object-cover" 
//               alt="user"
//             />
//             <div className="flex-1 group">
//               <input 
//                 type="text" 
//                 placeholder="Add a comment..." 
//                 className="w-full bg-transparent border-b border-border focus:border-foreground focus:outline-none py-1 text-sm transition-all"
//               />
//               <div className="flex justify-end gap-2 mt-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
//                 <Button variant="ghost" className="rounded-full h-9 text-sm">Cancel</Button>
//                 <Button className="rounded-full h-9 text-sm px-4">Comment</Button>
//               </div>
//             </div>
//           </div>

//           {/* Comments List Placeholder */}
//           <div className="space-y-6">
//             {comments.map((comment) => (
//               <div key={comment._id} className="flex gap-4">
//                 <img src={comment.owner?.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
//                 <div>
//                   <div className="flex items-center gap-2 text-xs mb-1">
//                     <span className="font-bold text-foreground">@{comment.owner?.username}</span>
//                     <span className="text-muted-foreground">1 day ago</span>
//                   </div>
//                   <p className="text-sm mb-2">{comment.content}</p>
//                   <div className="flex items-center gap-4">
//                     <button className="flex items-center gap-1 hover:bg-secondary p-1 rounded-full"><ThumbsUp size={16}/></button>
//                     <button className="hover:bg-secondary p-1 rounded-full"><ThumbsDown size={16}/></button>
//                     <button className="text-xs font-bold hover:bg-secondary px-3 py-1 rounded-full">Reply</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT COLUMN: Recommended Videos */}
//       <div className="w-full lg:w-[400px] shrink-0">
//         <div className="flex flex-col gap-3">
//           {relatedVideos.map((item) => (
//             <VideoCard 
//               key={item._id} 
//               video={item} 
//               isSearchCard={true} // Reusing Search/List style for sidebar if VideoCard supports it
//             />
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// };

export default VideoPlay;