// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CoinFlipGame
 * @dev Contract for playing a coin flip game and earning NFT badges
 */
contract CoinFlipGame is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    // Player stats
    struct PlayerStats {
        uint256 wins;
        uint256 losses;
        bool hasBadge;
    }
    
    // Mapping for player stats
    mapping(address => PlayerStats) public playerStats;
    
    // Badge threshold (how many wins needed to earn a badge)
    uint256 public badgeThreshold = 3;
    
    // Event emitted after a coin flip
    event CoinFlipped(address indexed player, bool choice, bool result, bool won);
    
    constructor() ERC721("CoinFlip Champion", "FLIP") {}
    
    /**
     * @dev Flips a coin and rewards the player if they win
     * @param isHeads The player's choice (true for heads, false for tails)
     * @return The result of the flip (true for heads, false for tails)
     */
    function flip(bool isHeads) public returns (bool) {
        // Generate a pseudo-random result
        bool result = generateRandomResult();
        
        // Determine if player won
        bool won = (result == isHeads);
        
        // Update player stats
        PlayerStats storage stats = playerStats[msg.sender];
        if (won) {
            stats.wins++;
            // Check if player has earned a badge
            if (stats.wins >= badgeThreshold && !stats.hasBadge) {
                _mintBadge(msg.sender);
                stats.hasBadge = true;
            }
        } else {
            stats.losses++;
        }
        
        // Emit event with game details
        emit CoinFlipped(msg.sender, isHeads, result, won);
        
        return result;
    }
    
    /**
     * @dev Returns the player's stats
     * @param player The address of the player
     * @return wins Number of wins
     * @return losses Number of losses
     */
    function getPlayerStats(address player) public view returns (uint256 wins, uint256 losses) {
        PlayerStats memory stats = playerStats[player];
        return (stats.wins, stats.losses);
    }
    
    /**
     * @dev Mints a badge NFT to the player
     * @param player The address receiving the badge
     */
    function _mintBadge(address player) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(player, tokenId);
        
        // Set token URI with metadata
        string memory uri = _generateBadgeURI(tokenId);
        _setTokenURI(tokenId, uri);
    }
    
    /**
     * @dev Updates the badge threshold
     * @param newThreshold The new threshold for earning a badge
     */
    function setBadgeThreshold(uint256 newThreshold) external onlyOwner {
        badgeThreshold = newThreshold;
    }
    
    /**
     * @dev Generates a pseudo-random result
     * @return A random boolean
     */
    function generateRandomResult() internal view returns (bool) {
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    msg.sender,
                    block.timestamp
                )
            )
        );
        
        return randomNumber % 2 == 0;
    }
    
    /**
     * @dev Generates the metadata for the badge NFT
     */
    function _generateBadgeURI(uint256 tokenId) internal pure returns (string memory) {
        // In a real implementation, this would likely point to IPFS
        // For demonstration, we're using Base64 encoded JSON
        
        bytes memory dataURI = abi.encodePacked(
            '{',
            '"name": "Coin Flip Champion Badge #', Strings.toString(tokenId), '",',
            '"description": "This badge proves that you are a certified Coin Flip Champion!",',
            '"image": "data:image/svg+xml;base64,', _generateBadgeSVG(tokenId), '",',
            '"attributes": [{"trait_type": "Game", "value": "Coin Flip"}]',
            '}'
        );
        
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }
    
    /**
     * @dev Generates an SVG image for the badge
     */
    function _generateBadgeSVG(uint256 tokenId) internal pure returns (string memory) {
        // Simple SVG badge
        bytes memory svg = abi.encodePacked(
            '<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="100%" height="100%" fill="#8b5cf6" />',
            '<circle cx="150" cy="120" r="80" fill="#f9d949" stroke="#f8fafc" stroke-width="4"/>',
            '<text x="150" y="140" font-family="Arial" font-size="40" text-anchor="middle" fill="#1e293b">FLIP</text>',
            '<text x="150" y="240" font-family="Arial" font-size="24" text-anchor="middle" fill="white">Champion #', Strings.toString(tokenId), '</text>',
            '</svg>'
        );
        
        return Base64.encode(svg);
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
