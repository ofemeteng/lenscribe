// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LensCommentNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    
    uint256 public constant MINT_FEE = 0.00001 ether;
    
    mapping(uint256 => string) private _commentContents;
    
    event CommentMinted(address indexed owner, uint256 indexed tokenId, string comment);
    event PremiumCommentPaid(address indexed user, uint256 amount);

    constructor() ERC721("LensComment", "LCMT") Ownable(msg.sender) {}

    function mintCommentNFT(string memory comment) public payable returns (uint256) {
        require(msg.value == MINT_FEE, "Incorrect payment amount");
        emit PremiumCommentPaid(msg.sender, msg.value);
        
        uint256 tokenId = _nextTokenId++;
        
        _mint(msg.sender, tokenId);
        _commentContents[tokenId] = comment;
        
        emit CommentMinted(msg.sender, tokenId, comment);
        return tokenId;
    }

    function getComment(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Comment does not exist");
        return _commentContents[tokenId];
    }

    function withdrawEther() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
    }
}