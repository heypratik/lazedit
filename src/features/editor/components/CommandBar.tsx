import { Mic, Send } from 'lucide-react';
import { useState } from 'react';

import { Editor } from '@/features/editor/types';
import { useEditImage } from '@/features/ai/api/use-edit-image';

interface CommandBarProps {
  editor: Editor | undefined;
}

const CommandBar = ({ editor }: CommandBarProps) => {
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const editMutation = useEditImage();
  
  const selectedObject = editor?.selectedObjects[0];
  // @ts-ignore
  const imageSrc = selectedObject?._originalElement?.currentSrc;
  
  const isEditMode = !!imageSrc;

  const tips = [
    "If you think the loading is taking too long, you can refresh and your changes will still be saved.",
    "If you want to edit an image with a human face, try adding to the prompt 'keep the visual features of the face intact'.",
    "You can remove the background of an image by clicking on the imagee & selecting 'Remove Background' from the context menu.",
    "Check left sidebar for more tools to edit your image.",
  ]
  
  const suggestionPills = isEditMode 
    ? [
        '🎭 Remove Background',
        '✨ Upscale 2x',
        '⚡ Adjust Brightness',
        '✂️ Crop Canvas',
        '🏷️ Add "Sale" or "New" Labels'
      ]
    : [
        '🎭 Remove Background',
        '✨ Upscale 2x',
        '⚡ Adjust Brightness',
        '✂️ Crop Canvas',
        '🏷️ Add "Sale" or "New" Labels'
      ];

  const handleSubmit = (prompt: string) => {
    if (!prompt.trim() || !isEditMode || !imageSrc) return;
    
    editMutation.mutate(
      { 
        prompt: prompt.trim(),
        input_image: imageSrc,
        output_format: "jpg",
        num_inference_steps: 30
      },
      {
        onSuccess: ({ data }) => {
          // @ts-ignore
          editor?.addImage(data);
          setInputValue('');
        }
      }
    );
  };

  const handleSendClick = () => {
    handleSubmit(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(inputValue);
    }
  };

  const handlePillClick = (pill: string) => {
    if (isEditMode) {
      setInputValue(pill);
    }
  };

  return (
    <div className="w-full glass-strong gap-x-1 shrink-0">
      <div className="p-6 h-full flex flex-col justify-center">
        {/* Mode Indicator */}
        {isEditMode && (
          <div className="mb-2 text-center">
            <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
              ✏️ Edit Mode - Selected image will be modified
            </span>
          </div>
        )}

        {!isEditMode && (
          <div className="mb-2 text-center">
            <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
              Select an image to edit
            </span>
          </div>
        )}

        {/* Main Input */}
        <div className="relative flex items-center mb-3">
          {/* Microphone */}
          <button
            onClick={() => setIsListening(!isListening)}
            disabled={editMutation.isPending || !isEditMode}
            className={`mr-3 w-12 h-12 flex items-center justify-center transition-all duration-200 ${
              isListening 
                ? 'bg-red-500/20 text-red-400 animate-pulse' 
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            } ${(editMutation.isPending || !isEditMode) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Mic size={20} />
          </button>

          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={isEditMode 
                ? "Tell me how to edit this image..." 
                : "Select an image first to edit it..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={editMutation.isPending || !isEditMode}
              className="w-full h-12 bg-white/5 border-0 !border-gray-200 !border-white/20 px-4 pr-12 text-white text-base placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors duration-200 font-text disabled:opacity-50"
            />
            
            {/* Magic Wand & Send */}
            <div className="absolute right-1 top-1 flex items-center space-x-1">
              <button 
                disabled={editMutation.isPending || !isEditMode}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
              >
                ✨
              </button>
              <button 
                onClick={handleSendClick}
                disabled={editMutation.isPending || !isEditMode || !inputValue.trim()}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
              >
                {editMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestionPills.map((pill) => (
            <button
              key={pill}
              onClick={() => handlePillClick(pill)}
              disabled={editMutation.isPending || !isEditMode}
              className="h-7 px-3 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs transition-all duration-200 disabled:opacity-50"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Voice Visualization */}
        {isListening && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/60 animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandBar;