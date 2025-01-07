"use client";

import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { Web3Provider } from "@/components/Web3Provider";
import { CommentGeneratorButton } from "@/components/CommentGeneratorButton";

export default function Page() {
  const [generatedComment, setGeneratedComment] = useState<string | null>(null);

  const handleCommentGenerated = (comment: string) => {
    setGeneratedComment(comment);
  };

  return (
    <Web3Provider>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Lensribe: The Lens AI Comment Generator</h1>
          <p className="mb-8">
            Generate witty comments for Lens posts and mint them as NFTs!
          </p>
          <div className="mt-5">
            <ConnectKitButton />
          </div>
          <CommentGeneratorButton
            onCommentGenerated={handleCommentGenerated}
          />
        </div>
        {generatedComment && (
          <div className="mt-4 max-w-md text-center">
            <p className="mb-4">Generated Comment:</p>
            <blockquote className="italic text-gray-600">
              "{generatedComment}"
            </blockquote>
          </div>
        )}
      </div>
    </Web3Provider>
  );
}
