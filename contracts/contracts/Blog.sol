// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Blog {
    struct Post {
        uint256 id;
        address author;
        string title;
        string content;
        uint256 timestamp;
        uint256 tipAmount;
    }
    
    struct Comment {
        uint256 id;
        uint256 postId;
        address author;
        string content;
        uint256 timestamp;
    }
    
    uint256 private postCounter;
    uint256 private commentCounter;
    
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment[]) public postComments;
    mapping(address => Post[]) public authorPosts;
    
    event PostCreated(
        uint256 id,
        address author,
        string title,
        string content,
        uint256 timestamp
    );
    
    event CommentAdded(
        uint256 id,
        uint256 postId,
        address author,
        string content,
        uint256 timestamp
    );
    
    event PostTipped(
        uint256 id,
        address author,
        address tipper,
        uint256 amount,
        uint256 timestamp
    );
    
    function createPost(string memory _title, string memory _content) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_content).length > 0, "Content cannot be empty");
        
        postCounter++;
        
        posts[postCounter] = Post(
            postCounter,
            msg.sender,
            _title,
            _content,
            block.timestamp,
            0
        );
        
        authorPosts[msg.sender].push(posts[postCounter]);
        
        emit PostCreated(
            postCounter,
            msg.sender,
            _title,
            _content,
            block.timestamp
        );
    }
    
    function addComment(uint256 _postId, string memory _content) public {
        require(_postId > 0 && _postId <= postCounter, "Post does not exist");
        require(bytes(_content).length > 0, "Comment cannot be empty");
        
        commentCounter++;
        
        Comment memory newComment = Comment(
            commentCounter,
            _postId,
            msg.sender,
            _content,
            block.timestamp
        );
        
        postComments[_postId].push(newComment);
        
        emit CommentAdded(
            commentCounter,
            _postId,
            msg.sender,
            _content,
            block.timestamp
        );
    }
    
    function tipPost(uint256 _id) public payable {
        require(_id > 0 && _id <= postCounter, "Post does not exist");
        require(msg.value > 0, "Tip amount must be greater than 0");
        
        Post storage post = posts[_id];
        address payable author = payable(post.author);
        
        author.transfer(msg.value);
        post.tipAmount += msg.value;
        
        emit PostTipped(
            _id,
            post.author,
            msg.sender,
            msg.value,
            block.timestamp
        );
    }
    
    function getPostCount() public view returns (uint256) {
        return postCounter;
    }
    
    function getCommentCount(uint256 _postId) public view returns (uint256) {
        require(_postId > 0 && _postId <= postCounter, "Post does not exist");
        return postComments[_postId].length;
    }
}