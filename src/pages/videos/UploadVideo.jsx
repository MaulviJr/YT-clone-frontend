import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import videoService from '@/api/video.service';
import { Button } from '@/components/ui/button';
import { Upload, X, Film, Image as ImageIcon, CheckCircle2 } from 'lucide-react';


function UploadVideo() {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  // Watch file fields to show selected filenames
  const selectedVideo = watch("video");
  const selectedThumbnail = watch("thumbnail");

  const handleSumbit = async (data) => {
    console.log(data);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("thumbnail", data.thumbnail[0]);
      formData.append("videoFile", data.video[0]);
      
      console.log("FormData prepared:", {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail[0],
        video: data.video[0]
      });

      const response = await videoService.publishVideo(formData);

      console.log("Upload response:", response);
      // Navigate to the video page after successful upload
      navigate(`/watch/${response._id || response.data?._id}`); 
    }
    catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Upload video</h1>
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSumbit)} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Title (required)</label>
                <input
                  {...register("title", { required: true })}
                  placeholder="Add a title that describes your video"
                  type="text"
                  className="w-full bg-transparent border border-border rounded-md p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Tell viewers about your video"
                  rows={8}
                  className="w-full bg-transparent border border-border rounded-md p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground resize-none"
                />
              </div>
            </div>

            {/* Right Column: Files & Preview */}
            <div className="space-y-6">
              
              {/* Video File Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Video File</label>
                <div className="relative group">
                  <input 
                    {...register("video", { required: true })}
                    type="file" 
                    accept="video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors ${selectedVideo?.length ? 'border-primary bg-primary/5' : 'border-border group-hover:border-muted-foreground'}`}>
                    {selectedVideo?.length ? (
                      <>
                        <Film className="text-primary" size={32} />
                        <span className="text-xs font-medium text-center truncate w-full px-2">
                          {selectedVideo[0].name}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                          <Upload className="text-muted-foreground" size={20} />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Select Video</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Thumbnail</label>
                <div className="relative group">
                  <input
                    {...register("thumbnail", { required: true })}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors ${selectedThumbnail?.length ? 'border-primary bg-primary/5' : 'border-border group-hover:border-muted-foreground'}`}>
                    {selectedThumbnail?.length ? (
                      <>
                        <ImageIcon className="text-primary" size={32} />
                        <span className="text-xs font-medium text-center truncate w-full px-2">
                          {selectedThumbnail[0].name}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                          <Upload className="text-muted-foreground" size={20} />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Select Thumbnail</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Standard Definition (SD) check</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Copyright check pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-10 pt-6 border-t border-border flex items-center justify-end gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="rounded-full px-6 font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading}
              className="rounded-full px-10 font-bold bg-primary text-primary-foreground hover:opacity-90 min-w-[140px]"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                   Uploading...
                </div>
              ) : 'Publish'}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-muted-foreground max-w-2xl mx-auto uppercase tracking-widest font-bold">
          By submitting your videos to TubeClone, you acknowledge that you agree to our Terms of Service and Community Guidelines.
        </p>
      </div>
    </div>
  )
}

export default UploadVideo;