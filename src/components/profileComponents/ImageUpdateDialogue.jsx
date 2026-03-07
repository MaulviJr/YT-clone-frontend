import { Button } from "../ui/button";

const ImageUpdateDialog = ({ isOpen, onClose, onFileSelect, title, uploading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-background border border-border w-full max-w-md p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="w-full h-40 border-2 border-dashed border-muted flex flex-center justify-center items-center rounded-xl bg-secondary/20">
                        <p className="text-muted-foreground text-sm">Select a high-quality JPG or PNG</p>
                    </div>
                    <input 
                        type="file" 
                        id="imageInput" 
                        className="hidden" 
                        accept="image/*"
                        onChange={onFileSelect}
                        title="Select Image"
                    />
                    <div className="flex gap-3 w-full justify-end">
                        <Button variant="ghost" onClick={onClose} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => document.getElementById('imageInput').click()}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Choose File"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpdateDialog;