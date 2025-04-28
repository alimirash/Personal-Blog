// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ResumeNFT
 * @dev ERC721 token representing Ali Mirash's resume
 * One token per wallet address, free to mint
 */
contract ResumeNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Maximum supply of NFTs
    uint256 public maxSupply = 500;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Static IPFS URI for the resume image
    string public constant RESUME_IMAGE = "ipfs://QmYourIpfsHashHere";
    
    // Mapping to track which addresses have claimed
    mapping(address => bool) public hasClaimed;
    
    // Event emitted when an NFT is minted
    event ResumeMinted(address indexed recipient, uint256 indexed tokenId);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        // Initialize with zero tokens
    }

    /**
     * @dev Allows a user to claim their free resume NFT
     * Each address can only claim once
     */
    function mintResumeNFT() public {
        require(!hasClaimed[msg.sender], "Address has already claimed a Resume NFT");
        require(_tokenIdCounter.current() < maxSupply, "Maximum supply reached");
        
        // Mark as claimed
        hasClaimed[msg.sender] = true;
        
        // Get the current token ID and increment for next minting
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint the NFT to the caller's address
        _safeMint(msg.sender, tokenId);
        
        // Set the token URI with metadata
        _setTokenURI(tokenId, _generateTokenURI(tokenId));
        
        // Emit event
        emit ResumeMinted(msg.sender, tokenId);
    }

    /**
     * @dev Returns the total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Generate token URI with metadata
     * @param tokenId The token ID
     * @return The token URI with metadata
     */
    function _generateTokenURI(uint256 tokenId) internal pure returns (string memory) {
        // In a real implementation, this would return a URI pointing to JSON metadata
        // For simplicity, we're returning a placeholder
        // In production, you might want to store these on IPFS or use a base URI + tokenId
        
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        string(
                            abi.encodePacked(
                                '{"name":"Ali Mirash Resume NFT #', 
                                Strings.toString(tokenId),
                                '","description":"This NFT proves that you connected to Ali Mirash\'s personal Web3 resume.",',
                                '"image":"', RESUME_IMAGE, '",',
                                '"attributes":[',
                                '{"trait_type":"Skill","value":"Smart Contract Development"},',
                                '{"trait_type":"Skill","value":"Web3 Architecture"},',
                                '{"trait_type":"Skill","value":"NFT Implementation"},',
                                '{"trait_type":"Experience","value":"5+ years"}',
                                ']}'
                            )
                        )
                    )
                )
            )
        );
    }

    /**
     * @dev Set the base URI for all token IDs
     * @param baseURI The base URI to set
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Update the max supply (only owner)
     * @param newMaxSupply The new maximum supply
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= _tokenIdCounter.current(), "New max supply must be >= current supply");
        maxSupply = newMaxSupply;
    }

    /**
     * @dev Allows the contract owner to withdraw any ETH accidentally sent to the contract
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Base64 utility library for encoding strings
     */
    library Base64 {
        string internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        function encode(bytes memory data) internal pure returns (string memory) {
            uint256 len = data.length;
            if (len == 0) return "";

            // multiply by 4/3 rounded up
            uint256 encodedLen = 4 * ((len + 2) / 3);

            // Add padding for the base64 encoding
            string memory result = new string(encodedLen);
            bytes memory output = bytes(result);

            uint256 i;
            uint256 j;

            for (i = 0; i < len; i += 3) {
                // Maximum value for j is encodedLen - 4, hence within bounds
                (uint8 a, uint8 b, uint8 c) = (
                    i < len ? uint8(data[i]) : 0,
                    i + 1 < len ? uint8(data[i + 1]) : 0,
                    i + 2 < len ? uint8(data[i + 2]) : 0
                );

                output[j++] = bytes1(uint8(TABLE[a >> 2]));
                output[j++] = bytes1(uint8(TABLE[((a & 0x03) << 4) | (b >> 4)]));
                output[j++] = bytes1(uint8(TABLE[((b & 0x0f) << 2) | (c >> 6)]));
                output[j++] = bytes1(uint8(TABLE[c & 0x3f]));
            }

            for (i = encodedLen - (3 - len % 3) % 3; i < encodedLen; i++) {
                output[i] = "=";
            }

            return string(output);
        }
    }
}
