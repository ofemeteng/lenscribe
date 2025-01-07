import { lensCommentNFTAbi } from "@/utils/lensCommentNFTAbi";
import { Button } from "./ui/button";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { useState, useEffect } from "react";
import { chains } from "@lens-network/sdk/viem";
import { parseEther } from 'viem'

export function CommentGeneratorButton({
    onCommentGenerated,
}: {
    onCommentGenerated: (comment: string) => void;
}) {
    const { address, chainId: activeChainId } = useAccount();
    const { switchChain } = useSwitchChain();
    const {
        writeContract,
        data: txHash,
        isPending,
        isSuccess,
    } = useWriteContract();
    const [commentText, setCommentText] = useState("");
    const [isMinting, setIsMinting] = useState(false);

    const lensTestnetId = chains.testnet.id;
    const isCorrectNetwork = activeChainId === lensTestnetId;

    useEffect(() => {
        if (isSuccess && txHash) {
            alert(`Transaction confirmed! Hash: ${txHash}`);
        }
    }, [isSuccess, txHash]);

    const handleGenerateComment = async () => {
        try {
            const response = await fetch("/api/generate-comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: commentText }),
            });

            const data = await response.json();
            onCommentGenerated(data.comment);
            setCommentText(data.comment);
        } catch (error) {
            console.error("Error generating comment:", error);
        }
    };

    const handleMintNFT = async () => {
        if (!commentText) {
            alert("Please generate a comment first.");
            return;
        }

        setIsMinting(true);

        try {
            await writeContract({
                address: "0x9Ed1A34aBE89e921c2b094AdAb10DD46D98f3ED2",
                abi: lensCommentNFTAbi,
                functionName: "mintCommentNFT",
                args: [commentText],
                value: parseEther('0.00001'), // Sending 0.00001 GRASS
            });
        } catch (error) {
            console.error("Error minting NFT:", error);
        } finally {
            setIsMinting(false);
        }
    };

    if (!address) return null;

    return (
        <>
            {!isCorrectNetwork ? (
                <Button
                    variant="default"
                    size="default"
                    className="mt-4"
                    onClick={() => {
                        if (switchChain) {
                            switchChain({ chainId: lensTestnetId });
                        } else {
                            alert("Network switching is not supported in your wallet.");
                        }
                    }}
                >
                    Switch Network
                </Button>
            ) : (
                <div className="flex flex-col items-center gap-4 mt-4">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Enter your post text here..."
                        className="w-full px-3 py-2 border rounded"
                    />
                    <Button
                        variant="default"
                        size="default"
                        onClick={handleGenerateComment}
                        disabled={!commentText}
                    >
                        Generate Comment
                    </Button>
                    <Button
                        variant="default"
                        size="default"
                        onClick={handleMintNFT}
                        disabled={isMinting || !commentText}
                    >
                        {isMinting ? "Minting..." : "Mint as NFT"}
                    </Button>
                </div>
            )}
            {isPending && <div className="mt-4">Transaction pending...</div>}
            {txHash && (
                <div className="mt-4">
                    <a
                        href={chains.testnet.blockExplorers!.default.url + "/tx/" + txHash}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                    >
                        View Transaction
                    </a>
                </div>
            )}
        </>
    );
}
